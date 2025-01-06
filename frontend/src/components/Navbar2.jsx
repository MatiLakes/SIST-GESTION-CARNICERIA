import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { logout } from "@services/auth.service.js";
import Swal from "sweetalert2";
import "@styles/navbar2.css";
import { useState } from "react";
import { HiArrowSmLeft, HiArrowSmRight } from "react-icons/hi";
import { FaHome, FaTruck, FaListAlt, FaPlus, FaClipboardList, FaBox } from "react-icons/fa"; // Agregado FaBox para productos
import { ImExit } from "react-icons/im";

const Navbar2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(sessionStorage.getItem("usuario")) || "";
  const userRole = user?.rol;
  const [menuOpen, setMenuOpen] = useState(false);
  const [subMenuOpen, setSubMenuOpen] = useState(false);

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
      confirmButtonColor: "#3085d6",
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
    setMenuOpen((prevMenuOpen) => {
      const newMenuOpen = !prevMenuOpen;
      if (!newMenuOpen) {
        setSubMenuOpen(false);
      }
      return newMenuOpen;
    });
  };

  const toggleSubMenu = () => {
    setSubMenuOpen((prevSubMenuOpen) => !prevSubMenuOpen);
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
                  <NavLink
                    to="/home"
                    className={location.pathname === "/home" ? "active" : ""}
                  >
                    <FaHome className="nav-icon" />
                    <span>Inicio</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/animal-corte/listas-precios"
                    className={location.pathname === "/animal-corte/listas-precios" ? "active" : ""}
                  >
                    <FaListAlt className="nav-icon" />
                    <span>Listas de Precios</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/animal-vara/vara"
                    className={location.pathname === "/animal-vara/vara" ? "active" : ""}
                  >
                    <FaPlus className="nav-icon" />
                    <span>Vara</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/pedidos"
                    className={location.pathname === "/pedidos" ? "active" : ""}
                  >
                    <FaClipboardList className="nav-icon" />
                    <span>Pedidos</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/productos"
                    className={location.pathname === "/productos" ? "active" : ""}
                  >
                    <FaBox className="nav-icon" />
                    <span>Productos</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/subproductos"
                    className={location.pathname === "/subproductos" ? "active" : ""}
                  >
                    <FaBox className="nav-icon" />
                    <span>Subproductos</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                  
                  to="/gestion-proveedores/proveedor"
                  className={location.pathname === "/gestion-proveedores/proveedor" ? "active" : ""}
                >
                  <FaTruck className="nav-icon" />
                  <span>Gestión de Proveedores</span>
                </NavLink>
              </li>
              <li>
                <NavLink
                  
                  
                    to="#"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleSubMenu();
                    }}
                    className={subMenuOpen ? "active" : ""}
                  >
                    <GiMilkCarton className="nav-icon" />
                    <span>Gestión de Productos</span>
                  </NavLink>
                </li>
                {subMenuOpen && (
                  <div className={`nav-submenu ${subMenuOpen ? "activado" : "oculta"}`}>
                    <ul>
                      <li>
                        <NavLink
                          to="/producto/carnico"
                          className={location.pathname === "/producto/carnico" ? "active" : ""}
                        >
                          - Cárnico
                        </NavLink>
                      </li>
                       <li>
                      <NavLink
                          to="/producto/categoria"
                          className={location.pathname === "/producto/categoria" ? "active" : ""}
                        >
                          - Categoria
                        </NavLink>
                      </li>
                    </ul>
                  </div>
                )}
              </>
            )}
            <li className="logout-item">
              <NavLink
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleLogoutClick();
                  setMenuOpen(false);
                  setSubMenuOpen(false);
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
