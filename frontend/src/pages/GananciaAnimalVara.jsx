import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gananciaEstimadaService from '@services/gananciaEstimada.service.js';
import '@styles/gananciaEstimada.css';
import {
  FaArrowLeft,
  FaSpinner,
  FaExclamationTriangle,
  FaSyncAlt,
  FaCalendarAlt,
  FaDollarSign,
  FaBalanceScale
} from 'react-icons/fa';
import { GiCow } from 'react-icons/gi';

const GananciaAnimalVara = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [datosAnimalVara, setDatosAnimalVara] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await gananciaEstimadaService.obtenerGananciasAnimalVara();
      setDatosAnimalVara(response.data);
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar datos de animal vara:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return gananciaEstimadaService.formatCurrency(amount);
  };

  const getGananciaColor = (ganancia) => {
    return gananciaEstimadaService.getGananciaColor(ganancia);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CL');
  };

  if (loading) {
    return (
      <div className="ganancia-loading">
        <FaSpinner className="loading-spinner" />
        <p>Cargando datos de animal vara...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ganancia-error">
        <FaExclamationTriangle className="error-icon" />
        <h3>Error al cargar datos</h3>
        <p>{error}</p>
        <button onClick={cargarDatos} className="btn-retry">
          <FaSyncAlt /> Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="ganancia-detalle-container">
      <header className="detalle-header">
        <button onClick={() => navigate('/ganancia-estimada')} className="btn-back">
          <FaArrowLeft /> Volver
        </button>
        <h1>
          <GiCow /> Ganancia por Animal en Vara
        </h1>
        <button onClick={cargarDatos} className="btn-refresh">
          <FaSyncAlt /> Actualizar
        </button>
      </header>

      {datosAnimalVara && (
        <>
          {/* Resumen */}
          <section className="resumen-categoria">
            <div className="resumen-cards">
              <div className="resumen-card ganancias">
                <div className="card-icon">
                  <FaDollarSign />
                </div>
                <div className="card-content">
                  <h3>Total Ganancias</h3>
                  <p className="amount positive">{formatCurrency(datosAnimalVara.ganancia)}</p>
                </div>
              </div>

              <div className="resumen-card perdidas">
                <div className="card-icon">
                  <FaExclamationTriangle />
                </div>
                <div className="card-content">
                  <h3>Total Pérdidas</h3>
                  <p className="amount negative">{formatCurrency(datosAnimalVara.perdida)}</p>
                </div>
              </div>

              <div className="resumen-card ganancia-neta">
                <div className="card-icon">
                  <FaBalanceScale />
                </div>
                <div className="card-content">
                  <h3>Ganancia Neta</h3>
                  <p className={`amount ${getGananciaColor(datosAnimalVara.ganancia - datosAnimalVara.perdida)}`}>
                    {formatCurrency(datosAnimalVara.ganancia - datosAnimalVara.perdida)}
                  </p>
                </div>
              </div>

              <div className="resumen-card contador">
                <div className="card-icon">
                  <GiCow />
                </div>
                <div className="card-content">
                  <h3>Animales Procesados</h3>
                  <p className="amount">{datosAnimalVara.detalleAnimales.length}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Tabla de Detalle */}
          <section className="tabla-detalle">
            <h2>Detalle por Animal</h2>
            <div className="tabla-container">
              <table className="tabla-ganancia">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tipo de Animal</th>
                    <th>Fecha de Llegada</th>
                    <th>Ingresos por Cortes</th>
                    <th>Costo de Vara</th>
                    <th>Ganancia/Pérdida</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {datosAnimalVara.detalleAnimales.map((animal) => (
                    <tr key={animal.id}>
                      <td>{animal.id}</td>
                      <td>{animal.tipoAnimal}</td>
                      <td>
                        <div className="fecha-cell">
                          <FaCalendarAlt />
                          {formatDate(animal.fechaLlegada)}
                        </div>
                      </td>
                      <td className="currency-cell positive">
                        {formatCurrency(animal.ingresosPorCortes)}
                      </td>
                      <td className="currency-cell negative">
                        {formatCurrency(animal.costoVara)}
                      </td>
                      <td className={`currency-cell ${getGananciaColor(animal.ganancia)}`}>
                        {formatCurrency(animal.ganancia)}
                      </td>
                      <td>
                        <span className={`estado-badge ${animal.ganancia >= 0 ? 'ganancia' : 'perdida'}`}>
                          {animal.ganancia >= 0 ? 'Ganancia' : 'Pérdida'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Estadísticas Adicionales */}
          <section className="estadisticas-adicionales">
            <h2>Estadísticas</h2>
            <div className="estadisticas-grid">
              <div className="estadistica-card">
                <h4>Promedio de Ganancia por Animal</h4>
                <p className={`estadistica-valor ${getGananciaColor(
                  (datosAnimalVara.ganancia - datosAnimalVara.perdida) / datosAnimalVara.detalleAnimales.length
                )}`}>
                  {formatCurrency(
                    (datosAnimalVara.ganancia - datosAnimalVara.perdida) / datosAnimalVara.detalleAnimales.length
                  )}
                </p>
              </div>

              <div className="estadistica-card">
                <h4>Animales con Ganancia</h4>
                <p className="estadistica-valor positive">
                  {datosAnimalVara.detalleAnimales.filter(a => a.ganancia > 0).length} / {datosAnimalVara.detalleAnimales.length}
                </p>
              </div>

              <div className="estadistica-card">
                <h4>Animales con Pérdida</h4>
                <p className="estadistica-valor negative">
                  {datosAnimalVara.detalleAnimales.filter(a => a.ganancia < 0).length} / {datosAnimalVara.detalleAnimales.length}
                </p>
              </div>

              <div className="estadistica-card">
                <h4>Mejor Rendimiento</h4>
                <p className="estadistica-valor positive">
                  {datosAnimalVara.detalleAnimales.length > 0 && 
                    formatCurrency(Math.max(...datosAnimalVara.detalleAnimales.map(a => a.ganancia)))
                  }
                </p>
              </div>
            </div>
          </section>

          {/* Recomendaciones */}
          <section className="recomendaciones">
            <h2>Recomendaciones</h2>
            <div className="recomendaciones-container">
              {datosAnimalVara.detalleAnimales.filter(a => a.ganancia < 0).length > 0 && (
                <div className="recomendacion recomendacion-warning">
                  <FaExclamationTriangle />
                  <div>
                    <h4>Animales con Pérdida Detectados</h4>
                    <p>
                      Hay {datosAnimalVara.detalleAnimales.filter(a => a.ganancia < 0).length} animales 
                      con pérdida. Revisa los precios de compra y venta para optimizar la rentabilidad.
                    </p>
                  </div>
                </div>
              )}

              {(datosAnimalVara.ganancia - datosAnimalVara.perdida) / datosAnimalVara.detalleAnimales.length < 50000 && (
                <div className="recomendacion recomendacion-info">
                  <FaBalanceScale />
                  <div>
                    <h4>Ganancia Promedio Baja</h4>
                    <p>
                      La ganancia promedio por animal es baja. Considera negociar mejores precios 
                      de compra o ajustar los precios de venta de los cortes.
                    </p>
                  </div>
                </div>
              )}

              {datosAnimalVara.detalleAnimales.filter(a => a.ganancia > 0).length / datosAnimalVara.detalleAnimales.length > 0.8 && (
                <div className="recomendacion recomendacion-success">
                  <FaDollarSign />
                  <div>
                    <h4>Excelente Rendimiento</h4>
                    <p>
                      Más del 80% de los animales están generando ganancia. 
                      ¡Mantén esta estrategia de compra y venta!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default GananciaAnimalVara;
