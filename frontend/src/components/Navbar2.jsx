import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { logout } from '@services/auth.service.js';
import '@styles/navbar2.css'; // Asegúrate de que los estilos sean correctos para navbar2
import { useState } from "react";
import { HiArrowSmLeft } from "react-icons/hi";
import { HiArrowSmRight } from "react-icons/hi";

const Navbar2 = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(sessionStorage.getItem('usuario')) || '';
    const userRole = user?.rol;
    const [menuOpen, setMenuOpen] = useState(false);

    const logoutSubmit = () => {
        try {
            logout();
            navigate('/auth');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    // Alterna el estado del menú y limpia las clases activas si se abre
    const toggleMenu = () => {
        // Limpia las clases 'active' cuando se cambia el estado del menú
        if (menuOpen) {
            removeActiveClass();
        }
        setMenuOpen(!menuOpen);
    };

    // Elimina la clase 'active' de todos los enlaces
    const removeActiveClass = () => {
        const activeLinks = document.querySelectorAll('.navbar2 .nav-menu ul li a.active');
        activeLinks.forEach(link => link.classList.remove('active'));
    };

    // Agrega la clase 'active' al enlace correspondiente
    const addActiveClass = () => {
        const links = document.querySelectorAll('.navbar2 .nav-menu ul li a');
        links.forEach(link => {
            if (link.getAttribute('href') === location.pathname) {
                link.classList.add('active');
            }
        });
    };

    return (
        <nav className={`navbar2 ${menuOpen ? 'activado' : 'oculta'}`}>
            {menuOpen && (
                <div className={`nav-menu ${menuOpen ? 'activado' : ''}`}>
                    <ul>
                        <li>
                            <NavLink 
                                to="/home" 
                                onClick={() => { 
                                    setMenuOpen(false); 
                                    addActiveClass();
                                }} 
                                activeClassName="active"
                            >
                                Inicio
                            </NavLink>
                        </li>
                        {userRole === 'administrador' && (
                            <li>
                                <NavLink 
                                    to="/users" 
                                    onClick={() => { 
                                        setMenuOpen(false); 
                                        addActiveClass();
                                    }} 
                                    activeClassName="active"
                                >
                                    Usuarios
                                </NavLink>
                            </li>
                        )}
                        <li>
                            <NavLink 
                                to="/auth" 
                                onClick={() => { 
                                    logoutSubmit(); 
                                    setMenuOpen(false); 
                                }} 
                                activeClassName="active"
                            >
                                Cerrar sesión
                            </NavLink>
                        </li>
                    </ul>
                </div>
            )}

            {/* Botón para alternar la visibilidad del menú */}
            <button className="toggle-btn" onClick={toggleMenu}>
                {menuOpen ? <HiArrowSmLeft className="toggle-icon" /> : <HiArrowSmRight className="toggle-icon" />}
        </button>
        </nav>
    );
};

export default Navbar2;
