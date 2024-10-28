import React, { useEffect } from 'react';
import 'chart.js/auto';
import BarraAdmin from '../componentes/barras/BarraAdministrador';

const DashboardAdmin = () => {
 

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <BarraAdmin/>
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center border-b-4 border-yellow-500 pb-4">
        Panel de Administrador
      </h1>

      {/* Tarjetas de funciones del administrador */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
        {/* Tarjeta de Administración de Usuarios */}
        <div className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-yellow-500">
          <div className="flex justify-center mb-4">
            <i className="fa fa-users text-yellow-500 text-5xl"></i>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Administrar Usuarios</h2>
          <p className="text-gray-600 text-center">Gestiona las cuentas de usuarios, agrega nuevos o actualiza información fácilmente.</p>
        </div>

        {/* Tarjeta de Reservas */}
        <div className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-yellow-500">
          <div className="flex justify-center mb-4">
            <i className="fa fa-calendar-alt text-yellow-500 text-5xl"></i>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Reservas</h2>
          <p className="text-gray-600 text-center">Consulta, elimina o modifica las reservas de los clientes con facilidad.</p>
        </div>

        {/* Tarjeta de Pedidos y Reportes */}
        <div className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-yellow-500">
          <div className="flex justify-center mb-4">
            <i className="fa fa-file-alt text-yellow-500 text-5xl"></i>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Pedidos y Reportes</h2>
          <p className="text-gray-600 text-center">Genera informes detallados sobre los pedidos, con la opción de hacer seguimiento.</p>
        </div>

        {/* Tarjeta de Administración de Eventos */}
        <div className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-yellow-500">
          <div className="flex justify-center mb-4">
            <i className="fa fa-calendar-check text-yellow-500 text-5xl"></i>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Administrar Eventos</h2>
          <p className="text-gray-600 text-center">Crea y gestiona eventos de forma sencilla. Ajusta detalles como la fecha y lugar.</p>
        </div>
      </div>

      {/* Resumen principal en tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
        <div className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-yellow-500">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ventas del Día</h2>
          <p className="text-4xl font-bold text-yellow-600">$12,450</p>
          <p className="text-gray-500 mt-2">Actualizado hace 5 minutos</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-yellow-500">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Reservaciones</h2>
          <p className="text-4xl font-bold text-yellow-600">18</p>
          <p className="text-gray-500 mt-2">Reservas para hoy</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-yellow-500">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Pedidos en Proceso</h2>
          <p className="text-4xl font-bold text-yellow-600">8</p>
          <p className="text-gray-500 mt-2">En preparación</p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-yellow-500">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Comentarios Recientes</h2>
          <p className="text-4xl font-bold text-yellow-600">4.7</p>
          <p className="text-gray-500 mt-2">Calificación promedio</p>
        </div>
      </div>

      {/* Gráfico de ventas */}
      <div className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-yellow-500 mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ventas Semanales</h2>
        <canvas id="salesChart" width="400" height="200"></canvas>
      </div>
    </div>
  );
};

export default DashboardAdmin;
