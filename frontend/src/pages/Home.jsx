

import { useNavigate } from 'react-router-dom';
import '@styles/home.css';
import { 
  FaClipboardList, 
  FaListAlt, 
  FaMoneyBillWave, 
  FaUserFriends, 
  FaBox, 
  FaShoppingBasket,
  FaTruck
} from 'react-icons/fa';
import { GiCow } from 'react-icons/gi';

const Home = () => {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem('usuario')) || {};
  
  const handleCardClick = (path) => {
    navigate(path);
  };

  return (    <div className="home-container">
      <section className="welcome-section">
        <h1>Bienvenido al Sistema de Gestión de Carnicería</h1>
        <p>Accede rápidamente a todas las funcionalidades desde esta página principal.</p>
      </section>      <section className="dashboard-summary">
        <h2 className="section-title">Panel de Control</h2>
        <div className="dashboard-cards">
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <FaClipboardList className="dashboard-icon" />
              <h3>Pedidos Recientes</h3>
            </div>
            <div className="dashboard-card-body">
              <div className="stat-value">-- pedidos</div>
              <p>Pendientes de entrega</p>
            </div>
          </div>
          
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <GiCow className="dashboard-icon" />
              <h3>Inventario en Vara</h3>
            </div>
            <div className="dashboard-card-body">
              <div className="stat-value">-- kg</div>
              <p>Disponible actualmente</p>
            </div>
          </div>
          
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <FaMoneyBillWave className="dashboard-icon" />
              <h3>Pagos Pendientes</h3>
            </div>
            <div className="dashboard-card-body">
              <div className="stat-value">$--</div>
              <p>Por cobrar</p>
            </div>
          </div>
          
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <FaUserFriends className="dashboard-icon" />
              <h3>Clientes Activos</h3>
            </div>
            <div className="dashboard-card-body">
              <div className="stat-value">--</div>
              <p>Con operaciones este mes</p>
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
            <GiCow className="card-icon" />
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
            <p className="card-description">Consulta y modifica las listas de precios de los diferentes productos.</p>
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
            <FaUserFriends className="card-icon" />
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
            <FaBox className="card-icon" />
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
            <FaShoppingBasket className="card-icon" />
            <p className="card-description">Gestiona los subproductos derivados de tu inventario principal.</p>
            <button 
              className="access-button" 
              onClick={() => handleCardClick('/subproductos')}
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
      </div>
    </div>
  );
};

export default Home;