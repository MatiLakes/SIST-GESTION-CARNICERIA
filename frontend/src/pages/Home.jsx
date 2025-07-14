import { useEffect, useState } from 'react';
import { useNavigate, useNavigationType, useLocation } from 'react-router-dom';
import '@styles/home.css';
import { 
  FaClipboardList, 
  FaListAlt, 
  FaMoneyBillWave, 
  FaUserFriends, 
  FaShoppingBasket,
  FaTruck,
  FaChartLine,
  FaShieldAlt,
  FaHamburger,
  FaUserTie,
  FaWarehouse,
  FaTrashAlt,
  FaTemperatureLow,
  FaUser,
  FaDrumstickBite
} from 'react-icons/fa';
import { GiCow } from 'react-icons/gi';
import NotificacionesButton from "@components/NotificacionesButton";
import NotificacionesGlobal from "@components/NotificacionesGlobal";
import useGetPedidos from "@hooks/pedidos/useGetPedidos.jsx";
import gananciaEstimadaService from '@services/gananciaEstimada.service.js';

const Home = () => {
  const navigate = useNavigate();
  const navigationType = useNavigationType();
  const location = useLocation();
  const user = JSON.parse(sessionStorage.getItem('usuario')) || {};
  
  // Estados para notificaciones
  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(
    navigationType === 'POP' || location.state?.showNotificaciones
  );

  // Estados para datos del dashboard
  const [gananciaTotal, setGananciaTotal] = useState(null);
  const [loadingGanancia, setLoadingGanancia] = useState(true);
  
  // Hook para obtener pedidos
  const { pedidos, loading: loadingPedidos } = useGetPedidos();

  // Calcular estadísticas de pedidos
  const totalPedidos = pedidos?.length || 0;

  useEffect(() => {
    // Limpiar el state para que no se repita al navegar internamente
    if (location.state?.showNotificaciones) {
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Efecto para cargar la ganancia estimada total
  useEffect(() => {
    const cargarGananciaTotal = async () => {
      try {
        setLoadingGanancia(true);
        console.log('🔍 Intentando obtener ganancia estimada...');
        
        // Probar primero el endpoint completo
        const response = await gananciaEstimadaService.obtenerGananciaCompleta();
        console.log('📊 Response completo de ganancia:', response);
        
        let gananciaEncontrada = null;
        
        // La estructura correcta debería ser response.data (el data del handleSuccess)
        const datos = response?.data || response;
        console.log('📊 Datos extraídos:', datos);
        
        // Intentar diferentes estructuras dentro de los datos
        if (datos?.resumen?.gananciaEstimadaTotal !== undefined) {
          gananciaEncontrada = datos.resumen.gananciaEstimadaTotal;
          console.log('✅ Ganancia encontrada en datos.resumen.gananciaEstimadaTotal:', gananciaEncontrada);
        } else if (datos?.resumen?.gananciaTotal !== undefined) {
          gananciaEncontrada = datos.resumen.gananciaTotal;
          console.log('✅ Ganancia encontrada en datos.resumen.gananciaTotal:', gananciaEncontrada);
        } else if (datos?.gananciaEstimadaTotal !== undefined) {
          gananciaEncontrada = datos.gananciaEstimadaTotal;
          console.log('✅ Ganancia encontrada en datos.gananciaEstimadaTotal:', gananciaEncontrada);
        } else if (datos?.gananciaTotal !== undefined) {
          gananciaEncontrada = datos.gananciaTotal;
          console.log('✅ Ganancia encontrada en datos.gananciaTotal:', gananciaEncontrada);
        } else if (datos?.ganancia?.total !== undefined) {
          gananciaEncontrada = datos.ganancia.total;
          console.log('✅ Ganancia encontrada en datos.ganancia.total:', gananciaEncontrada);
        } else {
          // Si no encontramos en el endpoint completo, probar el resumen
          console.log('⚠️ No encontrado en endpoint completo, probando resumen...');
          const resumenResponse = await gananciaEstimadaService.obtenerResumen();
          console.log('📊 Response de resumen:', resumenResponse);
          
          const datosResumen = resumenResponse?.data || resumenResponse;
          
          if (datosResumen?.gananciaEstimadaTotal !== undefined) {
            gananciaEncontrada = datosResumen.gananciaEstimadaTotal;
            console.log('✅ Ganancia encontrada en resumen.gananciaEstimadaTotal:', gananciaEncontrada);
          } else if (datosResumen?.gananciaTotal !== undefined) {
            gananciaEncontrada = datosResumen.gananciaTotal;
            console.log('✅ Ganancia encontrada en resumen.gananciaTotal:', gananciaEncontrada);
          } else if (datosResumen?.total !== undefined) {
            gananciaEncontrada = datosResumen.total;
            console.log('✅ Ganancia encontrada en resumen.total:', gananciaEncontrada);
          }
        }
        
        if (gananciaEncontrada !== null && gananciaEncontrada !== undefined) {
          setGananciaTotal(Number(gananciaEncontrada));
          console.log('💰 Ganancia total establecida:', Number(gananciaEncontrada));
        } else {
          console.warn('❌ No se pudo extraer gananciaTotal de ninguna estructura.');
          console.warn('📊 Estructura completa del response:', JSON.stringify(response, null, 2));
          setGananciaTotal(0);
        }
      } catch (error) {
        console.error('❌ Error al cargar ganancia total:', error);
        setGananciaTotal(0);
      } finally {
        setLoadingGanancia(false);
      }
    };

    cargarGananciaTotal();
  }, []);

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div className="home-container">
      {mostrarNotificaciones && <NotificacionesGlobal />}
      <NotificacionesButton />
      <section className="welcome-section">
        <h1>Bienvenido al Sistema de Gestión de Carnicería</h1>
        <p>Accede rápidamente a todas las funcionalidades desde esta página principal.</p>
      </section>      <section className="dashboard-summary">
        <h2 className="section-title">Panel de Control</h2>
        <div className="dashboard-cards">
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <FaClipboardList className="dashboard-icon" />
              <h3>Total de Pedidos</h3>
            </div>
            <div className="dashboard-card-body">
              <div className="stat-value">
                {loadingPedidos ? '...' : totalPedidos}
              </div>
              <p>Pedidos registrados</p>
            </div>
          </div>
          
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <FaChartLine className="dashboard-icon" />
              <h3>Ganancia Total Estimada</h3>
            </div>
            <div className="dashboard-card-body">
              <div className="stat-value">
                {loadingGanancia ? 
                  '⏳ Cargando...' : 
                  (gananciaTotal !== null && gananciaTotal !== undefined ? 
                    `$${Number(gananciaTotal).toLocaleString('es-CL')}` : 
                    '$0'
                  )
                }
              </div>
              <p>Ganancia estimada total</p>
            </div>
          </div>
        </div>
      </section>
      
      <h2 className="section-title">Accesos Rápidos</h2>
      <div className="cards-section">
        {/* Tarjeta de Pedidos */}
        <div className="quick-access-card">
          <div className="card-header">Pedidos</div>
          <div className="card-content">
            <FaClipboardList className="card-icon" />
            <p className="card-description">Gestiona los pedidos de clientes, crea nuevos y revisa el historial de pedidos.</p>            <button 
              className="access-button" 
              onClick={() => handleCardClick('/pedidos')}
            >
              Acceder
            </button>
          </div>
        </div>

        {/* Tarjeta de Vara */}
        <div className="quick-access-card">
          <div className="card-header">Vara</div>
          <div className="card-content">
            <FaShoppingBasket className="card-icon" />
            <p className="card-description">Administra el registro y seguimiento de animales en vara para el control de inventario.</p>
            <button 
              className="access-button" 
              onClick={() => handleCardClick('/animal-vara/vara')}
            >
              Acceder
            </button>
          </div>
        </div>

        {/* Tarjeta de Listas de Precios */}
        <div className="quick-access-card">
          <div className="card-header">Listas de Precios</div>
          <div className="card-content">
            <FaListAlt className="card-icon" />
            <p className="card-description">Consulta y modifica las listas de precios de los diferentes cortes de carne.</p>
            <button 
              className="access-button" 
              onClick={() => handleCardClick('/animal-corte/listas-precios')}
            >
              Acceder
            </button>
          </div>
        </div>

        {/* Tarjeta de Pagos Pendientes */}
        <div className="quick-access-card">
          <div className="card-header">Pagos Pendientes</div>
          <div className="card-content">
            <FaMoneyBillWave className="card-icon" />
            <p className="card-description">Revisa y gestiona todos los pagos pendientes de los clientes.</p>
            <button 
              className="access-button" 
              onClick={() => handleCardClick('/pagos-pendientes')}
            >
              Acceder
            </button>
          </div>
        </div>

        {/* Tarjeta de Clientes */}
        <div className="quick-access-card">
          <div className="card-header">Clientes</div>
          <div className="card-content">
            <FaUser className="card-icon" />
            <p className="card-description">Gestiona la información de tus clientes, agrega nuevos o actualiza los existentes.</p>
            <button 
              className="access-button" 
              onClick={() => handleCardClick('/clientes')}
            >
              Acceder
            </button>
          </div>
        </div>

        {/* Tarjeta de Productos */}
        <div className="quick-access-card">
          <div className="card-header">Productos</div>
          <div className="card-content">
            <FaDrumstickBite className="card-icon" />
            <p className="card-description">Administra el catálogo de productos disponibles para venta.</p>
            <button 
              className="access-button" 
              onClick={() => handleCardClick('/productos')}
            >
              Acceder
            </button>
          </div>
        </div>

        {/* Tarjeta de Subproductos */}
        <div className="quick-access-card">
          <div className="card-header">Subproductos</div>
          <div className="card-content">
            <GiCow className="card-icon" />
            <p className="card-description">Gestiona los subproductos derivados de tu inventario principal.</p>
            <button 
              className="access-button" 
              onClick={() => handleCardClick('/subproductos')}
            >
              Acceder
            </button>
          </div>
        </div>

        {/* Tarjeta de Ganancia Estimada */}
        <div className="quick-access-card">
          <div className="card-header">Ganancia Estimada</div>
          <div className="card-content">
            <FaChartLine className="card-icon" />
            <p className="card-description">Analiza la rentabilidad estimada del negocio basada en el inventario actual.</p>
            <button 
              className="access-button" 
              onClick={() => handleCardClick('/ganancia-estimada')}
            >
              Acceder
            </button>
          </div>
        </div>

        {/* Tarjeta de Proveedores */}
        <div className="quick-access-card">
          <div className="card-header">Gestión de Proveedores</div>
          <div className="card-content">
            <FaTruck className="card-icon" />
            <p className="card-description">Administra tus proveedores, contactos y detalles de suministro.</p>
            <button 
              className="access-button" 
              onClick={() => handleCardClick('/gestion-proveedores/proveedor')}
            >
              Acceder
            </button>
          </div>
        </div>

        {/* Tarjeta de Control de Higiene */}
        <div className="quick-access-card">
          <div className="card-header">Control de Higiene</div>
          <div className="card-content">
            <FaShieldAlt className="card-icon" />
            <p className="card-description">Gestiona los registros de control de higiene del personal de la carnicería.</p>
            <button 
              className="access-button" 
              onClick={() => handleCardClick('/control-higiene')}
            >
              Acceder
            </button>
          </div>
        </div>

        {/* Tarjeta de Control de Temperatura */}
        <div className="quick-access-card">
          <div className="card-header">Control de Temperatura</div>
          <div className="card-content">
            <FaTemperatureLow className="card-icon" />
            <p className="card-description">Administra el control y monitoreo de temperaturas del establecimiento.</p>
            <button 
              className="access-button" 
              onClick={() => handleCardClick('/control-temperatura')}
            >
              Acceder
            </button>
          </div>
        </div>

        {/* Tarjeta de Registro Carne Molida */}
        <div className="quick-access-card">
          <div className="card-header">Registro Carne Molida</div>
          <div className="card-content">
            <FaHamburger className="card-icon" />
            <p className="card-description">Gestiona el registro de trazabilidad de la carne molida.</p>
            <button 
              className="access-button" 
              onClick={() => handleCardClick('/control-trazabilidad')}
            >
              Acceder
            </button>
          </div>
        </div>

        {/* Tarjeta de Personal */}
        <div className="quick-access-card">
          <div className="card-header">Personal</div>
          <div className="card-content">
            <FaUserTie className="card-icon" />
            <p className="card-description">Gestiona la información del personal de la empresa.</p>
            <button 
              className="access-button" 
              onClick={() => handleCardClick('/personal')}
            >
              Acceder
            </button>
          </div>
        </div>

        {/* Tarjeta de Stock Actual */}
        <div className="quick-access-card">
          <div className="card-header">Stock Actual</div>
          <div className="card-content">
            <FaWarehouse className="card-icon" />
            <p className="card-description">Consulta el inventario actual de productos disponibles.</p>
            <button 
              className="access-button" 
              onClick={() => handleCardClick('/stock-actual')}
            >
              Acceder
            </button>
          </div>
        </div>

        {/* Tarjeta de Recepción de Stock */}
        <div className="quick-access-card">
          <div className="card-header">Recepción de Stock</div>
          <div className="card-content">
            <FaTruck className="card-icon" />
            <p className="card-description">Registra la recepción de mercancía y actualiza el inventario.</p>
            <button 
              className="access-button" 
              onClick={() => handleCardClick('/recepcion-stock')}
            >
              Acceder
            </button>
          </div>
        </div>

        {/* Tarjeta de Mermas */}
        <div className="quick-access-card">
          <div className="card-header">Mermas</div>
          <div className="card-content">
            <FaTrashAlt className="card-icon" />
            <p className="card-description">Gestiona y registra las mermas del inventario de productos.</p>
            <button 
              className="access-button" 
              onClick={() => handleCardClick('/mermas')}
            >
              Acceder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;