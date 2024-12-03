import '@styles/navbar.css';
import { useState } from "react";

const Navbar = () => {
    const user = JSON.parse(sessionStorage.getItem('usuario')) || {};  // Aseguramos que sea un objeto vacío si no hay datos
    const userRole = user?.rol;  // Extraemos el rol del usuario
    const [menuOpen, setMenuOpen] = useState(false);

    // Agregamos console.log para ver los datos del usuario y el rol
    console.log("Datos del usuario:", user);  // Esto debería mostrar el objeto del usuario
    console.log("Rol del usuario:", userRole);  // Esto debería mostrar el rol, como 'administrador'

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <nav className="navbar">
            <div className={`nav-menu ${menuOpen ? 'activado' : ''}`}>
                <ul>
                    {/* Mostrar el nombre y el rol del usuario si existen */}
                    {user?.nombreCompleto && user?.rol && (
                        <li className="user-info">
                            <span className="user-welcome">Hola, {user.nombreCompleto}</span>
                            <span className="user-role">({user.rol})</span>
                        </li>
                    )}
                </ul>
            </div>
            <div className="hamburger" onClick={toggleMenu}>
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </div>
        </nav>
    );
};

export default Navbar;