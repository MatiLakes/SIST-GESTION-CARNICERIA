import { useState, useEffect } from 'react';
import gananciaEstimadaService from '@services/gananciaEstimada.service.js';
import '@styles/gananciaEstimada.css';
import {
  FaChartLine,
  FaExclamationTriangle,
  FaArrowUp,
  FaArrowDown,
  FaBalanceScale,
  FaSyncAlt,
  FaSpinner,
  FaCalendarAlt,
  FaInfoCircle
} from 'react-icons/fa';
import { GiCow, GiMeat } from 'react-icons/gi';
import { MdInventory } from 'react-icons/md';

const GananciaEstimadaCompleta = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [datosCompletos, setDatosCompletos] = useState(null);

  useEffect(() => {
    cargarDatosCompletos();
  }, []);

  const cargarDatosCompletos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await gananciaEstimadaService.obtenerGananciaCompleta();
      setDatosCompletos(response.data);
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar datos completos:', err);
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

  if (loading) {
    return (
      <div className="ganancia-loading">
        <FaSpinner className="loading-spinner" />
        <p>Cargando cálculo de ganancia estimada...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ganancia-error">
        <FaExclamationTriangle className="error-icon" />
        <h3>Error al cargar ganancia estimada</h3>
        <p>{error}</p>
        <button onClick={cargarDatosCompletos} className="btn-retry">
          <FaSyncAlt /> Reintentar
        </button>
      </div>
    );
  }

  const { detalles, resumen } = datosCompletos || {};

  return (
    <div className="ganancia-estimada-container">
      <header className="ganancia-header">
        <h1>
          <FaChartLine /> Ganancia Estimada Total
        </h1>
        <button onClick={cargarDatosCompletos} className="btn-actualizar">
          <FaSyncAlt /> Actualizar
        </button>
      </header>

      {/* Resumen Principal */}
      <section className="resumen-principal">
        <div className="resumen-cards">
          <div className="resumen-card ganancias">
            <div className="card-icon">
              <FaArrowUp />
            </div>
            <div className="card-content">
              <h3>Total Ganancias</h3>
              <p className="amount positive">{formatCurrency(resumen?.totalGanancias || 0)}</p>
            </div>
          </div>

          <div className="resumen-card perdidas">
            <div className="card-icon">
              <FaArrowDown />
            </div>
            <div className="card-content">
              <h3>Total Pérdidas</h3>
              <p className="amount negative">{formatCurrency(resumen?.totalPerdidas || 0)}</p>
            </div>
          </div>

          <div className="resumen-card neto">
            <div className="card-icon">
              <FaBalanceScale />
            </div>
            <div className="card-content">
              <h3>Ganancia Neta</h3>
              <p className={`amount ${getGananciaColor(resumen?.gananciaEstimadaTotal || 0)}`}>
                {formatCurrency(resumen?.gananciaEstimadaTotal || 0)}
              </p>
              <small>Margen: {resumen?.margenGanancia || '0.00'}%</small>
            </div>
          </div>
        </div>
      </section>

      {/* Sección Animal en Vara */}
      <section className="detalle-seccion">
        <div className="seccion-header">
          <h2>
            <GiCow /> Ganancias por Animal en Vara
          </h2>
          <div className="seccion-resumen">
            <span className="ganancia-total">
              {formatCurrency(detalles?.animalVara?.gananciaTotal || 0)}
            </span>
          </div>
        </div>
        
        <div className="tabla-container">
          <table className="detalle-tabla">
            <thead>
              <tr>
                <th>Animal</th>
                <th>Fecha Ingreso</th>
                <th>Costo Total</th>
                <th>Ingresos Estimados</th>
                <th>Ganancia</th>
                <th>Margen</th>
              </tr>
            </thead>
            <tbody>
              {detalles?.animalVara?.detalles?.map((animal, index) => (
                <tr key={index}>
                  <td>
                    <div className="animal-info">
                      <strong>#{animal.id}</strong>
                      <small>{animal.tipoAnimal}</small>
                    </div>
                  </td>
                  <td>
                    <FaCalendarAlt />
                    {new Date(animal.fechaIngreso).toLocaleDateString()}
                  </td>
                  <td className="amount negative">
                    {formatCurrency(animal.costoTotal)}
                  </td>
                  <td className="amount positive">
                    {formatCurrency(animal.ingresosEstimados)}
                  </td>
                  <td className={`amount ${getGananciaColor(animal.ganancia)}`}>
                    {formatCurrency(animal.ganancia)}
                  </td>
                  <td>
                    <span className={`margen ${getGananciaColor(animal.ganancia)}`}>
                      {animal.margen}%
                    </span>
                  </td>
                </tr>
              )) || (
                <tr>
                  <td colSpan="6" className="no-data">No hay datos de animales en vara</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Sección Productos */}
      <section className="detalle-seccion">
        <div className="seccion-header">
          <h2>
            <MdInventory /> Ganancias por Productos
          </h2>
          <div className="seccion-resumen">
            <span className="ganancia-total">
              {formatCurrency(detalles?.productos?.gananciaTotal || 0)}
            </span>
          </div>
        </div>
        
        <div className="tabla-container">
          <table className="detalle-tabla">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Marca</th>
                <th>Cantidad Stock</th>
                <th>Precio Compra</th>
                <th>Precio Venta</th>
                <th>Ganancia</th>
                <th>Margen</th>
              </tr>
            </thead>
            <tbody>
              {detalles?.productos?.detalles?.map((producto, index) => (
                <tr key={index}>
                  <td>
                    <div className="producto-info">
                      <strong>{producto.nombre}</strong>
                      <small>{producto.tipoProducto}</small>
                    </div>
                  </td>
                  <td>{producto.marca}</td>
                  <td>
                    {producto.cantidadStock} {producto.tipoMedida}
                  </td>
                  <td className="amount">
                    {formatCurrency(producto.precioCompra)}
                  </td>
                  <td className="amount">
                    {formatCurrency(producto.precioVenta)}
                  </td>
                  <td className={`amount ${getGananciaColor(producto.ganancia)}`}>
                    {formatCurrency(producto.ganancia)}
                  </td>
                  <td>
                    <span className={`margen ${getGananciaColor(producto.ganancia)}`}>
                      {producto.margen}%
                    </span>
                  </td>
                </tr>
              )) || (
                <tr>
                  <td colSpan="7" className="no-data">No hay datos de productos</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Sección Subproductos */}
      <section className="detalle-seccion">
        <div className="seccion-header">
          <h2>
            <GiMeat /> Ganancias por Subproductos
          </h2>
          <div className="seccion-resumen">
            <span className="ganancia-total">
              {formatCurrency(detalles?.subproductos?.gananciaTotal || 0)}
            </span>
          </div>
        </div>
        
        <div className="tabla-container">
          <table className="detalle-tabla">
            <thead>
              <tr>
                <th>Subproducto</th>
                <th>Cantidad Entregada</th>
                <th>Precio Unitario</th>
                <th>Ingresos Totales</th>
              </tr>
            </thead>
            <tbody>
              {detalles?.subproductos?.detalles?.map((subproducto, index) => (
                <tr key={index}>
                  <td>
                    <div className="subproducto-info">
                      <strong>{subproducto.tipo}</strong>
                    </div>
                  </td>
                  <td>
                    {subproducto.cantidadEntregada} kg
                  </td>
                  <td className="amount">
                    {formatCurrency(subproducto.precioUnitario)}
                  </td>
                  <td className="amount positive">
                    {formatCurrency(subproducto.ingresoTotal)}
                  </td>
                </tr>
              )) || (
                <tr>
                  <td colSpan="4" className="no-data">No hay datos de subproductos</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Sección Mermas */}
      <section className="detalle-seccion mermas">
        <div className="seccion-header">
          <h2>
            <FaExclamationTriangle /> Pérdidas por Mermas
          </h2>
          <div className="seccion-resumen">
            <span className="perdida-total">
              -{formatCurrency(detalles?.mermas?.perdidaTotal || 0)}
            </span>
          </div>
        </div>
        
        <div className="tabla-container">
          <table className="detalle-tabla">
            <thead>
              <tr>
                <th>Tipo Merma</th>
                <th>Producto/Item</th>
                <th>Cantidad Perdida</th>
                <th>Precio Referencia</th>
                <th>Pérdida Total</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {detalles?.mermas?.detalles?.map((merma, index) => (
                <tr key={index}>
                  <td>
                    <span className={`tipo-merma ${merma.tipoMerma.toLowerCase()}`}>
                      {merma.tipoMerma}
                    </span>
                  </td>
                  <td>
                    <div className="merma-item">
                      <strong>{merma.nombreItem}</strong>
                      <small>{merma.descripcion}</small>
                    </div>
                  </td>
                  <td>
                    {merma.cantidadPerdida} {merma.unidadMedida}
                  </td>
                  <td className="amount">
                    {formatCurrency(merma.precioReferencia)}
                  </td>
                  <td className="amount negative">
                    -{formatCurrency(merma.perdidaTotal)}
                  </td>
                  <td>
                    <FaCalendarAlt />
                    {new Date(merma.fecha).toLocaleDateString()}
                  </td>
                </tr>
              )) || (
                <tr>
                  <td colSpan="6" className="no-data">No hay registros de mermas</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Alertas y Recomendaciones */}
      {resumen && (
        <section className="alertas-seccion">
          <h3>
            <FaInfoCircle /> Alertas y Recomendaciones
          </h3>
          
          <div className="alertas-container">
            {resumen.margenGanancia < 0 && (
              <div className="alerta alerta-danger">
                <FaArrowDown />
                <div>
                  <h4>Pérdidas Detectadas</h4>
                  <p>El negocio está operando con pérdidas. Revisar costos y precios.</p>
                </div>
              </div>
            )}

            {resumen.margenGanancia >= 0 && resumen.margenGanancia < 10 && (
              <div className="alerta alerta-warning">
                <FaExclamationTriangle />
                <div>
                  <h4>Margen Bajo</h4>
                  <p>El margen de ganancia es menor al 10%. Considerar optimización de costos.</p>
                </div>
              </div>
            )}

            {resumen.margenGanancia >= 20 && (
              <div className="alerta alerta-success">
                <FaArrowUp />
                <div>
                  <h4>Excelente Rentabilidad</h4>
                  <p>El margen de ganancia es saludable. ¡Buen trabajo!</p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default GananciaEstimadaCompleta;
