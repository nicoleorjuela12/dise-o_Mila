import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import BarraCliente from '../../barras/BarraCliente';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faIdCard, faPhone, faEnvelope, faCreditCard, faDollarSign } from '@fortawesome/free-solid-svg-icons';

const FormularioInscripcion = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    numero_documento: "",
    telefono: "",
    correo: "",
    metodo_pago: "",
    total: ""
  });

  const navigate = useNavigate();
  const id_usuario = localStorage.getItem("id_usuario");
  const id_evento = localStorage.getItem("id_evento");

  // Obtener los datos del evento
  useEffect(() => {
    const fetchEventData = async () => {
      if (!id_evento) {
        Swal.fire("Error", "ID del evento no encontrado", "error");
        navigate("/FormularioInscripcion"); // Cambia a la ruta deseada
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8000/usuarios/evento/${id_evento}`);
        const eventData = response.data;

        if (!eventData || !eventData.precio_por_persona) {
          throw new Error("Datos del evento no válidos");
        }

        setFormData((prevFormData) => ({
          ...prevFormData,
          total: eventData.precio_por_persona || "",
        }));
      } catch (error) {
        console.error("Error al obtener los datos del evento", error);
        Swal.fire("Error", error.message || "No se pudo cargar los datos del evento", "error");
      }
    };

    fetchEventData();
  }, [id_evento, navigate]);

  // Obtener los datos del usuario
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/usuarios/${id_usuario}`);
        const userData = response.data;

        setFormData((prevFormData) => ({
          ...prevFormData,
          nombre: userData.nombre || "",
          telefono: userData.telefono || "",
          correo: userData.correo || "",
          numero_documento: userData.numero_documento || "",
        }));
      } catch (error) {
        console.error("Error al obtener los datos del usuario", error);
        Swal.fire("Error", "No se pudo cargar los datos del usuario", "error");
      }
    };

    fetchUserData();
  }, [id_usuario]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.nombre ||
      !formData.correo ||
      !formData.metodo_pago||
      !formData.total ||
      !formData.numero_documento ||
      !formData.telefono
    ) {
      return Swal.fire("Error", "Por favor, completa todos los campos.", "error");
    }

    try {
      // Enviar los datos de inscripción al backend
      const response = await axios.post(`http://localhost:8000/usuarios/InscripcionEvento`, {
        id_evento,
        id_usuario,
        nombre: formData.nombre,
        numero_documento: formData.numero_documento,
        telefono: formData.telefono,
        correo: formData.correo,
        metodo_pago: formData.metodo_pago,
        total: formData.total,
      });

      // Usar el response para mostrar el ID de la inscripción u otros detalles
      Swal.fire({
        title: "¡Éxito!",
        text: `Inscripción creada correctamente`,
        icon: "success",
        background: '#fff5e1', // Fondo claro
        color: '#d4af37', // Color dorado del texto
        confirmButtonColor: '#d4af37', // Color dorado del botón
        confirmButtonText: 'Aceptar',
        iconColor: '#d4af37', // Color dorado del icono
        customClass: {
          popup: 'rounded-lg', // Bordes redondeados
          title: 'text-xl font-semibold', // Estilo para el título
          content: 'text-md', // Estilo para el contenido
          confirmButton: 'px-6 py-3 font-semibold border-none rounded-lg' // Estilo para el botón de confirmación
        }
      });
      
      navigate("/EventosCliente"); // Redirigir al usuario a la página de eventos
    } catch (error) {
      console.error("Error al inscribirse:", error.response ? error.response.data : error.message);
      Swal.fire({
        title: "Error",
        text: "Ya te encuentras inscrito a este evento",
        icon: "error",
        background: '#fff5e1', // Fondo claro
        color: '#d4af37', // Color dorado del texto
        iconColor: '#d4af37', // Color dorado del icono
        timer: 5000, // Tiempo de cierre automático (5 segundos)
        timerProgressBar: true, // Activa la barra de progreso
        showConfirmButton: false, // Elimina el botón de confirmación
        customClass: {
          popup: 'rounded-lg', // Bordes redondeados
          title: 'text-xl font-semibold', // Estilo para el título
          content: 'text-md', // Estilo para el contenido
          timerProgressBar: 'bg-yellow-200' // Barra de progreso con dorado claro
        }
      });
            
    }
  };
  return (
    <div>
      <div className="max-w-screen-md mx-auto p-5 sm:p-10 md:p-16">
        <BarraCliente />
        <h1 className="text-4xl font-bold text-center mb-6 text-black">Inscripción al Evento</h1>
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg">
        <div className="mb-4">
          <label
            htmlFor="nombre"
            className="block text-black text-lg font-semibold mb-2 flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faUser} className="text-[#D2B48C]" />
            Nombre
          </label>
          <input
            type="text"
            id="nombre"
            value={formData.nombre}
            onChange={(e) => setFormData((prev) => ({ ...prev, nombre: e.target.value }))}
            className="text-center block appearance-none w-full bg-[#F5E1A4] border border-[#D2B48C] text-gray-800 py-3 px-4 rounded leading-tight shadow-md hover:shadow-lg focus:outline-none focus:bg-white focus:border-[#D2B48C]"
            required
            readOnly
          />
        </div>

        <div className="mb-4">
        <label
          htmlFor="numero_documento"
          className="block text-black text-lg font-semibold mb-2 flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faIdCard} className="text-[#D2B48C]" />
          Número de Documento
        </label>
        <input
          name="numero_documento"
          type="text"
          value={formData.numero_documento}
          onChange={(e) => setFormData((prev) => ({ ...prev, numero_documento: e.target.value }))}
          className="text-center block appearance-none w-full bg-[#F5E1A4] border border-[#D2B48C] text-gray-800 py-3 px-4 pr-8 rounded leading-tight shadow-md hover:shadow-lg focus:outline-none focus:bg-white focus:border-[#D2B48C]"
          required
          readOnly
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="telefono"
          className="block text-black text-lg font-semibold mb-2 flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faPhone} className="text-[#D2B48C]" />
          Número de Teléfono
        </label>
        <input
          name="telefono"
          type="text"
          value={formData.telefono}
          onChange={(e) => setFormData((prev) => ({ ...prev, telefono: e.target.value }))}
          className="text-center block appearance-none w-full bg-[#F5E1A4] border border-[#D2B48C] text-gray-800 py-3 px-4 pr-8 rounded leading-tight shadow-md hover:shadow-lg focus:outline-none focus:bg-white focus:border-[#D2B48C]"
          required
          readOnly
        />
      </div>


      <div className="mb-4">
  <label
    htmlFor="correo"
    className="block text-black text-lg font-semibold mb-2 flex items-center gap-2"
  >
    <FontAwesomeIcon icon={faEnvelope} className="text-[#D2B48C]" />
    Email
  </label>
  <input
    type="email"
    id="correo"
    value={formData.correo}
    onChange={(e) => setFormData((prev) => ({ ...prev, correo: e.target.value }))}
    className="text-center block appearance-none w-full bg-[#F5E1A4] border border-[#D2B48C] text-gray-800 py-3 px-4 pr-8 rounded leading-tight shadow-md hover:shadow-lg focus:outline-none focus:bg-white focus:border-[#D2B48C]"
    readOnly
    required
  />
</div>

<div className="mb-4">
  <label
    htmlFor="metodo_pago"
    className="block text-black text-lg font-semibold mb-2 flex items-center gap-2"
  >
    <FontAwesomeIcon icon={faCreditCard} className="text-[#D2B48C]" />
    Método de Pago
  </label>
  <select
    id="metodo_pago"
    value={formData.metodo_pago}
    onChange={(e) => setFormData((prev) => ({ ...prev, metodo_pago: e.target.value }))}
    className="w-full p-3 border border-[#D2B48C] rounded shadow-md focus:outline-none focus:bg-white focus:border-[#D2B48C]"
    required
  >
    <option value="">Seleccione un método de pago</option>
    <option value="tarjeta">Tarjeta de Crédito/Débito</option>
    <option value="paypal">PayPal</option>
    <option value="transferencia">Transferencia Bancaria</option>
  </select>
</div>


<div className="mb-4">
  <label
    htmlFor="total"
    className="block text-black text-lg font-semibold mb-2 flex items-center gap-2"
  >
    <FontAwesomeIcon icon={faDollarSign} className="text-[#D2B48C]" />
    Total
  </label>
  <input
    type="number"
    id="total"
    value={formData.total}
    onChange={(e) => setFormData((prev) => ({ ...prev, total: e.target.value }))}
    className="text-center block appearance-none w-full bg-[#F5E1A4] border border-[#D2B48C] text-gray-800 py-3 px-4 pr-8 rounded leading-tight shadow-md hover:shadow-lg focus:outline-none focus:bg-white focus:border-[#D2B48C]"
    required
    readOnly
  />
</div>




          <button
            type="submit"
            className="w-full bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-300 transition duration-500 ease-in-out"
          >
            Inscribirse
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormularioInscripcion;
