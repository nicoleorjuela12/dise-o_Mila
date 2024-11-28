import React, { useState, useEffect,useRef  } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBox, faCalendar, faShoppingBasket, faCalendarCheck, faConciergeBell, faUser } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import axios from 'axios';


const BarraCliente = () => {
  const [showReservasMenu, setShowReservasMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);
  const [showEventosMenu, setShowEventosMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileReservasMenu, setShowMobileReservasMenu] = useState(false);

  const navigate = useNavigate();

  // Maneja clics fuera de los menús para cerrarlos
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('#reservas-button') && !e.target.closest('#reservas-menu')) {
        setShowReservasMenu(false);
      }
      if (!e.target.closest('#user-menu-button') && !e.target.closest('#user-menu')) {
        setShowUserMenu(false);
      }
      if (!e.target.closest('#mobile-menu-button') && !e.target.closest('#mobile-menu')) {
        setShowMobileMenu(false);
      }
      if (!e.target.closest('#mobile-reservas-button') && !e.target.closest('#mobile-reservas-menu')) {
        setShowMobileReservasMenu(false);
      }
      if (!e.target.closest('#eventos-button') && !e.target.closest('#eventos-menu')) {
        setShowEventosMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Maneja el cierre de sesión
  const handleLogout = async () => {
    try {
      const response = await axios.post(
        'http://localhost:8000/usuarios/cerrarsesion',
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        // Limpiar almacenamiento local
        localStorage.removeItem('rol');
        localStorage.removeItem('id_usuario');
        localStorage.clear();

        // Mostrar mensaje de éxito
        Swal.fire({
          title: 'Sesión cerrada',
          text: 'Has cerrado sesión exitosamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        }).then(() => {
          navigate('/login'); // Redirigir a login
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Error',
        text: 'Ocurrió un error al cerrar sesión',
        icon: 'error',
        confirmButtonText: 'Reintentar',
      });
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center mb-24">
      <div className="flex flex-col">
        <div className="fixed inset-x-0 top-0 z-50 h-0.5 mt-0.5 bg-yellow-300"></div>
        <nav className="flex justify-between items-center py-4 navbar_gradient backdrop-blur-md shadow-md w-full fixed top-0 left-0 right-0 z-10 h-24 px-8">
          <div className="flex items-center space-x-4 ml-2">
            <Link to="/" className="cursor-pointer flex items-center">
              <img className="h-20 object-cover" src="https://i.ibb.co/gj0Bpcc/logo-empresa-mila.png" alt="logo-empresa-mila" />
            </Link>
          </div>

          <button
            id="mobile-menu-button"
            type="button"
            className="inline-flex items-center p-2 ml-1 text-sm text-black-500 rounded-lg lg:hidden hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-200"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <span className="sr-only">Open main menu</span>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
            </svg>
          </button>

          <div id="desktop-menu" className="hidden lg:flex flex-col lg:flex-row lg:items-center lg:space-x-12 space-y-2 lg:space-y-0">
            <Link to="/DashboardCliente" className="flex items-center text-gray-900 hover:text-yellow-800 cursor-pointer font-semibold transition-colors duration-300 no-underline">
              <FontAwesomeIcon icon={faHome} className="mr-2" /> Inicio
            </Link>

            <Link to="/productos" className="flex items-center text-gray-900 hover:text-yellow-800 cursor-pointer font-semibold transition-colors duration-300 no-underline">
              <FontAwesomeIcon icon={faBox} className="mr-2" /> Productos
            </Link>
            <div className="relative" ref={menuRef}>
              <Link
                id="reservas-button"
                className="flex items-center text-gray-900 hover:text-yellow-800 cursor-pointer transition-colors duration-300 font-semibold no-underline"
                onClick={() => setShowReservasMenu(!showReservasMenu)}
              >
                <FontAwesomeIcon icon={faCalendar} className="mr-2" /> Reservas
              </Link>
              {showReservasMenu && (
                <div
                  id="reservas-menu"
                  className="dropdown-menu absolute mt-2 rounded-lg shadow-lg bg-white border"
                >
                  <Link
                    to="/reservalocal"
                    className="block px-4 py-2 hover:bg-gray-200"
                    onClick={() => setShowReservasMenu(false)}
                  >
                    Reserva local
                  </Link>
                  <Link
                    to="/ReservaMesa"
                    className="block px-4 py-2 hover:bg-gray-200"
                    onClick={() => setShowReservasMenu(false)}
                  >
                    Reserva mesa
                  </Link>
                  <Link
                    to="/reservascliente"
                    className="block px-4 py-2 hover:bg-gray-200"
                    onClick={() => setShowReservasMenu(false)}
                  >
                    Consulta tus reservas
                  </Link>
                </div>
              )}
            </div>


            <Link to="/pedidoss" className="flex items-center text-gray-900 hover:text-yellow-800 cursor-pointer transition-colors duration-300 font-semibold no-underline">
              <FontAwesomeIcon icon={faShoppingBasket} className="mr-2" /> Pedidos
            </Link>
            <div className="relative">
              <Link
                id="eventos-button"
                className="flex items-center text-gray-900 hover:text-yellow-800 cursor-pointer transition-colors duration-300 font-semibold no-underline"
                onClick={() => setShowEventosMenu(!showEventosMenu)}
              >
                <FontAwesomeIcon icon={faCalendarCheck} className="mr-2" /> Eventos
              </Link>
              <div id="eventos-menu" className={`dropdown-menu mt-2 rounded-lg shadow-lg bg-white ${showEventosMenu ? 'show' : ''}`}>
                <Link to="/EventosCliente" className="block px-4 py-2">Eventos</Link>
                <Link to="/MisInscripciones" className="block px-4 py-2">Mis Inscripciones</Link>
              </div>
            </div>
            <Link to="/servicios" className="flex items-center text-gray-900 hover:text-yellow-800 cursor-pointer transition-colors duration-300 font-semibold no-underline">
              <FontAwesomeIcon icon={faConciergeBell} className="mr-2" /> Servicios
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            <Link to="/Carrito" className="flex items-center">
              <img src="https://cdn-icons-png.flaticon.com/512/107/107831.png" alt="Carrito" className="h-8 w-8" />
            </Link>
            <div className="relative">
              <button
                id="user-menu-button"
                className="flex items-center text-gray-900 hover:text-yellow-800 cursor-pointer transition-colors duration-300 font-semibold no-underline"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <FontAwesomeIcon icon={faUser} className="text-gray-900 h-8 w-8" />
              </button>
              {showUserMenu && (
                <div id="user-menu" className="absolute right-0 mt-2 w-48 py-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <Link to="/perfilusuario" className="block px-4 py-2 text-gray-700 hover:bg-yellow-200 no-underline">Perfil</Link>
                  <button onClick={handleLogout} className="block w-full px-4 py-2 text-red-700 hover:bg-yellow-200 text-left">Cerrar sesión</button>
                </div>
              )}
            </div>
          </div>
        </nav>

        <div id="mobile-menu" className={`lg:hidden ${showMobileMenu ? 'block' : 'hidden'} fixed top-0 left-0 w-full h-full bg-white shadow-lg z-20`}>
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <span className="text-xl font-semibold">Menú</span>
            <button
              id="close-menu-button"
              className="text-gray-600 hover:text-gray-900"
              onClick={() => setShowMobileMenu(false)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div className="flex flex-col p-4 space-y-2">
            <Link to="/DashboardCliente" className="text-gray-900 hover:text-yellow-800" onClick={() => setShowMobileMenu(false)}>
              <FontAwesomeIcon icon={faHome} className="mr-2" /> Inicio
            </Link>
            <Link to="/productos" className="flex items-center text-gray-900 hover:text-yellow-800 cursor-pointer font-semibold transition-colors duration-300 no-underline">
              <FontAwesomeIcon icon={faBox} className="mr-2" /> Productos
            </Link>


            <div className="relative">
              <button
                id="mobile-reservas-button"
                className="text-gray-900 hover:text-yellow-800"
                onClick={() => setShowMobileReservasMenu(!showMobileReservasMenu)}
              >
                <FontAwesomeIcon icon={faCalendar} className="mr-2" /> Reservas
              </button>
              {showMobileReservasMenu && (
                <div id="mobile-reservas-menu" className="mt-2 pl-4 space-y-2">
                  <Link to="/InicioReservas" className="block text-gray-900 hover:text-yellow-800" onClick={() => setShowMobileMenu(false)}>Reserva local</Link>
                  <Link to="/ReservaMesa" className="block text-gray-900 hover:text-yellow-800" onClick={() => setShowMobileMenu(false)}>Reserva mesa</Link>
                </div>
              )}
            </div>
            
            <Link to="/pedidoss" className="text-gray-900 hover:text-yellow-800" onClick={() => setShowMobileMenu(false)}>
              <FontAwesomeIcon icon={faShoppingBasket} className="mr-2" /> Pedidos
            </Link>
            <Link to="/eventos" className="text-gray-900 hover:text-yellow-800" onClick={() => setShowMobileMenu(false)}>
              <FontAwesomeIcon icon={faCalendarCheck} className="mr-2" /> Eventos
            </Link>
            <Link to="/servicios" className="text-gray-900 hover:text-yellow-800" onClick={() => setShowMobileMenu(false)}>
              <FontAwesomeIcon icon={faConciergeBell} className="mr-2" /> Servicios
            </Link>
            <Link to="/perfilusuario" className="text-gray-900 hover:text-yellow-800" onClick={() => setShowMobileMenu(false)}>
              <FontAwesomeIcon icon={faUser} className="mr-2" /> Perfil
            </Link>
            <button onClick={handleLogout} className="text-gray-900 hover:text-yellow-800">
              <FontAwesomeIcon icon={faUser} className="mr-2" /> Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  
};



export default BarraCliente;
