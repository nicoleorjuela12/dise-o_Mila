import React, { useState, useEffect} from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import API_URL from '../../../config/config'; 


const GestionProductos = () => {
  const [productos, setProductos] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroNombre, setFiltroNombre] = useState('');
  const [ordenPrecio, setOrdenPrecio] = useState('asc');
  const [paginaActual, setPaginaActual] = useState(1);
  const [descripcionModal, setDescripcionModal] = useState(null);

  const productosPorPagina = 6;

  useEffect(() => {
    axios.post(`${API_URL}/usuarios/consultar-producto`)
      .then(response => {
        const productosConImagenes = response.data.map(producto => {
          if (producto.imagen) {
            const blob = new Blob([new Uint8Array(producto.imagen.data)], { type: 'image/jpeg' });
            return {
              ...producto,
              imagenUrl: URL.createObjectURL(blob)
            };
          }
          return producto;
        });
        setProductos(productosConImagenes);
      })
      .catch(error => {
        console.error('Error al obtener productos:', error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo cargar los productos.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      });
  }, []);

  const filtrarProductos = () => {
    let productosFiltrados = productos.filter(producto => {
      const porCategoria = filtroCategoria ? producto.categoria === filtroCategoria : true;
      const porNombre = producto.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
      return porCategoria && porNombre && producto.estado === 'activo'; // Excluir postres
    });

    productosFiltrados.sort((a, b) => {
      return ordenPrecio === 'asc' ? a.precio - b.precio : b.precio - a.precio;
    });

    return productosFiltrados;
  };

  const handleEliminarProducto = (id_producto) => {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción eliminará el producto.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            axios.delete(`${API_URL}/usuarios/productos/${id_producto}`)
                .then(() => {
                    // Filtrar los productos para eliminar el que se ha eliminado
                    setProductos(productos.filter(producto => producto.id_producto !== id_producto));
                    Swal.fire('Eliminado!', 'El producto ha sido eliminado.', 'success');
                })
                .catch(error => {
                    console.error('Error al eliminar el producto:', error);
                    Swal.fire('Error', 'No se pudo eliminar el producto.', 'error');
                });
        }
    });
  };



  const productosFiltrados = filtrarProductos();
  const productosPaginados = productosFiltrados.slice((paginaActual - 1) * productosPorPagina, paginaActual * productosPorPagina);

  const mostrarDescripcionModal = (descripcion) => setDescripcionModal(descripcion);
  const cerrarDescripcionModal = () => setDescripcionModal(null);

  const TarjetaProducto = ({ producto }) => (
    <div className="rounded overflow-hidden shadow-lg flex flex-col transform hover:scale-105 transition duration-300 ease-in-out mt-12">
    <div className="relative">
      <img className="w-full h-48 object-cover rounded-t" src={producto.imagen} alt={producto.nombre} /> {/* Altura reducida y borde redondeado */}
      <div className="absolute inset-0 bg-gray-900 opacity-25 hover:bg-transparent transition duration-300"></div>
      <p className="text-xs absolute top-0 right-0 bg-yellow-500 px-4 py-2 text-black mt-3 mr-3 hover:text-yellow-500 transition duration-500 ease-in-out no-underline">
        {producto.categoria}
      </p>
    </div>
    <div className="px-6 py-4 flex-1">
      <p className="font-medium text-lg inline-block text-gray-900 ease-in-out mb-2 no-underline">
        {producto.nombre}
      </p>
      <p className="text-gray-500 text-sm mb-2 cursor-pointer" onClick={() => mostrarDescripcionModal(producto.descripcion)}>
        {producto.descripcion.length > 50 ? `${producto.descripcion.slice(0, 50)}...` : producto.descripcion}
      </p>
      <p className="text-gray-900 font-semibold text-lg">
        $ {producto.precio.toLocaleString('es-CO')} pesos
      </p>
      <input type="hidden" value={producto.id_producto} /> {/* Campo no visible para id_producto */}
    </div>
      <div className="px-6 py-3 flex items-center justify-between bg-gray-100 rounded-b"> {/* Borde redondeado en la parte inferior */}
      <button
        onClick={() => handleEliminarProducto(producto.id_producto)}
        className="flex items-center bg-yellow-500 hover:bg-red-400 px-4 py-2 rounded transition duration-500 ease-in-out"
      >
        <FontAwesomeIcon icon={faTrash} className="mr-2 text-white-500" /> {/* Icono dorado */}
        <span className="text-black">Eliminar</span> {/* Texto en negro */}
      </button>

      <Link to={`/EditarProductos/${producto.id_producto}`} // Navegar al formulario de editar con el ID del producto
        className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded transition duration-500 ease-in-out no-underline"
      >
        <FontAwesomeIcon icon={faEdit} className="mr-2 text-white" />
        Editar
      </Link>
    </div>
  </div>
  
  );

  return (
    <div className="max-w-screen-xl mx-auto p-5 sm:p-10 md:p-16">
      <div className="border-b mb-5 flex justify-between text-sm">
        <div className="text-black flex items-center pb-2 pr-2 border-b-2 border-black uppercase">
          <span className="font-semibold inline-block">Filtrar por categoría</span>
        </div>
        <select
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
          className="text-black hover:underline"
        >
          <option value="">Todas</option>
          <option value="entradas">Entradas</option>
          <option value="cocteles">Cocteles</option>
          <option value="plato fuerte">Plato Fuerte</option>
          <option value="bebidas calientes">Bebidas Calientes</option>
          <option value="bebidas frías">Bebidas Frías</option>
          <option value="postres">Postres</option>
        </select>
      </div>

      <div className="mb-5 flex justify-between items-center space-x-4">
        <input
          type="text"
          value={filtroNombre}
          onChange={(e) => setFiltroNombre(e.target.value)}
          placeholder="Buscar por nombre"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button
          onClick={() => setOrdenPrecio(ordenPrecio === 'asc' ? 'desc' : 'asc')}
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded transition duration-500 ease-in-out"
        >
          Ordenar por precio: {ordenPrecio === 'asc' ? 'Menor a Mayor' : 'Mayor a Menor'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {productosPaginados.map(producto => (
          <TarjetaProducto key={producto.id} producto={producto} />
        ))}
        {productosPaginados.length === 0 && (
          <p className="col-span-full text-center text-gray-500 text-lg">No se encontraron productos</p>
        )}
      </div>

      <div className="flex justify-center mt-5 space-x-2">
        {Array.from({ length: Math.ceil(productosFiltrados.length / productosPorPagina) }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setPaginaActual(i + 1)}
            className={`px-3 py-1 rounded ${paginaActual === i + 1 ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700'} hover:bg-yellow-500 hover:text-white`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Modal para descripción */}
      {descripcionModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md">
            <h2 className="text-lg font-semibold">Descripción</h2>
            <p>{descripcionModal}</p>
            <button onClick={cerrarDescripcionModal} className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded">Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionProductos;
