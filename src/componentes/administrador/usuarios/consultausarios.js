import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BarraAdmin from "../../barras/BarraAdministrador";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faFilter, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { faUser, faUserShield, faClipboard, faClock } from '@fortawesome/free-solid-svg-icons';

const ConsultaUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rolFiltro, setRolFiltro] = useState('');
  const [nombreFiltro, setNombreFiltro] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usuariosPorPagina] = useState(6);
  const [usuarioEdit, setUsuarioEdit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get('http://localhost:8000/usuarios/consultarempleados');
      const usuariosFiltrados = response.data.filter(usuario =>
        (usuario.rol === 'administrador' || usuario.rol === 'mesero') && usuario.estado === 'Activo'
      );
      setUsuarios(usuariosFiltrados);
    } catch (error) {
      console.error('Error fetching usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id_usuario) => {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "Una vez eliminado, no podrás recuperar este usuario!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar!',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        await axios.delete(`http://localhost:8000/usuarios/empleados/${id_usuario}`);
        fetchUsuarios();
        Swal.fire('Eliminado!', 'El usuario ha sido eliminado.', 'success');
      }
    } catch (error) {
      console.error('Error deleting usuario:', error);
    }
  };

  const handleEditar = (usuario) => {
    setUsuarioEdit(usuario);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setUsuarioEdit(null);
  };

  const handleGuardarCambios = async () => {
    try {
      // Verifica que todos los campos están completos en usuarioEdit antes de enviar
      if (usuarioEdit) {
  
        // Envia el usuario completo
        await axios.put(`http://localhost:8000/usuarios/empleados/${usuarioEdit.id_usuario}`, {
          rol: usuarioEdit.rol,
          titulo: usuarioEdit.titulo,
          turno: usuarioEdit.turno,
        });
  
        fetchUsuarios();
        Swal.fire('Actualizado!', 'La información del usuario ha sido actualizada.', 'success');
        handleModalClose();
      }
    } catch (error) {
      console.error('Error updating usuario:', error);
      Swal.fire('Error', 'Hubo un problema al actualizar el usuario.', 'error');
    }
  };
  

  if (loading) return <p>Cargando...</p>;

  const filteredUsuarios = usuarios.filter(usuario => {
    const matchesRol = rolFiltro ? usuario.rol === rolFiltro : true;
    const matchesNombre = nombreFiltro ? (usuario.nombre || '').toLowerCase().includes(nombreFiltro.toLowerCase()) : true;
    return matchesRol && matchesNombre;
  });

  const indexOfLastUsuario = currentPage * usuariosPorPagina;
  const indexOfFirstUsuario = indexOfLastUsuario - usuariosPorPagina;
  const currentUsuarios = filteredUsuarios.slice(indexOfFirstUsuario, indexOfLastUsuario);
  const totalPages = Math.ceil(filteredUsuarios.length / usuariosPorPagina);

  return (
    <div className="min-h-screen">
      <BarraAdmin />
      <div className="p-6">
        <h1 className="text-2xl font-bold text-center mb-4 text-black -mt-12">Lista de Registros</h1>

        <div className="mb-4 flex items-center">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-yellow-500 text-white px-4 py-2 rounded flex items-center"
          >
            <FontAwesomeIcon icon={faFilter} className="mr-2" /> Filtros
            <FontAwesomeIcon icon={faAngleDown} className={`ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {showFilters && (
          <div className="mb-4 flex items-center">
            <input
              type="text"
              placeholder="Filtrar por nombre"
              value={nombreFiltro}
              onChange={(e) => setNombreFiltro(e.target.value)}
              className="border border-gray-300 px-4 py-2 rounded-lg mr-4"
            />
            <select
              value={rolFiltro}
              onChange={(e) => setRolFiltro(e.target.value)}
              className="border border-gray-300 px-4 py-2 rounded-lg"
            >
              <option value="">Todos los roles</option>
              <option value="administrador">Administrador</option>
              <option value="mesero">Mesero</option>
            </select>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-yellow-400">
            <thead>
              <tr className="bg-gray-200 text-left text-sm text-gray-600">
                <th className="py-2 px-4 border-b border-yellow-400">Nombre</th>
                <th className="py-2 px-4 border-b border-yellow-400">Apellido</th>
                <th className="py-2 px-4 border-b border-yellow-400">Teléfono</th>
                <th className="py-2 px-4 border-b border-yellow-400">Número de Documento</th>
                <th className="py-2 px-4 border-b border-yellow-400">Rol</th>
                <th className="py-2 px-4 border-b border-yellow-400">Título</th>
                <th className="py-2 px-4 border-b border-yellow-400">Turno</th>
                <th className="py-2 px-4 border-b border-yellow-400">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentUsuarios.length > 0 ? (
                currentUsuarios.map((usuario) => (
                  <tr key={usuario.id_usuario} className="border-t border-yellow-400">
                    <td className="py-2 px-4">{usuario.nombre}</td>
                    <td className="py-2 px-4">{usuario.apellido}</td>
                    <td className="py-2 px-4">{usuario.telefono}</td>
                    <td className="py-2 px-4">{usuario.numero_documento}</td>
                    <td className="py-2 px-4">{usuario.rol}</td>
                    <td className="py-2 px-4">{usuario.titulo}</td>
                    <td className="py-2 px-4">{usuario.turno}</td>
                    <td className="py-2 px-4 flex justify-center items-center space-x-2">
                      {usuario.estado === 'Activo' && (
                        <>
                          <button 
                            className="bg-yellow-500 text-white px-2 py-1 rounded shadow-md hover:bg-yellow-600 flex items-center"
                            onClick={() => handleEliminar(usuario.id_usuario)}
                          >
                            <FontAwesomeIcon icon={faTrash} className="mr-1" /> Eliminar
                          </button>
                          <button 
                            className="bg-yellow-500 text-white px-2 py-1 rounded shadow-md hover:bg-yellow-600 flex items-center"
                            onClick={() => handleEditar(usuario)}
                          >
                            <FontAwesomeIcon icon={faEdit} className="mr-1" /> Editar
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4">No hay usuarios disponibles.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between mt-4">
          <button 
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-yellow-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <span>Página {currentPage} de {totalPages}</span>
          <button 
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-yellow-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>

      {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-98">
            <h2 className="text-lg font-bold mb-4 ml-44">Editar Usuario</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 flex items-center">
                  <FontAwesomeIcon icon={faUser} className="mr-2 text-yellow-500" />
                  Nombre:
                </label>
                <input
                  type="text"
                  value={usuarioEdit.nombre}
                  readOnly
                  className="border border-gray-300 px-4 py-2 rounded w-full mb-4 bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block mb-2 flex items-center">
                  <FontAwesomeIcon icon={faUser} className="mr-2 text-yellow-500" />
                  Apellido:
                </label>
                <input
                  type="text"
                  value={usuarioEdit.apellido}
                  readOnly
                  className="border border-gray-300 px-4 py-2 rounded w-full mb-4 bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block mb-2 flex items-center">
                  <FontAwesomeIcon icon={faUserShield} className="mr-2 text-yellow-500" />
                  Rol:
                </label>
                <select
                  value={usuarioEdit.rol}
                  onChange={(e) => setUsuarioEdit({ ...usuarioEdit, rol: e.target.value })}
                  className="border border-gray-300 px-4 py-2 rounded w-full mb-4"
                >
                  <option value="administrador">Administrador</option>
                  <option value="mesero">Mesero</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 flex items-center">
                  <FontAwesomeIcon icon={faClipboard} className="mr-2 text-yellow-500" />
                  Título:
                </label>
                <input
                  type="text"
                  value={usuarioEdit.titulo}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^[a-zA-Z\s]*$/.test(value) && value.length <= 30) {
                      setUsuarioEdit({ ...usuarioEdit, titulo: value });
                    }
                  }}
                  className="border border-gray-300 px-4 py-2 rounded w-full mb-4"
                />
              </div>
              <div>
                <label className="block mb-2 flex items-center">
                  <FontAwesomeIcon icon={faClock} className="mr-2 text-yellow-500" />
                  Turno:
                </label>
                <input
                  type="text"
                  value={usuarioEdit.turno}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^[a-zA-Z\s]*$/.test(value) && value.length <= 30) {
                      setUsuarioEdit({ ...usuarioEdit, turno: value });
                    }
                  }}
                  className="border border-gray-300 px-4 py-2 rounded w-full mb-4"
                />
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <button onClick={handleModalClose} className="bg-yellow-500 text-black px-4 py-2 rounded flex items-center">
                <FontAwesomeIcon icon={faUser} className="mr-2" />
                Cancelar
              </button>
              <button onClick={handleGuardarCambios} className="bg-yellow-500 text-black px-4 py-2 rounded flex items-center">
                <FontAwesomeIcon icon={faClipboard} className="mr-2" />
                Guardar
              </button>
            </div>
          </div>
        </div>
        
        )}
    </div>
  );
};

export default ConsultaUsuarios;
