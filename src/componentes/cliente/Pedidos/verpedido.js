import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReceipt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const Pedidos = ({ userId }) => {
    const [open, setOpen] = useState(false);
    const [pedidos, setPedidos] = useState([]);
    const [selectedPedido, setSelectedPedido] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/pedidos?idusuario=${userId}`);
                console.log(response.data); // Verifica la estructura de los datos
                const pedidosFiltrados = response.data
                    .filter(pedido => pedido.idusuario === userId)
                    .filter(pedido => pedido.estado === 'activo')
                    .filter(pedido => {
                        const hora = new Date(`1970-01-01T${pedido.hora}`).getHours();
                        return hora >= 11 && hora <= 18;
                    })
                    .sort((a, b) => new Date(`${a.fecha}T${a.hora}`) - new Date(`${b.fecha}T${b.hora}`));
            
                setPedidos(pedidosFiltrados);
            } catch (error) {
                console.error("Error al obtener los datos de los pedidos:", error);
            }
        };
        
    
        fetchPedidos();
    }, [userId]);

    const handleVerMas = (pedido) => {
        setSelectedPedido(pedido);
        setOpen(true);
    };

    const handleIrAProductos = () => {
        navigate('/productos');
    };

    return (
        <div className="max-w-7xl mx-auto mb-24 mt-32">
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
                        <div key={pedido.id} className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 rounded-xl shadow-lg overflow-hidden mt-4">
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
                                        <span className="text-gray-800 font-semibold">{pedido.metodoPago}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 font-medium">Total:</span>
                                        <span className="text-gray-800 font-semibold">${pedido.total}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 font-medium">Tipo de Entrega:</span>
                                        <span className="text-gray-800 font-semibold">{pedido.tipoEntrega}</span>
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

                        <div className="flex flex-col space-y-4">
                            <div className="p-3 bg-gray-100 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Información del Usuario</h3>
                                <p><strong>Nombre:</strong> {selectedPedido.usuario.nombre} {selectedPedido.usuario.apellido}</p>
                                <p><strong>Número de Documento:</strong> {selectedPedido.usuario.numero_documento}</p>
                                <p><strong>Dirección:</strong> {selectedPedido.usuario.direccion}</p>
                                <p><strong>Barrio:</strong> {selectedPedido.usuario.barrio}</p>
                            </div>

                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Detalles de los productos</h3>
                                {selectedPedido.carrito.map(item => (
                                    <div key={item.id} className="mt-2">
                                        <h4 className="font-semibold">{item.nombre}</h4>
                                        <p><strong>Precio:</strong> ${item.precio}</p>
                                        <p><strong>Cantidad:</strong> {item.cantidad}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-4 text-right">
                            <button 
                                onClick={() => setOpen(false)} 
                                className="bg-yellow-500 text-black-500 px-4 py-2 rounded-lg shadow-md hover:bg-yellow-600 transition duration-300"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Pedidos;
