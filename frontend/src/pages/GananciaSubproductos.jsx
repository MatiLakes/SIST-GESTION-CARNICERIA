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
  FaEye
} from 'react-icons/fa';
import { GiMeat, GiCow } from 'react-icons/gi';

const GananciaSubproductos = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [datosSubproductos, setDatosSubproductos] = useState(null);
  const [subproductoSeleccionado, setSubproductoSeleccionado] = useState(null);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await gananciaEstimadaService.obtenerGananciasSubproductos();
      setDatosSubproductos(response.data);
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar datos de subproductos:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return gananciaEstimadaService.formatCurrency(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CL');
  };

  const verDetalle = (subproducto) => {
    setSubproductoSeleccionado(subproducto);
    setMostrarDetalle(true);
  };

  const cerrarDetalle = () => {
    setMostrarDetalle(false);
    setSubproductoSeleccionado(null);
  };

  if (loading) {
    return (
      <div className="ganancia-loading">
        <FaSpinner className="loading-spinner" />
        <p>Cargando datos de subproductos...</p>
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
          <GiMeat /> Ganancia por Subproductos
        </h1>
        <button onClick={cargarDatos} className="btn-refresh">
          <FaSyncAlt /> Actualizar
        </button>
      </header>

      {datosSubproductos && (
        <>
          {/* Resumen */}
          <section className="resumen-categoria">
            <div className="resumen-cards">
              <div className="resumen-card ganancias">
                <div className="card-icon">
                  <FaDollarSign />
                </div>
                <div className="card-content">
                  <h3>Ganancia Total</h3>
                  <p className="amount positive">{formatCurrency(datosSubproductos.ganancia)}</p>
                </div>
              </div>

              <div className="resumen-card contador">
                <div className="card-icon">
                  <GiMeat />
                </div>
                <div className="card-content">
                  <h3>Registros de Subproductos</h3>
                  <p className="amount">{datosSubproductos.detalleSubproductos.length}</p>
                </div>
              </div>

              <div className="resumen-card promedio">
                <div className="card-icon">
                  <GiCow />
                </div>
                <div className="card-content">
                  <h3>Ganancia Promedio</h3>
                  <p className="amount positive">
                    {datosSubproductos.detalleSubproductos.length > 0 &&
                      formatCurrency(datosSubproductos.ganancia / datosSubproductos.detalleSubproductos.length)
                    }
                  </p>
                </div>
              </div>

              <div className="resumen-card total-animales">
                <div className="card-icon">
                  <GiCow />
                </div>
                <div className="card-content">
                  <h3>Total Animales Faenados</h3>
                  <p className="amount">
                    {datosSubproductos.detalleSubproductos.reduce((total, sub) => 
                      total + sub.numeroAnimalesFaenados, 0
                    )}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Tabla de Registros */}
          <section className="tabla-detalle">
            <h2>Registros de Subproductos</h2>
            <div className="tabla-container">
              <table className="tabla-ganancia">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Fecha Faena</th>
                    <th>Fecha Entrega</th>
                    <th>Animales Faenados</th>
                    <th>Ganancia Total</th>
                    <th>Tipos Entregados</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {datosSubproductos.detalleSubproductos.map((subproducto) => (
                    <tr key={subproducto.id}>
                      <td>{subproducto.id}</td>
                      <td>
                        <div className="fecha-cell">
                          <FaCalendarAlt />
                          {formatDate(subproducto.fechaFaena)}
                        </div>
                      </td>
                      <td>
                        <div className="fecha-cell">
                          <FaCalendarAlt />
                          {formatDate(subproducto.fechaEntrega)}
                        </div>
                      </td>
                      <td className="cantidad-cell">
                        {subproducto.numeroAnimalesFaenados}
                      </td>
                      <td className="currency-cell positive">
                        {formatCurrency(subproducto.gananciaTotal)}
                      </td>
                      <td>
                        <span className="tipos-badge">
                          {subproducto.detalleCortes.length} tipos
                        </span>
                      </td>
                      <td>
                        <button 
                          onClick={() => verDetalle(subproducto)}
                          className="btn-accion"
                          title="Ver detalle"
                        >
                          <FaEye />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Estadísticas por Tipo de Subproducto */}
          <section className="estadisticas-tipos">
            <h2>Estadísticas por Tipo de Subproducto</h2>
            <div className="tipos-grid">
              {(() => {
                // Agrupar por tipo de subproducto
                const tiposAgrupados = {};
                datosSubproductos.detalleSubproductos.forEach(sub => {
                  sub.detalleCortes.forEach(corte => {
                    if (!tiposAgrupados[corte.tipo]) {
                      tiposAgrupados[corte.tipo] = {
                        cantidadTotal: 0,
                        gananciaTotal: 0,
                        registros: 0
                      };
                    }
                    tiposAgrupados[corte.tipo].cantidadTotal += corte.cantidadEntregada;
                    tiposAgrupados[corte.tipo].gananciaTotal += corte.ganancia;
                    tiposAgrupados[corte.tipo].registros += 1;
                  });
                });

                return Object.entries(tiposAgrupados).map(([tipo, datos]) => (
                  <div key={tipo} className="tipo-card">
                    <h4>{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</h4>
                    <div className="tipo-stats">
                      <p>Cantidad Total: <strong>{datos.cantidadTotal}</strong></p>
                      <p>Ganancia: <strong className="positive">{formatCurrency(datos.gananciaTotal)}</strong></p>
                      <p>Registros: <strong>{datos.registros}</strong></p>
                      <p>Promedio: <strong className="positive">
                        {formatCurrency(datos.gananciaTotal / datos.registros)}
                      </strong></p>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </section>
        </>
      )}

      {/* Modal de Detalle */}
      {mostrarDetalle && subproductoSeleccionado && (
        <div className="modal-overlay" onClick={cerrarDetalle}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <GiMeat /> Detalle del Registro #{subproductoSeleccionado.id}
              </h2>
              <button className="btn-close" onClick={cerrarDetalle}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="detalle-info">
                <div className="info-grid">
                  <div className="info-item">
                    <label>Fecha de Faena:</label>
                    <span>{formatDate(subproductoSeleccionado.fechaFaena)}</span>
                  </div>
                  <div className="info-item">
                    <label>Fecha de Entrega:</label>
                    <span>{formatDate(subproductoSeleccionado.fechaEntrega)}</span>
                  </div>
                  <div className="info-item">
                    <label>Animales Faenados:</label>
                    <span>{subproductoSeleccionado.numeroAnimalesFaenados}</span>
                  </div>
                  <div className="info-item">
                    <label>Ganancia Total:</label>
                    <span className="positive">{formatCurrency(subproductoSeleccionado.gananciaTotal)}</span>
                  </div>
                </div>

                <h3>Detalle por Tipo de Subproducto</h3>
                <div className="tabla-container">
                  <table className="tabla-detalle-modal">
                    <thead>
                      <tr>
                        <th>Tipo</th>
                        <th>Cantidad Entregada</th>
                        <th>Precio Unitario</th>
                        <th>Ganancia</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subproductoSeleccionado.detalleCortes.map((corte, index) => (
                        <tr key={index}>
                          <td>
                            <strong>{corte.tipo.charAt(0).toUpperCase() + corte.tipo.slice(1)}</strong>
                          </td>
                          <td className="cantidad-cell">{corte.cantidadEntregada}</td>
                          <td className="currency-cell">{formatCurrency(corte.precio)}</td>
                          <td className="currency-cell positive">{formatCurrency(corte.ganancia)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GananciaSubproductos;
