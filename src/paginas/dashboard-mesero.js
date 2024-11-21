import React, { useEffect } from 'react';
import 'chart.js/auto';
import BarraMesero from '../componentes/barras/Barra_Mesero';

const DashboardMesero = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <BarraMesero/>
      {/* Título */}
      <h1 className="text-3xl font-semibold text-gray-800 mb-6 border-b-4 border-yellow-500">
        Panel del Cajero
      </h1>
      {/* Resumen principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tarjeta de pedidos activos */}
        <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-yellow-500">
          <h2 className="text-xl font-medium text-gray-800 flex items-center">
            <i className="fas fa-receipt text-yellow-500 mr-2" /> Pedidos Activos
          </h2>
          <p className="text-3xl font-bold text-yellow-600 mt-4">5</p>
          <p className="text-gray-500 mt-2">Pendientes de cobro</p>
        </div>
        {/* Tarjeta de total de transacciones */}
        <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-yellow-500">
          <h2 className="text-xl font-medium text-gray-800 flex items-center">
            <i className="fas fa-dollar-sign text-yellow-500 mr-2" /> Transacciones del Día
          </h2>
          <p className="text-3xl font-bold text-yellow-600 mt-4">$7,850</p>
          <p className="text-gray-500 mt-2">Hasta ahora</p>
        </div>
        {/* Tarjeta de métodos de pago */}
        <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-yellow-500">
          <h2 className="text-xl font-medium text-gray-800 flex items-center">
            <i className="fas fa-credit-card text-yellow-600 mr-2" /> Métodos de Pago
          </h2>
          <p className="text-3xl font-bold text-yellow-600 mt-4">Tarjeta: 70%</p>
          <p className="text-gray-500 mt-2">Efectivo: 30%</p>
        </div>
      </div>
      {/* Lista de pedidos en espera */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-lg border-2 border-yellow-500">
        <h2 className="text-xl font-medium text-gray-800 mb-4 flex items-center">
          <i className="fas fa-clock text-yellow-500 mr-2" /> Pedidos en Espera de Cobro
        </h2>
        <ul className="space-y-4">
          <li className="flex justify-between items-center">
            <span>Pedido #12450</span>
            <span className="text-green-600 font-bold">$120</span>
          </li>
          <li className="flex justify-between items-center">
            <span>Pedido #12451</span>
            <span className="text-green-600 font-bold">$95</span>
          </li>
          <li className="flex justify-between items-center">
            <span>Pedido #12452</span>
            <span className="text-green-600 font-bold">$60</span>
          </li>
        </ul>
      </div>
      {/* Notificaciones importantes */}
      <div className="mt-6">
        <div className="bg-red-100 p-6 rounded-lg shadow-lg border-2 border-yellow-500">
          <h2 className="text-xl font-medium text-red-800 flex items-center">
            <i className="fas fa-exclamation-circle text-yellow-500 mr-2" /> Alertas de Cobro
          </h2>
          <p className="text-red-700 mt-2">
            Pedido #12450 lleva esperando más de 15 minutos para ser cobrado.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardMesero;
