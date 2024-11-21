import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReceipt, faCheck, faFilter, faUser, faIdCard, faEnvelope, faMapMarkerAlt, faBox, faTag, faUndo  } from '@fortawesome/free-solid-svg-icons';
import Swal from "sweetalert2";


const GestionPedidos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [filteredPedidos, setFilteredPedidos] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedPedido, setSelectedPedido] = useState(null);
    const [filters, setFilters] = useState({
        horaInicio: '11:00',
        horaFin: '18:00',
        tipoEntrega: 'todos',
    });
    const [openFilters, setOpenFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const pedidosPorPagina = 6;

    useEffect(() => {
        fetchPedidosPendientes();
    }, []);

    useEffect(() => {
        aplicarFiltros();
    }, [pedidos, filters]);

    const fetchPedidosPendientes = async () => {
        try {
            const response = await axios.post('http://localhost:8000/usuarios/pedidos');
            setPedidos(response.data);
            Swal.fire({
                icon: 'success',
                title: 'Pedidos pendientes cargados',
                text: `Se obtuvieron ${response.data.length} pedidos pendientes.`,
                timer: 3000,
            });
        } catch (error) {
            console.error("Error al obtener los pedidos pendientes:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error al obtener los pedidos pendientes',
                text: `Error: ${error.message}`,
            });
        }
    };
    const actualizarEstadoPedido = async (id_pedido, nuevoEstado) => {
        try {
            const response = await axios.put(`http://localhost:8000/usuarios/pedidos/${id_pedido}`, {
                estado_reserva: nuevoEstado,
            });
            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Estado actualizado',
                    text: `El pedido ha sido actualizado a ${nuevoEstado}.`,
                    timer: 3000,
                });
                // Actualizar los pedidos locales después de la actualización
                const updatedPedidos = pedidos.map((pedido) =>
                    pedido.id_pedido === id_pedido ? { ...pedido, estado_reserva: nuevoEstado } : pedido
                );
                setPedidos(updatedPedidos);
            }
        } catch (error) {
            console.error("Error al actualizar el estado del pedido:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error al actualizar el estado',
                text: `Error: ${error.message}`,
            });
        }
    };
    

    const aplicarFiltros = () => {
        const { horaInicio, horaFin, tipoEntrega,metodoPago } = filters;
        const pedidosFiltrados = pedidos.filter((pedido) => {
            const horaPedido = `${pedido.fecha}T${pedido.hora}`;
            const horaInicioValid = new Date(horaPedido) >= new Date(`${pedido.fecha}T${horaInicio}`);
            const horaFinValid = new Date(horaPedido) <= new Date(`${pedido.fecha}T${horaFin}`);
            const tipoEntregaValid = tipoEntrega === 'todos' || pedido.tipo_entrega === tipoEntrega;
            const metodoPagoValid = metodoPago === 'todos' || pedido.metodo_pago === metodoPago;

            return horaInicioValid && horaFinValid && tipoEntregaValid && metodoPagoValid ;
        });

        // Ordenar los pedidos por hora y minutos (de 11:00 AM a 18:00 PM)
        pedidosFiltrados.sort((a, b) => {
            const horaA = new Date(`${a.fecha}T${a.hora}`);
            const horaB = new Date(`${b.fecha}T${b.hora}`);
            return horaA - horaB;
        });

        setFilteredPedidos(pedidosFiltrados);
    };

    const handleVerMas = (pedido) => {
        setSelectedPedido(pedido);
        setOpen(true);
    };

    const handleCerrarModal = () => {
        setOpen(false);
        setSelectedPedido(null);
    };

    const handleAbrirFiltro = () => {
        setOpenFilters(true);
    };

    const handleCerrarFiltro = () => {
        setOpenFilters(false);
    };

    const handleRestaurarFiltros = () => {
        setFilters({
            horaInicio: '11:00',
            horaFin: '18:00',
            tipoEntrega: 'todos',
            metodoPago:"todos"
        });
    };

    // Paginación
    const totalPages = Math.ceil(filteredPedidos.length / pedidosPorPagina);
    const pedidosPaginaActual = filteredPedidos.slice((currentPage - 1) * pedidosPorPagina, currentPage * pedidosPorPagina);

    return (
        <div className="max-w-7xl mx-auto mb-24 mt-32">
            {/* Icono de Filtros en la parte superior derecha */}
            <div className="flex justify-end mb-6">
                <button 
                    onClick={handleAbrirFiltro}
                    className="bg-yellow-600 text-white p-3 rounded-full shadow-md hover:bg-yellow-500 transition duration-300"
                >
                    <FontAwesomeIcon icon={faFilter} className="w-6 h-6" />
                </button>
            </div>

            {/* Listado de pedidos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pedidosPaginaActual.map(pedido => (
                    <div key={pedido.id_pedido} className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 rounded-xl shadow-lg overflow-hidden mt-4">
                        <div className="flex items-center justify-between p-6 bg-white rounded-t-xl">
                            <div className="flex items-center space-x-4">
                                <div className="bg-yellow-600 text-white p-3 rounded-full">
                                    <FontAwesomeIcon icon={faReceipt} className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">Detalles del Pedido</h2>
                                    <p className="text-gray-500">Fecha y Hora: {pedido.fecha} {pedido.hora}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-100 p-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 font-medium">Método de Pago:</span>
                                    <span className="text-gray-800 font-semibold">{pedido.metodo_pago}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 font-medium">Total:</span>
                                    <span className="text-gray-800 font-semibold">${pedido.total}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 font-medium">Tipo de Entrega:</span>
                                    <span className="text-gray-800 font-semibold">{pedido.tipo_entrega}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 text-center rounded-b-xl">
                            <button
                                onClick={() => handleVerMas(pedido)}
                                className="bg-white text-black px-6 py-2 rounded-lg shadow-md hover:bg-yellow-300 transition duration-300"
                            >
                                Ver Más
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Paginación */}
            <div className="flex justify-center mt-6">
                <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-500 transition duration-300"
                >
                    Anterior
                </button>
                <span className="px-4 py-2">{currentPage} de {totalPages}</span>
                <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-500 transition duration-300"
                >
                    Siguiente
                </button>
            </div>

            {/* Modal de Detalles */}
            {open && selectedPedido && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl w-4/5 md:w-3/4 lg:w-2/3 h-auto max-h-[80vh] p-4 overflow-y-auto">
                        <div className="text-center mb-3">
                            <h2 className="text-2xl font-bold text-gray-800">Detalles del Pedido</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Información del Cliente */}
                            <div className="p-4 bg-gradient-to-r from-yellow-200 via-yellow-200 to-yellow-200 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-800 text-center">
                                    <FontAwesomeIcon icon={faUser} className="mr-2 text-yellow-600" />
                                    Información del Cliente
                                </h3>
                                <div className="space-y-4">
                                    <p><strong>Nombre:</strong> {selectedPedido.usuario?.nombre} {selectedPedido.usuario?.apellido}</p>
                                    <p><strong>Documento:</strong> {selectedPedido.usuario?.numero_documento}</p>
                                    <p><strong>Correo:</strong> {selectedPedido.usuario?.correo}</p>
                                    <p><strong>Dirección:</strong> {selectedPedido.usuario?.direccion}</p>
                                    <p><strong>Barrio:</strong> {selectedPedido.usuario?.barrio}</p>
                                </div>
                            </div>

                            {/* Información del Pedido */}
                            <div className="p-4 bg-gradient-to-r from-yellow-200 via-yellow-200 to-yellow-200 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 text-gray-900  text-center">
                                    <FontAwesomeIcon icon={faBox} className="mr-2 text-yellow-600  " />
                                    Detalles de los productos
                                </h3>
                                {selectedPedido.Aparecers && Array.isArray(selectedPedido.Aparecers) && selectedPedido.Aparecers.map((producto) => (
                                    <div key={producto.id_producto} className="flex items-center space-x-4 mb-4">
                                        {/* Imagen del producto */}
                                        <div className="w-24 h-24 bg-gray-200 rounded-md overflow-hidden">
                                            <img src={producto.Producto?.imagen} alt={producto.Producto?.nombre} className="w-full h-full object-cover" />
                                        </div>
                                        {/* Detalles del producto */}
                                        <div className="flex-1">
                                            <div className="flex items-center mb-2">
                                                <FontAwesomeIcon icon={faTag} className="text-gray-700 mr-2" />
                                                <p><strong>Nombre del Producto:</strong> {producto.Producto?.nombre}</p>
                                            </div>
                                            <div className="flex items-center mb-2">
                                                <FontAwesomeIcon icon={faTag} className="text-gray-700 mr-2" />
                                                <p><strong>Precio por Unidad:</strong> ${producto.precio_unidad}</p>
                                            </div>
                                            <div className="flex items-center mb-2">
                                                <FontAwesomeIcon icon={faTag} className="text-gray-700 mr-2" />
                                                <p><strong>Cantidad:</strong> {producto.cantidad_unidad}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <button
                                onClick={handleCerrarModal}
                                className="bg-yellow-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-yellow-500 transition duration-300"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Filtros */}
            {openFilters && (
              <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-lg shadow-xl w-4/5 md:w-3/4 lg:w-2/3 p-6">
                  <div className="text-center mb-6">
                      <h3 className="text-xl font-semibold text-gray-800">
                          <FontAwesomeIcon icon={faFilter} className="mr-2 text-yellow-600" />
                          Filtros
                      </h3>
                  </div>
          
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Hora de Inicio */}
                        <div>
                            <label htmlFor="horaInicio" className="block text-sm font-medium text-gray-700">
                                Hora de Inicio
                            </label>
                            <input
                                type="time"
                                id="horaInicio"
                                value={filters.horaInicio}
                                onChange={(e) => setFilters({ ...filters, horaInicio: e.target.value })}
                                className="mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-yellow-600 focus:border-yellow-600 block w-full"
                            />
                        </div>

                        {/* Hora de Fin */}
                        <div>
                            <label htmlFor="horaFin" className="block text-sm font-medium text-gray-700">
                                Hora de Fin
                            </label>
                            <input
                                type="time"
                                id="horaFin"
                                value={filters.horaFin}
                                onChange={(e) => setFilters({ ...filters, horaFin: e.target.value })}
                                className="mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-yellow-600 focus:border-yellow-600 block w-full"
                            />
                        </div>

                        {/* Tipo de Entrega */}
                        <div>
                            <label htmlFor="tipoEntrega" className="block text-sm font-medium text-gray-700">
                                Tipo de Entrega
                            </label>
                            <select
                                id="tipoEntrega"
                                value={filters.tipoEntrega}
                                onChange={(e) => setFilters({ ...filters, tipoEntrega: e.target.value })}
                                className="mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-yellow-600 focus:border-yellow-600 block w-full"
                            >
                                <option value="todos">Todos</option>
                                <option value="Domicilio">Domicilio</option>
                                <option value="Recoger en tienda">Retiro</option>
                            </select>
                        </div>

                        {/* Método de Pago */}
                        <div>
                            <label htmlFor="metodoPago" className="block text-sm font-medium text-gray-700">
                                Método de Pago
                            </label>
                            <select
                                id="metodoPago"
                                value={filters.metodoPago}
                                onChange={(e) => setFilters({ ...filters, metodoPago: e.target.value })}
                                className="mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-yellow-600 focus:border-yellow-600 block w-full"
                            >
                                <option value="todos">Todos</option>
                                <option value="Efectivo">Efectivo</option>
                                <option value="Tarjeta">Tarjeta</option>
                                <option value="Transferencia">Transferencia</option>
                            </select>
                        </div>
                    </div>

          
                  <div className="flex justify-between mt-6">
                      <button
                          onClick={handleRestaurarFiltros}
                          className="flex items-center text-yellow-600 hover:text-yellow-500 transition duration-300"
                      >
                          <FontAwesomeIcon icon={faUndo} className="mr-2" />
                          Restaurar Filtros
                      </button>
                      <button
                          onClick={handleCerrarFiltro}
                          className="flex items-center bg-yellow-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-yellow-500 transition duration-300"
                      >
                          <FontAwesomeIcon icon={faCheck} className="mr-2" />
                          Aplicar
                      </button>
                  </div>
              </div>
          </div>
          
            )}
        </div>
    );
};

export default GestionPedidos;
