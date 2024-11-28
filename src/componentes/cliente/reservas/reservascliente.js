import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import API_URL from '../../../config/config'; 


const MisReservas = () => {
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredReservas, setFilteredReservas] = useState([]); // Cambiado a array vacío
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 30;

    const [filters, setFilters] = useState({
        fecha: '',
        horainicio: '',
        numero_personas: '',
        tipo_reserva: ''
    });

    const currentYear = new Date().getFullYear();
    const minDate = `${currentYear}-01-01`;
    const maxDate = `${currentYear}-12-31`;

    useEffect(() => {
        const fetchData = async () => {
            const id_usuario = parseInt(localStorage.getItem('id_usuario'), 10); // Conversión a número
            console.log("User ID recuperado en MisReservas:", id_usuario);

            if (!isNaN(id_usuario)) {
                try {
                    const responseReservas = await Axios.get(`${API_URL}/usuarios/reservas`);
                    const misReservas = responseReservas.data.filter(reserva => reserva.id_usuario === id_usuario);
                    const responseReservaLocal = await Axios.get(`${API_URL}/usuarios/reservalocal`);
                    const misReservasLocal = responseReservaLocal.data.filter(reserva => reserva.id_usuario === id_usuario);
                    const responseUsuario = await Axios.get(`${API_URL}/usuarios/reservas/${id_usuario}`);
                    setUserData(responseUsuario.data);

                    const todasReservas = [...misReservas, ...misReservasLocal];
                    setReservas(todasReservas);
                    setFilteredReservas(todasReservas); // Inicializa el estado filtrado
                } catch (error) {
                    setError("Error al recuperar reservas: " + error.message);
                } finally {
                    setLoading(false);
                }
            } else {
                setError("User ID no encontrado en localStorage o es inválido.");
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const applyFilters = () => {
        const { fecha, horainicio, numero_personas, tipo_reserva } = filters;

        const filtered = reservas.filter(reserva => {
            return (
                (fecha ? reserva.fecha === fecha : true) &&
                (horainicio ? reserva.horainicio === horainicio : true) && // Asegúrate de usar horainicio
                (numero_personas ? reserva.numero_personas === Number(numero_personas) : true) &&
                (tipo_reserva === "todos" || tipo_reserva === "" ? true : reserva.tipo_reserva === tipo_reserva)
            );
        });

        setFilteredReservas(filtered);
        setCurrentPage(1); // Resetear la página actual al aplicar filtros
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };

    const paginatedReservas = filteredReservas.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredReservas.length / itemsPerPage); // Usar filteredReservas aquí

    if (loading) return <p>Cargando datos...</p>;
    if (error) return <p>Hubo un error: {error}</p>;

    return (
        <div>
            <div className="w-full bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Reserva Mesa</h2>
                <p className="text-gray-600 mb-6">Visualiza las reservas realizadas</p>
                <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    <input 
                        type="date" 
                        name="fecha" 
                        placeholder="Filtrar por fecha" 
                        onChange={handleFilterChange} 
                        className="px-4 py-2 border border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500" 
                        min={minDate} 
                        max={maxDate} 
                    />
                    <input 
                        type="time" 
                        name="horainicio" 
                        placeholder="Filtrar por hora de inicio" 
                        onChange={handleFilterChange} 
                        className="px-4 py-2 border border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500" 
                    />
                    <input 
                        type="number" 
                        name="numero_personas" 
                        placeholder="Filtrar por número de personas" 
                        onChange={handleFilterChange} 
                        className="px-4 py-2 border border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500" 
                    />
                    <select 
                        name="tipo_reserva" 
                        onChange={handleFilterChange} 
                        className="px-4 py-2 border border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                        <option value="todos">Todos</option>
                        <option value="Reserva Mesa">Mesa</option>
                        <option value="Reserva Local">Local</option>
                    </select>
                    <div className="col-span-2 md:col-span-3 lg:col-span-4 flex justify-end">
                        <button 
                            onClick={applyFilters} 
                            className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                            >
                            Aplicar Filtros
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-200 text-left text-sm text-gray-600">
                                <th className="py-2 px-4 border-b border-yellow-400">Nombre</th>
                                <th className="py-2 px-4 border-b border-yellow-400">Número de Documento</th>
                                <th className="py-2 px-4 border-b border-yellow-400">Teléfono</th>
                                <th className="py-2 px-4 border-b border-yellow-400">Correo</th>
                                <th className="py-2 px-4 border-b border-yellow-400">Número de Personas</th>
                                <th className="py-2 px-4 border-b border-yellow-400">Fecha</th>
                                <th className="py-2 px-4 border-b border-yellow-400">Hora de Inicio</th>
                                <th className="py-2 px-4 border-b border-yellow-400">Hora de Finalización</th>
                                <th className="py-2 px-4 border-b border-yellow-400">Estado</th>
                                <th className="py-2 px-4 border-b border-yellow-400">Tipo de Reserva</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedReservas.length > 0 ? (
                                paginatedReservas.map(reserva => (
                                    <tr key={reserva.id} className="border-t border-yellow-400">
                                        <td className="py-2 px-4">{userData.nombre}</td>
                                        <td className="py-2 px-4">{userData.numero_documento}</td>
                                        <td className="py-2 px-4">{userData.telefono}</td>
                                        <td className="py-2 px-4">{userData.correo}</td>
                                        <td className="py-2 px-4">{reserva.numero_personas}</td>
                                        <td className="py-2 px-4">{reserva.fecha}</td>
                                        <td className="py-2 px-4">{reserva.horainicio}</td>
                                        <td className="py-2 px-4">{reserva.horafin}</td>
                                        <td className="py-2 px-4">{reserva.estado_reserva}</td>
                                        <td className="py-2 px-4">{reserva.tipo_reserva}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="10" className="text-center py-2">No hay reservas para mostrar.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-center mt-4">
                    <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                    >
                        Anterior
                    </button>
                    <span className="px-4 py-2 text-gray-600">Página {currentPage} de {totalPages}</span>
                    <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MisReservas;
