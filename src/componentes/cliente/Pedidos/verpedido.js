import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReceipt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { faUser, faIdCard, faEnvelope, faMapMarkerAlt, faBox, faTag, faImage } from '@fortawesome/free-solid-svg-icons';
import API_URL from '../../../config/config';

const Pedidos = () => {
    const [open, setOpen] = useState(false);
    const [pedidos, setPedidos] = useState([]);
    const [selectedPedido, setSelectedPedido] = useState(null);
    const [activeTab, setActiveTab] = useState('pendiente');
    const navigate = useNavigate();
    const id_usuario = localStorage.getItem('id_usuario');

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const response = await axios.get(`${API_URL}/usuarios/pedido/${id_usuario}`);
                const pedidosFiltrados = response.data.filter(pedido => pedido.id_usuario === parseInt(id_usuario));
                const pedidosPorEstado = pedidosFiltrados
                    .filter(pedido => activeTab === 'pendiente' ? pedido.estado_pedido === 'Pendiente' : pedido.estado_pedido === 'Entregado')
                    .sort((a, b) => new Date(`${a.fecha}T${a.hora}`) - new Date(`${b.fecha}T${b.hora}`));

                setPedidos(pedidosPorEstado);
            } catch (error) {
                console.error("Error al obtener los datos de los pedidos:", error);
            }
        };

        fetchPedidos();
    }, [id_usuario, activeTab]);

    const handleVerMas = (pedido) => {
        setSelectedPedido(pedido);
        setOpen(true);
    };

    const handleIrAProductos = () => {
        navigate('/productos');
    };
    
    return (
        <div className="max-w-7xl mx-auto mb-24 mt-32">
            <div className="flex justify-center mb-6">
                <button
                    onClick={() => setActiveTab('pendiente')}
                    className={`px-6 py-2 mx-2 rounded-lg ${activeTab === 'pendiente' ? 'bg-yellow-500 text-white' : 'bg-gray-300 text-gray-700'} hover:bg-yellow-400 transition duration-300`}
                >
                    Pendientes
                </button>
                <button
                    onClick={() => setActiveTab('entregado')}
                    className={`px-6 py-2 mx-2 rounded-lg ${activeTab === 'entregado' ? 'bg-yellow-500 text-white' : 'bg-gray-300 text-gray-700'} hover:bg-yellow-400 transition duration-300`}
                >
                    Entregados
                </button>
            </div>

            {pedidos.length === 0 ? (
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">¡No tienes pedidos!</h2>
                    <p className="text-gray-600 mb-6">Parece que aún no has realizado ningún pedido. ¡Descubre nuestros productos!</p>
                    <button 
                        onClick={handleIrAProductos} 
                        className="bg-yellow-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-yellow-600 transition duration-300"
                    >
                        Ir a Productos
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pedidos.map(pedido => (
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
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 font-medium">Cantidad:</span>
                                        <span className="text-gray-800 font-semibold">{pedido.cantidad}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 text-center rounded-b-xl">
                                <button 
                                    onClick={() => handleVerMas(pedido)} 
                                    className="bg-white text-black-500 px-6 py-2 rounded-lg shadow-md hover:bg-yellow-300 transition duration-300"
                                >
                                    Ver Más
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {open && selectedPedido && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl w-4/5 md:w-3/4 lg:w-2/3 h-auto max-h-[80vh] p-4 overflow-y-auto">
                        <div className="text-center mb-3">
                            <h2 className="text-2xl font-bold text-gray-800">Detalles del Usuario y de los productos</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Información del Usuario */}
                            <div className="p-4 bg-gradient-to-r from-yellow-200 via-yellow-200 to-yellow-200 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 text-gray-900 text-center ">
                                    <FontAwesomeIcon icon={faUser} className="mr-2 text-yellow-600" />
                                    Información del Cliente
                                </h3>

                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <FontAwesomeIcon icon={faIdCard} className="mr-2 text-yellow-600"  />
                                        <p><strong>Nombre:</strong> {selectedPedido.usuario?.nombre} {selectedPedido.usuario?.apellido}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <FontAwesomeIcon icon={faIdCard} className="mr-2 text-yellow-600"  />
                                        <p><strong>Número de Documento:</strong> {selectedPedido.usuario?.numero_documento}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-yellow-600" />
                                        <p><strong>Correo:</strong> {selectedPedido.usuario?.correo}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <FontAwesomeIcon icon={faMapMarkerAlt}className="mr-2 text-yellow-600"  />
                                        <p><strong>Dirección:</strong> {selectedPedido.usuario?.direccion}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-yellow-600"  />
                                        <p><strong>Barrio:</strong> {selectedPedido.usuario?.barrio}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Detalles de los productos */}
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

                        <button
                            onClick={() => setOpen(false)}
                            className="mt-6 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Pedidos;
