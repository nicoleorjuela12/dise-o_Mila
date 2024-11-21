import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBox, faUsers, faCalendar, faShoppingBasket, faCalendarCheck, faConciergeBell, faUser } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import axios from 'axios';

const DropdownMenu = ({ title, icon, links, onMenuClose }) => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = (e) => {
    e.stopPropagation(); // Evitar que el clic se propague y cierre el menú padre
    setShowMenu((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = () => {
      if (showMenu) {
        setShowMenu(false);
        onMenuClose(); // Llama a la función para cerrar otros menús
      }
    };

    // Agrega un evento al documento para cerrar el menú al hacer clic fuera
    document.addEventListener('click', handleClickOutside);

    // Limpia el evento al desmontar el componente
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showMenu, onMenuClose]);

  return (
    <div className="relative">
      <button
        className="flex items-center text-gray-900 hover:text-yellow-800 cursor-pointer transition-colors duration-300 font-semibold no-underline"
        onClick={toggleMenu}
        aria-expanded={showMenu}
      >
        <FontAwesomeIcon icon={icon} className="mr-2" /> {title}
      </button>
      {showMenu && (
        <div className="absolute mt-2 rounded-lg shadow-lg bg-yellow-50 w-44">
          {links.map((link, index) => (
            <Link key={index} to={link.path} className="block px-4 py-2 text-gray-700 hover:bg-yellow-100 no-underline">
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const BarraAdmin = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post('http://localhost:8000/usuarios/cerrarsesion', {}, { withCredentials: true });
      if (response.status === 200) {
        localStorage.clear();
        Swal.fire({
          title: 'Sesión cerrada',
          text: 'Has cerrado sesión exitosamente',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        }).then(() => navigate('/login'));
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Error',
        text: 'Ocurrió un error al cerrar sesión',
        icon: 'error',
        confirmButtonText: 'Reintentar'
      });
    }
  };

  const handleMobileMenuToggle = () => {
    setShowMobileMenu((prev) => !prev);
  };

  const handleUserMenuToggle = () => {
    setShowUserMenu((prev) => !prev);
  };

  const closeUserMenu = () => {
    setShowUserMenu(false);
  };

  return (
    <div className="flex flex-col items-center justify-center mb-24">
      <nav className="flex justify-between items-center py-4 navbar_gradient backdrop-blur-md shadow-md w-full fixed top-0 left-0 right-0 z-10 h-24 px-8">
        <div className="flex items-center space-x-4">
          <Link to="/" className="cursor-pointer flex items-center">
            <img className="h-20 object-cover" src="https://i.ibb.co/gj0Bpcc/logo-empresa-mila.png" alt="logo-empresa-mila" />
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex items-center p-2 ml-1 text-sm text-black-500 rounded-lg lg:hidden hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-200"
          onClick={handleMobileMenuToggle}
        >
          <span className="sr-only">Open main menu</span>
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
          </svg>
        </button>

        <div className="hidden lg:flex flex-col lg:flex-row lg:items-center lg:space-x-12">
          <Link to="/DashboardAdmin" className="flex items-center text-gray-900 hover:text-yellow-800 cursor-pointer font-semibold transition-colors duration-300 no-underline">
            <FontAwesomeIcon icon={faHome} className="mr-2" /> Inicio
          </Link>

          <DropdownMenu 
            title="Productos" 
            icon={faBox} 
            links={[
              { name: 'Registro productos', path: '/RegistrarProductos' },
              { name: 'Gestión productos', path: '/GestionProductos' },
            ]}
            onMenuClose={closeUserMenu} // Pasar la función para cerrar otros menús
          />

          <DropdownMenu 
            title="Usuarios" 
            icon={faUsers} 
            links={[
              { name: 'Registro usuarios', path: '/registroempleados' },
              { name: 'Consulta usuarios', path: '/consultausarios' },
            ]}
            onMenuClose={closeUserMenu}
          />

          <DropdownMenu 
            title="Reservas" 
            icon={faCalendar} 
            links={[
              { name: 'Consulta reservas', path: '/GestionReservasAdmin' },
            ]}
            onMenuClose={closeUserMenu}
          />

          <Link to="/pedidos" className="flex items-center text-gray-900 hover:text-yellow-800 cursor-pointer transition-colors duration-300 font-semibold no-underline">
            <FontAwesomeIcon icon={faShoppingBasket} className="mr-2" /> Pedidos
          </Link>

          <DropdownMenu 
            title="Eventos" 
            icon={faCalendarCheck} 
            links={[
              { name: 'Registrar Eventos', path: '/RegistroEventos' },
              { name: 'Modificar Eventos', path: '/ModificarEventos' },
            ]}
            onMenuClose={closeUserMenu}
          />

          <Link to="/servicios" className="flex items-center text-gray-900 hover:text-yellow-800 cursor-pointer transition-colors duration-300 font-semibold no-underline">
            <FontAwesomeIcon icon={faConciergeBell} className="mr-2" /> Servicios
          </Link>
        </div>

        <div className="flex items-center space-x-6">
          <Link to="/carrito" className="flex items-center">
            <img src="https://cdn-icons-png.flaticon.com/512/107/107831.png" alt="Carrito" className="h-8 w-8" />
          </Link>
          <div className="relative">
            <button
              className="flex items-center text-gray-900 hover:text-yellow-800 cursor-pointer transition-colors duration-300 font-semibold no-underline"
              onClick={handleUserMenuToggle}
              aria-expanded={showUserMenu}
            >
              <FontAwesomeIcon icon={faUser} className="text-gray-900 h-8 w-8" />
            </button>
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 py-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                <Link to="/perfilusuario" className="block px-4 py-2 text-gray-700 hover:bg-yellow-200 no-underline">Perfil</Link>
                <button onClick={handleLogout} className="block w-full px-4 py-2 text-red-700 hover:bg-yellow-200 text-left">Cerrar sesión</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {showMobileMenu && (
        <div className="lg:hidden fixed top-0 left-0 w-full h-full bg-white shadow-lg z-20">
          <div className="flex justify-between items-center px-4 py-3 bg-yellow-100">
            <h2 className="text-lg font-bold">Menú</h2>
            <button onClick={handleMobileMenuToggle}>
              <span className="text-xl">&times;</span>
            </button>
          </div>
          <div className="flex flex-col p-4">
            <Link to="/DashboardAdmin" className="py-2 text-gray-900 hover:text-yellow-800">Inicio</Link>
            <Link to="/productos" className="py-2 text-gray-900 hover:text-yellow-800">Productos</Link>
            <Link to="/usuarios" className="py-2 text-gray-900 hover:text-yellow-800">Usuarios</Link>
            <Link to="/reservas" className="py-2 text-gray-900 hover:text-yellow-800">Reservas</Link>
            <Link to="/pedidos" className="py-2 text-gray-900 hover:text-yellow-800">Pedidos</Link>
            <Link to="/eventos" className="py-2 text-gray-900 hover:text-yellow-800">Eventos</Link>
            <Link to="/servicios" className="py-2 text-gray-900 hover:text-yellow-800">Servicios</Link>
            <button onClick={handleLogout} className="py-2 text-red-600">Cerrar sesión</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BarraAdmin;
