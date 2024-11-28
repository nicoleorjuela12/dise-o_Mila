import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MisInscripciones = () => {
    const [inscripciones, setInscripciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const id_usuario = localStorage.getItem('id_usuario');
    const itemsPerPage = 30;

    useEffect(() => {
        const fetchInscripciones = async () => {
            try {
                // Obtención de las inscripciones del usuario
                const response = await axios.get('http://localhost:8000/usuarios/InscripcionEvento');
                const inscripcionesUsuario = response.data.filter(inscripcion => inscripcion.id_usuario === parseInt(id_usuario));
                
                // Obtenemos los detalles de cada evento asociado a la inscripción
                const eventosPromises = inscripcionesUsuario.map(async (inscripcion) => {
                    const eventoResponse = await axios.get(`http://localhost:8000/usuarios/evento/${inscripcion.id_evento}`);
                    return { ...inscripcion, Evento: eventoResponse.data };
                });

                // Esperamos a que todos los eventos sean obtenidos
                const inscripcionesConEventos = await Promise.all(eventosPromises);
                setInscripciones(inscripcionesConEventos);
            } catch (error) {
                setError("Error al recuperar inscripciones: " + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchInscripciones();
    }, [id_usuario]);

    const paginatedInscripciones = inscripciones.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(inscripciones.length / itemsPerPage);

    if (loading) return <p>Cargando datos...</p>;
    if (error) return <p>Hubo un error: {error}</p>;

    return (
        <div>
            <div className="w-full bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Mis Inscripciones a Eventos</h2>
                <p className="text-gray-600 mb-6">Visualiza los eventos a los que te has inscrito</p>
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-200 text-left text-sm text-gray-600">
                                <th className="py-2 px-4 border-b border-yellow-400">Nombre del Evento</th>
                                <th className="py-2 px-4 border-b border-yellow-400">Fecha de Inscripción</th>
                                <th className="py-2 px-4 border-b border-yellow-400">Método de Pago</th>
                                <th className="py-2 px-4 border-b border-yellow-400">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedInscripciones.length > 0 ? paginatedInscripciones.map(inscripcion => (
                                <tr key={inscripcion.id_inscripcion} className="border-t border-yellow-400">
                                    <td className="py-2 px-4">{inscripcion.Evento ? inscripcion.Evento.nombre : 'No disponible'}</td>
                                    <td className="py-2 px-4">{new Date(inscripcion.fecha_inscripcion).toLocaleDateString()}</td>
                                    <td className="py-2 px-4">{inscripcion.metodo_pago}</td>
                                    <td className="py-2 px-4">${inscripcion.total}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-2">No tienes inscripciones a eventos.</td>
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

export default MisInscripciones;
