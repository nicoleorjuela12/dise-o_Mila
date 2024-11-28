import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIdCard, faLock, faEye, faEyeSlash, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import axios from 'axios';
import API_URL from '../../config'; 

const Login = () => {
    const [formData, setFormData] = useState({
        numero_documento: '',
        contrasena: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // Captura de los valores del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Mostrar/ocultar contraseña
    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    // Validar campos y realizar la solicitud de login
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const { numero_documento, contrasena } = formData;

        // Validaciones básicas de longitud
        if (numero_documento.length < 8 || numero_documento.length > 12) {
            Swal.fire({
                title: 'Error de validación',
                text: 'El número de documento debe tener entre 8 y 12 dígitos.',
                icon: 'error',
                confirmButtonText: 'Reintentar'
            });
            return;
        }

        if (contrasena.length < 6 || contrasena.length > 10) {
            Swal.fire({
                title: 'Error de validación',
                text: 'La contraseña debe tener entre 6 y 10 caracteres.',
                icon: 'error',
                confirmButtonText: 'Reintentar'
            });
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/usuarios/usuarios/login`, {
                numero_documento,
                contrasena
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true,
            });
        
            const { usuario } = response.data;
            
            // Verificar que el usuario tenga un rol definido
            if (!usuario || !usuario.rol) {
                throw new Error('El rol del usuario no está definido');
            }

            // Comprobar si la contraseña ha caducado
            const fechaCreacion = new Date(usuario.fechaCreacion);
            const fechaActual = new Date();
            const diferenciaDias = Math.floor((fechaActual - fechaCreacion) / (1000 * 60 * 60 * 24));

            if (diferenciaDias > 7) {
                Swal.fire({
                    title: 'Cambio de contraseña requerido',
                    text: 'Tu contraseña ha expirado. Debes cambiarla para continuar.',
                    icon: 'warning',
                    confirmButtonText: 'Aceptar'
                });
                return; // No continuar con el login
            }

            // Almacenar el rol en localStorage
            localStorage.setItem('rol', usuario.rol);
            localStorage.setItem('id_usuario', usuario.id_usuario); // Almacena el ID del usuario

            // Aviso de éxito
            await Swal.fire({
                title: 'Inicio de sesión exitoso',
                text: 'Bienvenido de nuevo!',
                icon: 'success',
                confirmButtonText: 'Continuar'
            });
    
            let redirectPath = '/login'; // Ruta por defecto
            switch (usuario.rol) {
                case 'administrador':
                    redirectPath = '/DashboardAdmin';
                    break;
                case 'mesero':
                    redirectPath = '/dashboard-mesero';
                    break;
                case 'Cliente':
                    redirectPath = '/DashboardCliente';
                    break;
                default:
                    throw new Error('Rol no reconocido');
            }
    
            navigate(redirectPath); // Cambia a la ruta deseada
    
        } catch (error) {
            if (error.response) {
                const { status } = error.response;

                if (status === 404) {
                    Swal.fire({
                        title: 'Error',
                        text: 'Usuario no registrado en el sistema',
                        icon: 'warning',
                        confirmButtonText: 'Reintentar'
                    }).then(() => {
                        navigate('/login');
                    });
                } else if (status === 409) {
                    Swal.fire({
                        title: 'Error',
                        text: 'Contraseña inválida',
                        icon: 'error',
                        confirmButtonText: 'Reintentar'
                    });
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: 'Ocurrió un error en el servidor',
                        icon: 'error',
                        confirmButtonText: 'Reintentar'
                    });
                }
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Error de conexión con el servidor',
                    icon: 'error',
                    confirmButtonText: 'Reintentar'
                });
            }
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow flex items-center justify-center bg-gray-100 h-full mb-6">
                <div className="flex flex-col lg:flex-row items-center justify-center w-full h-full">
                    <div className="lg:w-2/5 w-full h-full hidden lg:block">
                        <img 
                            src="https://i.ibb.co/Y3GKdC1/Conoce-nuestros-espacios-Co-working.jpg" 
                            alt="Espacio de Coworking" 
                            className="object-cover w-full h-full rounded-l-lg shadow-lg" 
                        />
                    </div>

                    <div className="lg:w-2/5 w-full flex items-center justify-center bg-white rounded-r-lg shadow-lg p-8 lg:p-16 h-152 border border-yellow-500">
                        <div className="w-full max-w-md">
                            <h1 className="text-3xl font-bold mb-12 text-center text-gray-800">Iniciar Sesión</h1>
                            <form onSubmit={handleSubmit} id="login-form" method="POST">
                                <div className="mb-5">
                                    <label htmlFor="numero_documento" className="block text-gray-700 font-semibold mb-2">Número de documento</label>
                                    <div className="relative">
                                        <FontAwesomeIcon icon={faIdCard} className="text-yellow-500 absolute left-3 top-5" />
                                        <input 
                                            type="text" 
                                            id="numero_documento" 
                                            name="numero_documento" 
                                            placeholder="Ingrese su número de documento" 
                                            value={formData.numero_documento}
                                            onChange={handleChange}
                                            className="w-full border border-yellow-500 rounded-full py-3 pl-10 pr-4 focus:outline-none focus:border-yellow-600" 
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="relative mt-10">
                                    <label htmlFor="contrasena" className="block text-gray-700 font-semibold mb-2">Contraseña</label>
                                    <FontAwesomeIcon icon={faLock} className="text-yellow-500 absolute left-3 top-14" />
                                    <input 
                                      type={showPassword ? "text" : "password"} 
                                      id="contrasena" 
                                      name="contrasena" 
                                      placeholder="Ingrese su contraseña" 
                                      value={formData.contrasena}
                                      onChange={handleChange}
                                      className="w-full border border-yellow-500 rounded-full py-3 pl-10 pr-4 focus:outline-none focus:border-yellow-600" 
                                      required
                                    />
                                    <FontAwesomeIcon 
                                        icon={showPassword ? faEyeSlash : faEye} 
                                        onClick={handleTogglePassword} 
                                        className="absolute right-3 top-14 cursor-pointer text-gray-500"
                                    />
                                </div>

                                <Link to="#" className="text-sm flex items-center justify-end mt-12 text-black no-underline hover:underline">
                                    <FontAwesomeIcon icon={faLock} className="text-black mr-2" />
                                    ¿Olvidaste tu contraseña?
                                </Link>

                                <button 
                                    type="submit" 
                                    className="bg-yellow-500 border border-black text-black font-semibold rounded-full py-2 mt-8 px-4 w-full transition duration-150 ease-in-out hover:bg-yellow-600 hover:text-white"
                                >
                                    Ingresar
                                </button>
                            </form>

                            <div className="mt-6 text-gray-900 text-center">
                                <Link to="/RegistroCliente" className="text-sm flex items-center justify-center mt-12 text-black no-underline hover:underline">
                                    <FontAwesomeIcon icon={faUserPlus} className="text-black mr-2" />
                                    ¿No tienes una cuenta? Regístrate aquí
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Login;
