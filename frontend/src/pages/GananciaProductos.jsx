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
  FaBalanceScale,
  FaBox
} from 'react-icons/fa';
import { MdInventory } from 'react-icons/md';

const GananciaProductos = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [datosProductos, setDatosProductos] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await gananciaEstimadaService.obtenerGananciasProductos();
      setDatosProductos(response.data);
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar datos de productos:', err);
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
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="ganancia-loading">
        <FaSpinner className="loading-spinner" />
        <p>Cargando datos de productos...</p>
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
          <MdInventory /> Ganancia por Productos
        </h1>
        <button onClick={cargarDatos} className="btn-refresh">
          <FaSyncAlt /> Actualizar
        </button>
      </header>

      {datosProductos && (
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
                  <p className="amount positive">{formatCurrency(datosProductos.ganancia)}</p>
                </div>
              </div>

              <div className="resumen-card perdidas">
                <div className="card-icon">
                  <FaExclamationTriangle />
                </div>
                <div className="card-content">
                  <h3>Total Pérdidas</h3>
                  <p className="amount negative">{formatCurrency(datosProductos.perdida)}</p>
                </div>
              </div>

              <div className="resumen-card ganancia-neta">
                <div className="card-icon">
                  <FaBalanceScale />
                </div>
                <div className="card-content">
                  <h3>Ganancia Neta</h3>
                  <p className={`amount ${getGananciaColor(datosProductos.ganancia - datosProductos.perdida)}`}>
                    {formatCurrency(datosProductos.ganancia - datosProductos.perdida)}
                  </p>
                </div>
              </div>

              <div className="resumen-card contador">
                <div className="card-icon">
                  <FaBox />
                </div>
                <div className="card-content">
                  <h3>Recepciones de Stock</h3>
                  <p className="amount">{datosProductos.detalleProductos.length}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Tabla de Detalle */}
          <section className="tabla-detalle">
            <h2>Detalle por Producto</h2>
            <div className="tabla-container">
              <table className="tabla-ganancia">
                <thead>
                  <tr>
                    <th>ID Recepción</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Venta</th>
                    <th>Costo Unitario</th>
                    <th>Ingreso Estimado</th>
                    <th>Costo Total</th>
                    <th>Ganancia/Pérdida</th>
                    <th>Fecha Recepción</th>
                  </tr>
                </thead>
                <tbody>
                  {datosProductos.detalleProductos.map((producto) => (
                    <tr key={producto.id}>
                      <td>{producto.id}</td>
                      <td>
                        <div className="producto-info">
                          <strong>{producto.producto}</strong>
                          {producto.variante && (
                            <span className="variante">({producto.variante})</span>
                          )}
                        </div>
                      </td>
                      <td className="cantidad-cell">
                        {producto.cantidad.toLocaleString()}
                      </td>
                      <td className="currency-cell">
                        {formatCurrency(producto.precioVenta)}
                      </td>
                      <td className="currency-cell">
                        {formatCurrency(producto.costoUnitario)}
                      </td>
                      <td className="currency-cell positive">
                        {formatCurrency(producto.ingresoEstimado)}
                      </td>
                      <td className="currency-cell negative">
                        {formatCurrency(producto.costoCompra)}
                      </td>
                      <td className={`currency-cell ${getGananciaColor(producto.ganancia)}`}>
                        {formatCurrency(producto.ganancia)}
                      </td>
                      <td>
                        <div className="fecha-cell">
                          <FaCalendarAlt />
                          {formatDate(producto.fecha)}
                        </div>
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
                <h4>Margen Promedio por Producto</h4>
                <p className="estadistica-valor">
                  {datosProductos.detalleProductos.length > 0 && (
                    gananciaEstimadaService.formatPercentage(
                      (datosProductos.detalleProductos.reduce((acc, p) => {
                        const margen = p.ingresoEstimado > 0 ? ((p.ganancia / p.ingresoEstimado) * 100) : 0;
                        return acc + margen;
                      }, 0) / datosProductos.detalleProductos.length)
                    )
                  )}
                </p>
              </div>

              <div className="estadistica-card">
                <h4>Productos Rentables</h4>
                <p className="estadistica-valor positive">
                  {datosProductos.detalleProductos.filter(p => p.ganancia > 0).length} / {datosProductos.detalleProductos.length}
                </p>
              </div>

              <div className="estadistica-card">
                <h4>Productos con Pérdida</h4>
                <p className="estadistica-valor negative">
                  {datosProductos.detalleProductos.filter(p => p.ganancia < 0).length} / {datosProductos.detalleProductos.length}
                </p>
              </div>

              <div className="estadistica-card">
                <h4>Mayor Ganancia Individual</h4>
                <p className="estadistica-valor positive">
                  {datosProductos.detalleProductos.length > 0 && 
                    formatCurrency(Math.max(...datosProductos.detalleProductos.map(p => p.ganancia)))
                  }
                </p>
              </div>
            </div>
          </section>

          {/* Top Productos */}
          <section className="top-productos">
            <div className="top-productos-grid">
              <div className="top-card">
                <h3>Top 5 - Productos Más Rentables</h3>
                <div className="top-lista">
                  {datosProductos.detalleProductos
                    .sort((a, b) => b.ganancia - a.ganancia)
                    .slice(0, 5)
                    .map((producto, index) => (
                      <div key={producto.id} className="top-item">
                        <span className="posicion">#{index + 1}</span>
                        <div className="producto-info">
                          <strong>{producto.producto}</strong>
                          {producto.variante && <span>({producto.variante})</span>}
                        </div>
                        <span className="ganancia positive">
                          {formatCurrency(producto.ganancia)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="top-card">
                <h3>Top 5 - Productos con Mayor Pérdida</h3>
                <div className="top-lista">
                  {datosProductos.detalleProductos
                    .filter(p => p.ganancia < 0)
                    .sort((a, b) => a.ganancia - b.ganancia)
                    .slice(0, 5)
                    .map((producto, index) => (
                      <div key={producto.id} className="top-item">
                        <span className="posicion">#{index + 1}</span>
                        <div className="producto-info">
                          <strong>{producto.producto}</strong>
                          {producto.variante && <span>({producto.variante})</span>}
                        </div>
                        <span className="ganancia negative">
                          {formatCurrency(producto.ganancia)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </section>

          {/* Recomendaciones */}
          <section className="recomendaciones">
            <h2>Recomendaciones</h2>
            <div className="recomendaciones-container">
              {datosProductos.detalleProductos.filter(p => p.ganancia < 0).length > 0 && (
                <div className="recomendacion recomendacion-warning">
                  <FaExclamationTriangle />
                  <div>
                    <h4>Productos con Pérdida Detectados</h4>
                    <p>
                      Hay {datosProductos.detalleProductos.filter(p => p.ganancia < 0).length} recepciones 
                      con pérdida. Revisa los precios de compra y venta de estos productos.
                    </p>
                  </div>
                </div>
              )}

              {datosProductos.detalleProductos.some(p => (p.ganancia / p.ingresoEstimado) * 100 < 10 && p.ganancia > 0) && (
                <div className="recomendacion recomendacion-info">
                  <FaBalanceScale />
                  <div>
                    <h4>Productos con Margen Bajo</h4>
                    <p>
                      Algunos productos tienen margen de ganancia menor al 10%. 
                      Considera ajustar precios o buscar mejores proveedores.
                    </p>
                  </div>
                </div>
              )}

              {datosProductos.detalleProductos.filter(p => p.ganancia > 0).length / datosProductos.detalleProductos.length > 0.8 && (
                <div className="recomendacion recomendacion-success">
                  <FaDollarSign />
                  <div>
                    <h4>Excelente Gestión de Productos</h4>
                    <p>
                      Más del 80% de las recepciones están generando ganancia. 
                      ¡Mantén esta estrategia de compras!
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

export default GananciaProductos;
