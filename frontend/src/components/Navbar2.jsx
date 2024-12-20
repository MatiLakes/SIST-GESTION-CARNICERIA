import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { logout } from "@services/auth.service.js";
import Swal from "sweetalert2";
import "@styles/navbar2.css";
import { useState } from "react";
import { HiArrowSmLeft, HiArrowSmRight } from "react-icons/hi";
import { FaHouse } from "react-icons/fa6";
import { ImExit } from "react-icons/im"; 
import { FaTruck } from "react-icons/fa";
import { FaRegArrowAltCircleDown } from "react-icons/fa";
import { FaRegArrowAltCircleUp } from "react-icons/fa";

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
            // Si la barra lateral se cierra, también cerramos el submenú
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
                                        onClick={() => {
                                            setSubMenuOpen(false); // Cierra el submenú
                                        }}
                                        className={location.pathname === "/home" ? "active" : ""}
                                    >
                                        <FaHouse className="nav-icon" />
                                        <span>Inicio</span>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            toggleSubMenu(); // Solo alterna el submenú
                                        }}
                                        className={subMenuOpen ? "active" : ""}
                                    >
                                        <FaTruck className="nav-icon" />
                                        <span>Gestión de Proveedores</span>
                                        {/* Icono que cambia según el estado del submenú */}
                                        {subMenuOpen ? <FaRegArrowAltCircleUp className="icon-large" /> : <FaRegArrowAltCircleDown className="icon-large" />}
                                    </NavLink>
                                </li>
                                {subMenuOpen && (
                                    <div className={`nav-submenu ${subMenuOpen ? "activado" : "oculta"}`}>
                                        <ul>
                                            <li>
                                                <NavLink
                                                    to="/proveedores/categoria"
                                                    onClick={() => setSubMenuOpen(false)} // Cierra el submenú
                                                    className={location.pathname === "/proveedores/categoria" ? "active" : ""}
                                                >
                                                    - Categoría
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink
                                                    to="/gestion-proveedores/proveedor"
                                                    onClick={() => setSubMenuOpen(false)} // Cierra el submenú
                                                    className={location.pathname === "/gestion-proveedores/proveedor" ? "active" : ""}
                                                >
                                                    - Proveedor
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
                                    setMenuOpen(false); // Cierra el menú
                                    setSubMenuOpen(false); // Cierra el submenú
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
