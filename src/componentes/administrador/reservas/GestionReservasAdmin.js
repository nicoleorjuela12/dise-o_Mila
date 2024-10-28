import React, { useState, useEffect } from 'react';
import Axios from 'axios';

const MisReservas = () => {
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredReservas, setFilteredReservas] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 30;

    // Filtros de búsqueda
    const [filters, setFilters] = useState({
        numero_documento: '',
        fecha: '',
        horainicio: '',
        numero_personas: '',
        tipo_reserva: ''
    });

        // Calcular el primer y último día del año actual
    const currentYear = new Date().getFullYear();
    const minDate = `${currentYear}-01-01`;
    const maxDate = `${currentYear}-12-31`;

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obtener todas las reservas de la tabla reservas
                const responseReservas = await Axios.get('http://localhost:8000/usuarios/reservas');
                const responseReservaLocal = await Axios.get('http://localhost:8000/usuarios/reservalocal');

                // Combinar ambas listas de reservas
                const todasReservas = [...responseReservas.data, ...responseReservaLocal.data];

                // Obtener los datos de usuario para cada reserva
                const usuariosData = await Promise.all(
                    todasReservas.map(async (reserva) => {
                        const responseUsuario = await Axios.get(`http://localhost:8000/usuarios/${reserva.id_usuario}`);
                        return { ...reserva, ...responseUsuario.data };
                    })
                );

                setReservas(usuariosData);
                setFilteredReservas(usuariosData); // Inicialmente, todas las reservas están filtradas
            } catch (error) {
                setError("Error al recuperar reservas: " + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const applyFilters = () => {
        const { numero_documento, fecha, horaInicio, numeroPersonas, tipo_reserva } = filters;
    
        const filtered = reservas.filter(reserva => {
            return (
                // Convertimos ambos valores a string y aplicamos includes en la comparación
                (numero_documento ? String(reserva.numero_documento).includes(numero_documento) : true) &&
                (fecha ? reserva.fecha === fecha : true) &&
                (horaInicio ? reserva.horainicio === horaInicio : true) &&
                (numeroPersonas ? reserva.numero_personas === Number(numeroPersonas) : true) &&
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

    const totalPages = Math.ceil(filteredReservas.length / itemsPerPage);

    if (loading) return <p>Cargando datos...</p>;
    if (error) return <p>Hubo un error: {error}</p>;

    return (
        <div>
            <div className="w-full bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Reserva Mesa</h2>
                <p className="text-gray-600 mb-6">Visualiza las reservas realizadas</p>
                <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    <input type="text" name="numero_documento" placeholder="Filtrar por numero de documento" 
                    onChange={handleFilterChange} 
                    className="px-4 py-2 border border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                    
                    <input 
                        type="date" 
                        name="fecha" 
                        placeholder="Filtrar por fecha" 
                        onChange={handleFilterChange} 
                        className="px-4 py-2 border border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500" 
                        min={minDate} 
                        max={maxDate} 
                    />
                    <input type="time" 
                    name="horainicio" 
                    placeholder="Filtrar por hora de inicio" 
                    onChange={handleFilterChange} className="px-4 py-2 border border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                    
                    <input type="number" name="numero_personas" placeholder="Filtrar por número de personas" 
                    onChange={handleFilterChange} 
                    className="px-4 py-2 border border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                    
                    <select name="tipo_reserva" onChange={handleFilterChange} className="px-4 py-2 border border-yellow-400 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500">
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
                                <th className="py-2 px-4 border-b border-yellow-400">ID Usuario</th>
                                
                                <th className="py-2 px-4 border-b border-yellow-400">Nombre</th>
                                
                                <th className="py-2 px-4 border-b border-yellow-400">Número de Documento</th>
                                
                                <th className="py-2 px-4 border-b border-yellow-400">Teléfono</th>
                                
                                <th className="py-2 px-4 border-b border-yellow-400">Correo</th>
                                
                                <th className="py-2 px-4 border-b border-yellow-400">Número de Personas</th>
                                
                                <th className="py-2 px-4 border-b border-yellow-400"
                                min={new Date().toISOString().split('T')[0]}  // No permitir fechas pasadas
                                max={`${new Date().getFullYear()}-12-31`}>Fecha</th>
                                
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
                                        <td className="py-2 px-4">{reserva.id_usuario}</td>
                                        <td className="py-2 px-4">{reserva.nombre}</td>
                                        <td className="py-2 px-4">{reserva.numero_documento}</td>
                                        <td className="py-2 px-4">{reserva.telefono}</td>
                                        <td className="py-2 px-4">{reserva.correo}</td>
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
                                    <td colSpan="11" className="text-center py-2">No hay reservas para mostrar.</td>
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
