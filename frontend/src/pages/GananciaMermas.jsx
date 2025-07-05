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
  FaInfoCircle,
  FaEye
} from 'react-icons/fa';
import { MdInventory } from 'react-icons/md';
import { GiMeat, GiCow } from 'react-icons/gi';

const GananciaMermas = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [datosMermas, setDatosMermas] = useState(null);
  const [mermaSeleccionada, setMermaSeleccionada] = useState(null);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await gananciaEstimadaService.obtenerPerdidasMermas();
      setDatosMermas(response.data);
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar datos de mermas:', err);
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

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case 'producto':
        return <MdInventory />;
      case 'subproducto':
        return <GiMeat />;
      case 'carne':
        return <GiCow />;
      default:
        return <FaExclamationTriangle />;
    }
  };

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case 'producto':
        return 'tipo-producto';
      case 'subproducto':
        return 'tipo-subproducto';
      case 'carne':
        return 'tipo-carne';
      default:
        return 'tipo-default';
    }
  };

  const verDetalle = (merma) => {
    setMermaSeleccionada(merma);
    setMostrarDetalle(true);
  };

  const cerrarDetalle = () => {
    setMostrarDetalle(false);
    setMermaSeleccionada(null);
  };

  if (loading) {
    return (
      <div className="ganancia-loading">
        <FaSpinner className="loading-spinner" />
        <p>Cargando datos de mermas...</p>
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
          <FaExclamationTriangle /> Pérdidas por Mermas
        </h1>
        <button onClick={cargarDatos} className="btn-refresh">
          <FaSyncAlt /> Actualizar
        </button>
      </header>

      {datosMermas && (
        <>
          {/* Resumen */}
          <section className="resumen-categoria">
            <div className="resumen-cards">
              <div className="resumen-card perdidas-total">
                <div className="card-icon">
                  <FaExclamationTriangle />
                </div>
                <div className="card-content">
                  <h3>Pérdida Total</h3>
                  <p className="amount negative">{formatCurrency(datosMermas.perdidaTotal)}</p>
                </div>
              </div>

              <div className="resumen-card contador">
                <div className="card-icon">
                  <FaInfoCircle />
                </div>
                <div className="card-content">
                  <h3>Registros de Merma</h3>
                  <p className="amount">{datosMermas.detalleMermas.length}</p>
                </div>
              </div>

              <div className="resumen-card promedio">
                <div className="card-icon">
                  <FaExclamationTriangle />
                </div>
                <div className="card-content">
                  <h3>Pérdida Promedio</h3>
                  <p className="amount negative">
                    {datosMermas.detalleMermas.length > 0 &&
                      formatCurrency(datosMermas.perdidaTotal / datosMermas.detalleMermas.length)
                    }
                  </p>
                </div>
              </div>

              <div className="resumen-card mayor-perdida">
                <div className="card-icon">
                  <FaExclamationTriangle />
                </div>
                <div className="card-content">
                  <h3>Mayor Pérdida Individual</h3>
                  <p className="amount negative">
                    {datosMermas.detalleMermas.length > 0 &&
                      formatCurrency(Math.max(...datosMermas.detalleMermas.map(m => m.perdida)))
                    }
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Tabla de Mermas */}
          <section className="tabla-detalle">
            <h2>Registros de Mermas</h2>
            <div className="tabla-container">
              <table className="tabla-ganancia">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>Tipo</th>
                    <th>Producto</th>
                    <th>Cantidad Perdida</th>
                    <th>Precio Referencia</th>
                    <th>Pérdida Total</th>
                    <th>Causa</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {datosMermas.detalleMermas.map((merma) => (
                    <tr key={merma.id}>
                      <td>{merma.id}</td>
                      <td>
                        <div className="fecha-cell">
                          <FaCalendarAlt />
                          {formatDate(merma.fechaRegistro)}
                        </div>
                      </td>
                      <td>
                        <span className={`tipo-badge ${getTipoColor(merma.tipoProducto)}`}>
                          {getTipoIcon(merma.tipoProducto)}
                          {merma.tipoProducto}
                        </span>
                      </td>
                      <td>
                        <div className="producto-info-merma">
                          {merma.producto && (
                            <>
                              {merma.producto.tipo === 'producto' && (
                                <div>
                                  <strong>{merma.producto.nombre}</strong>
                                  {merma.producto.variante && (
                                    <span className="variante">({merma.producto.variante})</span>
                                  )}
                                </div>
                              )}
                              {merma.producto.tipo === 'carne' && (
                                <div>
                                  <strong>{merma.producto.tipoCorteCarne}</strong>
                                  <span className="lista">Lista: {merma.producto.nombreLista}</span>
                                </div>
                              )}
                              {merma.producto.tipo === 'subproducto' && (
                                <div>
                                  <strong>Subproducto</strong>
                                  <span>Faena: {formatDate(merma.producto.fechaFaena)}</span>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                      <td className="cantidad-cell">
                        {merma.cantidadPerdida.toLocaleString()}
                      </td>
                      <td className="currency-cell">
                        {formatCurrency(merma.precioReferencia)}
                      </td>
                      <td className="currency-cell negative">
                        {formatCurrency(merma.perdida)}
                      </td>
                      <td className="causa-cell">
                        <span className="causa-texto" title={merma.causa}>
                          {merma.causa.length > 30 ? `${merma.causa.substring(0, 30)}...` : merma.causa}
                        </span>
                      </td>
                      <td>
                        <button 
                          onClick={() => verDetalle(merma)}
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

          {/* Estadísticas por Tipo */}
          <section className="estadisticas-tipos">
            <h2>Pérdidas por Tipo de Producto</h2>
            <div className="tipos-grid">
              {(() => {
                const tiposAgrupados = {};
                datosMermas.detalleMermas.forEach(merma => {
                  if (!tiposAgrupados[merma.tipoProducto]) {
                    tiposAgrupados[merma.tipoProducto] = {
                      perdidaTotal: 0,
                      cantidadTotal: 0,
                      registros: 0
                    };
                  }
                  tiposAgrupados[merma.tipoProducto].perdidaTotal += merma.perdida;
                  tiposAgrupados[merma.tipoProducto].cantidadTotal += merma.cantidadPerdida;
                  tiposAgrupados[merma.tipoProducto].registros += 1;
                });

                return Object.entries(tiposAgrupados).map(([tipo, datos]) => (
                  <div key={tipo} className={`tipo-card ${getTipoColor(tipo)}`}>
                    <div className="tipo-header">
                      {getTipoIcon(tipo)}
                      <h4>{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</h4>
                    </div>
                    <div className="tipo-stats">
                      <p>Pérdida Total: <strong className="negative">{formatCurrency(datos.perdidaTotal)}</strong></p>
                      <p>Cantidad Total: <strong>{datos.cantidadTotal.toLocaleString()}</strong></p>
                      <p>Registros: <strong>{datos.registros}</strong></p>
                      <p>Pérdida Promedio: <strong className="negative">
                        {formatCurrency(datos.perdidaTotal / datos.registros)}
                      </strong></p>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </section>

          {/* Top Causas de Merma */}
          <section className="top-causas">
            <h2>Principales Causas de Merma</h2>
            <div className="causas-container">
              {(() => {
                const causasAgrupadas = {};
                datosMermas.detalleMermas.forEach(merma => {
                  if (!causasAgrupadas[merma.causa]) {
                    causasAgrupadas[merma.causa] = {
                      perdidaTotal: 0,
                      cantidadRegistros: 0
                    };
                  }
                  causasAgrupadas[merma.causa].perdidaTotal += merma.perdida;
                  causasAgrupadas[merma.causa].cantidadRegistros += 1;
                });

                return Object.entries(causasAgrupadas)
                  .sort(([,a], [,b]) => b.perdidaTotal - a.perdidaTotal)
                  .slice(0, 5)
                  .map(([causa, datos], index) => (
                    <div key={causa} className="causa-item">
                      <span className="posicion">#{index + 1}</span>
                      <div className="causa-info">
                        <strong>{causa}</strong>
                        <p>{datos.cantidadRegistros} registros</p>
                      </div>
                      <span className="perdida negative">
                        {formatCurrency(datos.perdidaTotal)}
                      </span>
                    </div>
                  ));
              })()}
            </div>
          </section>
        </>
      )}

      {/* Modal de Detalle */}
      {mostrarDetalle && mermaSeleccionada && (
        <div className="modal-overlay" onClick={cerrarDetalle}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <FaExclamationTriangle /> Detalle de Merma #{mermaSeleccionada.id}
              </h2>
              <button className="btn-close" onClick={cerrarDetalle}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="detalle-info">
                <div className="info-grid">
                  <div className="info-item">
                    <label>Fecha de Registro:</label>
                    <span>{formatDate(mermaSeleccionada.fechaRegistro)}</span>
                  </div>
                  <div className="info-item">
                    <label>Tipo de Producto:</label>
                    <span className={`tipo-badge ${getTipoColor(mermaSeleccionada.tipoProducto)}`}>
                      {getTipoIcon(mermaSeleccionada.tipoProducto)}
                      {mermaSeleccionada.tipoProducto}
                    </span>
                  </div>
                  <div className="info-item">
                    <label>Cantidad Perdida:</label>
                    <span>{mermaSeleccionada.cantidadPerdida.toLocaleString()}</span>
                  </div>
                  <div className="info-item">
                    <label>Precio de Referencia:</label>
                    <span>{formatCurrency(mermaSeleccionada.precioReferencia)}</span>
                  </div>
                  <div className="info-item">
                    <label>Pérdida Total:</label>
                    <span className="negative">{formatCurrency(mermaSeleccionada.perdida)}</span>
                  </div>
                  <div className="info-item full-width">
                    <label>Causa:</label>
                    <span>{mermaSeleccionada.causa}</span>
                  </div>
                  {mermaSeleccionada.detalles && (
                    <div className="info-item full-width">
                      <label>Detalles Adicionales:</label>
                      <span>{mermaSeleccionada.detalles}</span>
                    </div>
                  )}
                </div>

                {mermaSeleccionada.producto && (
                  <div className="producto-detalle">
                    <h4>Información del Producto Afectado</h4>
                    <div className="producto-info-detallada">
                      {mermaSeleccionada.producto.tipo === 'producto' && (
                        <>
                          <p><strong>Nombre:</strong> {mermaSeleccionada.producto.nombre}</p>
                          {mermaSeleccionada.producto.variante && (
                            <p><strong>Variante:</strong> {mermaSeleccionada.producto.variante}</p>
                          )}
                        </>
                      )}
                      {mermaSeleccionada.producto.tipo === 'carne' && (
                        <>
                          <p><strong>Tipo de Corte:</strong> {mermaSeleccionada.producto.tipoCorteCarne}</p>
                          <p><strong>Lista de Precios:</strong> {mermaSeleccionada.producto.nombreLista}</p>
                        </>
                      )}
                      {mermaSeleccionada.producto.tipo === 'subproducto' && (
                        <>
                          <p><strong>Fecha de Faena:</strong> {formatDate(mermaSeleccionada.producto.fechaFaena)}</p>
                          <p><strong>Fecha de Entrega:</strong> {formatDate(mermaSeleccionada.producto.fechaEntrega)}</p>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GananciaMermas;
