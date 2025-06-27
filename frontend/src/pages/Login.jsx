import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { login } from '@services/auth.service.js';
import useLogin from '@hooks/auth/useLogin.jsx';
import '@styles/form.css';
import logo from '@assets/logoGoval.jpg';
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";

const Login = () => {
    const navigate = useNavigate();
    const {

        errorData,
        handleInputChange
    } = useLogin();

    const loginSubmit = async (e) => {
        e.preventDefault();
        const data = {
            email: e.target.email.value,
            password: e.target.password.value
        };

        try {
            const response = await login(data);

            if (response.status === 'Success') {
                Swal.fire({
                    icon: 'success',
                    title: '¡Bienvenido!',
                    text: 'Inicio de sesión exitoso.',
                    showConfirmButton: false,  // Ocultar el botón de confirmar
                    timer: 1500,  // Cerrar la alerta después de 1.5 segundos
                }).then(() => {
                    navigate('/home', { state: { showNotificaciones: true } });
                });
            } else if (response.status === 'Client error') {
                errorData(response.details);

                // Verificar si hay errores específicos para el correo electrónico y la contraseña
                if (response.details?.message === 'La contraseña es incorrecta') {
                    Swal.fire({
                        icon: 'error',
                        title: 'Contraseña incorrecta',
                        text: 'La contraseña es incorrecta. Por favor, intente nuevamente.',
                        showConfirmButton: false,  // Ocultar el botón de confirmar
                        timer: 1500,  // Cerrar la alerta después de 1.5 segundos
                    });
                } else if (response.details?.message === 'El correo electrónico es incorrecto') {
                    Swal.fire({
                        icon: 'error',
                        title: 'Correo electrónico incorrecto',
                        text: 'El correo electrónico ingresado es incorrecto. Por favor, intente nuevamente.',
                        showConfirmButton: false,  // Ocultar el botón de confirmar
                        timer: 1500,  // Cerrar la alerta después de 1.5 segundos
                    });
                } else {
                    // En caso de otros errores generales
                    const errorMessage = typeof response.details === 'object' 
                        ? JSON.stringify(response.details) 
                        : response.details;

                    Swal.fire({
                        icon: 'error',
                        title: 'Error de autenticación',
                        text: errorMessage || 'Revise sus credenciales e intente nuevamente.',
                        showConfirmButton: false,  // Ocultar el botón de confirmar
                        timer: 1500,  // Cerrar la alerta después de 1.5 segundos
                    });
                }
            }
        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'Error del servidor',
                text: 'Ha ocurrido un error inesperado. Por favor, intente más tarde.',
                showConfirmButton: false,  // Ocultar el botón de confirmar
                timer: 1500,  // Cerrar la alerta después de 1.5 segundos
            });
        }
    };

    return (
        <main className="container">
            <div className="form">
                <img src={logo} alt="Logo Goval" className="logo" />
                
                <form onSubmit={loginSubmit} className="login-form">
                    <div className="input-box">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Correo"
                            required
                            minLength={15}
                            maxLength={30}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                        <MdEmail className='icon'/>
                      
                    </div>
                    <div className="input-box">
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Contraseña"
                            required
                            minLength={8}
                            maxLength={26}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                        />
                        <FaLock className='icon'/>
                    
                    </div>
                    <button type="submit">Iniciar sesión</button>
                </form>
            </div>
        </main>
    );
};

export default Login;
