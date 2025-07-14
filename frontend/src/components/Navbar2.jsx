import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { logout } from "@services/auth.service.js";
import Swal from "sweetalert2";
import "@styles/navbar2.css";
import { useState, useEffect } from "react";
import { HiArrowSmLeft, HiArrowSmRight } from "react-icons/hi";
import { FaHome, FaTruck, FaListAlt, FaPlus, FaClipboardList, FaBox, FaMoneyBillWave, FaUserFriends, FaShoppingBasket, FaShieldAlt, FaHardHat, FaTemperatureLow, FaChevronDown, FaChevronUp, FaTrashAlt, FaWarehouse, FaChartLine, FaUser, FaHamburger, FaFileAlt, FaDrumstickBite } from "react-icons/fa";
import { ImExit } from "react-icons/im";
import { GiMilkCarton } from "react-icons/gi";
import { GiCow } from "react-icons/gi";
import { RiFileTextLine } from "react-icons/ri";

const Navbar2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(sessionStorage.getItem("usuario")) || "";
  const userRole = user?.rol;
  const [menuOpen, setMenuOpen] = useState(false);
  const [documentosOpen, setDocumentosOpen] = useState(false);
  const [contactosOpen, setContactosOpen] = useState(false);
  const [stockOpen, setStockOpen] = useState(false);

  useEffect(() => {
    document.body.setAttribute("data-navbar-collapsed", !menuOpen);
  }, [menuOpen]);

  useEffect(() => {
    // Verificar si la ruta actual está relacionada con documentos
    const isDocumentosRoute = [
      "/control-higiene",
      "/control-temperatura",
      "/control-trazabilidad"
    ].some(route => location.pathname.startsWith(route));
    
    // Abrir el menú documentos si estamos en una de sus rutas
    if (isDocumentosRoute && menuOpen) {
      setDocumentosOpen(true);
    }

    // Verificar si la ruta actual está relacionada con contactos
    const isContactosRoute = [
      "/clientes",
      "/gestion-proveedores",
      "/personal"
    ].some(route => location.pathname.startsWith(route));
    
    // Abrir el menú contactos si estamos en una de sus rutas
    if (isContactosRoute && menuOpen) {
      setContactosOpen(true);
    }

    // Verificar si la ruta actual está relacionada con stock
    const isStockRoute = [
      "/recepcion-stock",
      "/stock-actual"
    ].some(route => location.pathname.startsWith(route));
    
    // Abrir el menú stock si estamos en una de sus rutas
    if (isStockRoute && menuOpen) {
      setStockOpen(true);
    }
  }, [location.pathname, menuOpen]);

  const logoutSubmit = () => {
    try {
      logout();
      navigate("/auth");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleLogoutClick = () => {
    Swal.fire({
      title: "¿Seguro que quieres salir?",
      text: "Tu sesión será cerrada.",
      icon: "warning",
      showCancelButton: true,
      
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        logoutSubmit();
      }
    });
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
    if (!menuOpen) {
      setDocumentosOpen(false);
      setContactosOpen(false);
      setStockOpen(false);
    }
  };

  const toggleDocumentosMenu = () => {
    setDocumentosOpen((prev) => !prev);
  };

  const toggleContactosMenu = () => {
    setContactosOpen((prev) => !prev);
  };

  const toggleStockMenu = () => {
    setStockOpen((prev) => !prev);
  };

  return (
    <nav className={`navbar2 ${menuOpen ? "activado" : "oculta"}`}>
      <button className="flechamenu" onClick={toggleMenu}>
        {menuOpen ? <HiArrowSmLeft className="toggle-icon" /> : <HiArrowSmRight className="toggle-icon" />}
      </button>

      {menuOpen && (
        <div className={`nav-menu ${menuOpen ? "activado" : ""}`}>
          <ul>
            {userRole === "administrador" && (
              <>
                <li>
                  <NavLink to="/home" className={location.pathname === "/home" ? "active" : ""}>
                    <FaHome className="nav-icon" />
                    <span>Inicio</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/animal-corte/listas-precios" className={location.pathname === "/animal-corte/listas-precios" ? "active" : ""}>
                    <FaListAlt className="nav-icon" />
                    <span>Listas de Precios</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/animal-vara/vara" className={location.pathname === "/animal-vara/vara" ? "active" : ""}>
                    <FaShoppingBasket className="nav-icon" />
                    <span>Vara</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/pedidos" className={location.pathname === "/pedidos" ? "active" : ""}>
                    <FaClipboardList className="nav-icon" />
                    <span>Pedidos</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/pagos-pendientes" className={location.pathname === "/pagos-pendientes" ? "active" : ""}>
                    <FaMoneyBillWave className="nav-icon" />
                    <span>Pagos Pendientes</span>
                  </NavLink>
                </li>
                {/* Menú de Contactos se agregará aquí */}
                <li>
                  <NavLink to="/productos" className={location.pathname === "/productos" ? "active" : ""}>
                    <FaDrumstickBite className="nav-icon" />
                    <span>Productos</span>
                  </NavLink>
                </li>
                  {/* Nuevo menú de Documentos con submenú */}                <li>
                  <div className="documentos-link">
                    <NavLink 
                      to="#" 
                      className={`${["/control-higiene", "/control-temperatura", "/control-trazabilidad"].some(route => location.pathname.startsWith(route)) ? "active" : ""}`}
                      onClick={(e) => {
                        e.preventDefault();
                        toggleDocumentosMenu();
                      }}
                    >
                      <FaFileAlt className="nav-icon" />
                      <span>Documentos</span>
                    </NavLink>
                    <div className="submenu-arrow" onClick={toggleDocumentosMenu}>
                      {documentosOpen ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                  </div>
                </li>

                {/* Submenú de Documentos */}
                {documentosOpen && (
                  <>
                    <li className="submenu-item">
                      <NavLink to="/control-higiene" className={location.pathname === "/control-higiene" ? "active" : ""}>
                        <FaShieldAlt className="nav-icon" />
                        <span>Control Higiene</span>
                      </NavLink>
                    </li>
                    <li className="submenu-item">
                      <NavLink to="/control-temperatura" className={location.pathname === "/control-temperatura" ? "active" : ""}>
                        <FaTemperatureLow className="nav-icon" />
                        <span>Control Temperatura</span>
                      </NavLink>
                    </li>
                    <li className="submenu-item">
                      <NavLink to="/control-trazabilidad" className={location.pathname === "/control-trazabilidad" ? "active" : ""}>
                        <FaHamburger className="nav-icon" />
                        <span>Registro Carne Molida</span>
                      </NavLink>
                    </li>
                  </>
                )}

                {/* Nuevo menú de Contactos con submenú */}
                <li>
                  <div className="contactos-link">
                    <NavLink 
                      to="#" 
                      className={`${["/clientes", "/gestion-proveedores", "/personal"].some(route => location.pathname.startsWith(route)) ? "active" : ""}`}
                      onClick={(e) => {
                        e.preventDefault();
                        toggleContactosMenu();
                      }}
                    >
                      <FaUserFriends className="nav-icon" />
                      <span>Contactos</span>
                    </NavLink>
                    <div className="submenu-arrow" onClick={toggleContactosMenu}>
                      {contactosOpen ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                  </div>
                </li>

                {/* Submenú de Contactos */}
                {contactosOpen && (
                  <>
                    <li className="submenu-item contactos-submenu">
                      <NavLink to="/clientes" className={location.pathname === "/clientes" ? "active" : ""}>
                        <FaUser className="nav-icon" />
                        <span>Clientes</span>
                      </NavLink>
                    </li>
                    <li className="submenu-item contactos-submenu">
                      <NavLink to="/gestion-proveedores/proveedor" className={location.pathname === "/gestion-proveedores/proveedor" ? "active" : ""}>
                        <FaTruck className="nav-icon" />
                        <span>Proveedores</span>
                      </NavLink>
                    </li>
                    <li className="submenu-item contactos-submenu">
                      <NavLink to="/personal" className={location.pathname === "/personal" ? "active" : ""}>
                        <FaHardHat className="nav-icon" />
                        <span>Personal</span>
                      </NavLink>
                    </li>
                  </>
                )}

                {/* Nuevo menú de Stock con submenú */}
                <li>
                  <div className="stock-link">
                    <NavLink 
                      to="#" 
                      className={`${["/recepcion-stock", "/stock-actual"].some(route => location.pathname.startsWith(route)) ? "active" : ""}`}
                      onClick={(e) => {
                        e.preventDefault();
                        toggleStockMenu();
                      }}
                    >
                      <FaWarehouse className="nav-icon" />
                      <span>Stock</span>
                    </NavLink>
                    <div className="submenu-arrow" onClick={toggleStockMenu}>
                      {stockOpen ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                  </div>
                </li>

                {/* Submenú de Stock */}
                {stockOpen && (
                  <>
                    <li className="submenu-item">
                      <NavLink to="/recepcion-stock" className={location.pathname === "/recepcion-stock" ? "active" : ""}>
                        <FaTruck className="nav-icon" />
                        <span>Recepción Stock</span>
                      </NavLink>
                    </li>
                    <li className="submenu-item">
                      <NavLink to="/stock-actual" className={location.pathname === "/stock-actual" ? "active" : ""}>
                        <FaWarehouse className="nav-icon" />
                        <span>Stock Actual</span>
                      </NavLink>
                    </li>
                  </>
                )}

                <li>
                  <NavLink to="/mermas" className={location.pathname === "/mermas" ? "active" : ""}>
                    <FaTrashAlt className="nav-icon" />
                    <span>Mermas</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/ganancia-estimada" className={location.pathname === "/ganancia-estimada" ? "active" : ""}>
                    <FaChartLine className="nav-icon" />
                    <span>Ganancia Estimada</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/subproductos" className={location.pathname === "/subproductos" ? "active" : ""}>
                    <GiCow className="nav-icon" />
                    <span>Subproductos</span>
                  </NavLink>
                </li>
                {/* Gestión de Proveedores se moverá al menú de Contactos */}
              </>
            )}
            <li className="logout-item">
              <NavLink
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleLogoutClick();
                  setMenuOpen(false);
                  setDocumentosOpen(false);
                  setContactosOpen(false);
                  setStockOpen(false);
                }}
                className={`logout-link ${location.pathname === "/auth" ? "active" : ""}`}
              >
                <ImExit className="nav-icon" />
                <span>Logout</span>
              </NavLink>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar2;
