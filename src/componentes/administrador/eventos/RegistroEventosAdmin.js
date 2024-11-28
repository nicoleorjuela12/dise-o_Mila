import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faList, faClock, faMapMarkerAlt, faUsers, faDollarSign} from "@fortawesome/free-solid-svg-icons";
import BarraAdmin from "../../barras/BarraAdministrador";
import Swal from "sweetalert2";

function RegistroEventos() {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    categoria: "",
    horainicio: "",
    horafin: "",
    fechaEvento: "",
    ubicacion: "",
    capacidad: "",
    precio_por_persona: "",
    imagenevento: "",
    fecha_limite_incsripcion: "",
    estado: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const isValidURL = (url) => {
    const regex = /^(https?:\/\/)?([\w\d-]+\.)+[\w\d]{2,}(\/[\w\d\-._~:/?#[\]@!$&'()*+,;=]*)?(\.(jpg|jpeg|png|gif|bmp|webp))$/i;
    return regex.test(url);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormData((prevState) => ({
      ...prevState,
      fechaRegistro: new Date().toISOString(),
    }));

    if (!isValidURL(formData.imagenevento)) {
      Swal.fire("Error", "El enlace de la imagen no es válido", "error");
      return;
    }

    if (formData.descripcion.length > 300) {
      Swal.fire("Error", "La descripción no puede exceder los 300 caracteres", "error");
      return;
    }

    Swal.fire({
      title: "Error",
      text: "El nombre solo puede contener letras y no exceder los 70 caracteres",
      icon: "error",
      iconColor: "#FFD700", // Dorado brillante para el ícono
      background: "rgba(244, 244, 244, 0.9)", // Fondo gris claro semitransparente
      color: "#333333",
      timer: 5000,
      timerProgressBar: true,
      showConfirmButton: false,
      customClass: {
        popup: "rounded-lg border-2 border-yellow-300 shadow-md animate__animated animate__fadeInDown", // Animación de entrada
        title: "text-lg font-semibold text-yellow-700",
        timerProgressBar: "bg-yellow-400" // Barra de progreso dorada
      }
    });
    

    if (isNaN(formData.capacidad) || formData.capacidad < 12 || formData.capacidad > 50) {
      Swal.fire("Error", "La cantidad de cupos debe ser mayor a 12 y menor a 50", "error");
      return;
    }

    if (isNaN(formData.precio_por_persona) || formData.precio_por_persona <= 15000 || formData.precio_por_persona > 200000) {
      Swal.fire("Error", "El precio por persona debe estar dentro de los parámetros establecidos (15.000 y 200.000)", "error");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/usuarios/evento", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        Swal.fire("Éxito", "Evento registrado exitosamente", "success");
        setFormData({
          nombre: "",
          descripcion: "",
          categoria: "",
          horainicio: "",
          horafin: "",
          fechaEvento: "",
          ubicacion: "",
          capacidad: "",
          precio_por_persona: "",
          imagenevento: "",
          fecha_limite_incsripcion: "",
          estado: "Pendiente",
        });
      } else {
        Swal.fire("Error", "Ocurrió un error al registrar el evento", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Error en la conexión con el servidor", "error");
    }
  };

  return (
    <div className="min-w-screen min-h-screen bg-gray-100 flex flex-col justify-between">
  <BarraAdmin />
  <div className="bg-white text-gray-700 -mt-8 border-2 border-yellow-400 rounded-3xl shadow-xl w-full max-w-7xl mx-auto overflow-hidden my-6">
    <div className="md:flex w-full">
      {/* Contenedor para la imagen */}
      <div className="w-full md:w-1/2 h-64 py-6 px-6 flex justify-center items-center mt-48">
        {formData.imagenevento ? (
          <img
            src={formData.imagenevento}
            alt="Evento"
            className="w-full h-auto object-cover"
          />
        ) : (
          <p className="text-center text-gray-900 text-2xl">Previsualización de imagen</p>
        )}
      </div>

      {/* Formulario */}
      <div className="w-full md:w-1/2 py-6 px-4 md:px-6 shadow-lg">
        <div className="text-center mb-6">
          <h1 className="font-bold text-2xl text-yellow-600">Eventos</h1>
          <p className="mt-1 text-gray-600">Registra un nuevo evento para que sea un éxito</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap -mx-3 mb-4">
            {/* Primer par de campos */}
            <div className="w-full md:w-1/2 px-3 mb-4 relative">
              <label htmlFor="nombre" className="text-gray-900 font-semibold px-1">
                Nombre
              </label>
              <div className="relative">
                <FontAwesomeIcon icon={faCalendar} className="absolute left-3 top-3 text-yellow-500" />
                <input
                  type="text"
                  name="nombre"
                  id="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 rounded-lg border-2 border-yellow-400 outline-none focus:border-yellow-600"
                  placeholder="Ej. Cumpleaños mila"
                  maxLength="70"
                />
              </div>
            </div>

            <div className="w-full md:w-1/2 px-3 mb-4 relative">
              <label htmlFor="fechaEvento" className="text-gray-900 font-semibold px-1">
                Fecha Evento
              </label>
              <div className="relative">
                <FontAwesomeIcon icon={faCalendar} className="absolute left-3 top-3 text-yellow-500" />
                <input
                  type="date"
                  name="fechaEvento"
                  id="fechaEvento"
                  value={formData.fechaEvento}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 pr-3 py-2 rounded-lg border-2 border-yellow-400 outline-none focus:border-yellow-600"
                />
              </div>
            </div>

            {/* Segundo par de campos */}
            <div className="w-full md:w-1/2 px-3 mb-4 relative">
              <label htmlFor="horainicio" className="text-gray-900 font-semibold px-1">
                Hora Inicio
              </label>
              <div className="relative">
                <FontAwesomeIcon icon={faClock} className="absolute left-3 top-3 text-yellow-500" />
                <input
                  type="time"
                  name="horainicio"
                  id="horainicio"
                  value={formData.horainicio}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 rounded-lg border-2 border-yellow-400 outline-none focus:border-yellow-600"
                />
              </div>
            </div>

            <div className="w-full md:w-1/2 px-3 mb-4 relative">
              <label htmlFor="horafin" className="text-gray-900 font-semibold px-1">
                Hora Fin
              </label>
              <div className="relative">
                <FontAwesomeIcon icon={faClock} className="absolute left-3 top-3 text-yellow-500" />
                <input
                  type="time"
                  name="horafin"
                  id="horafin"
                  value={formData.horafin}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 rounded-lg border-2 border-yellow-400 outline-none focus:border-yellow-600"
                />
              </div>
            </div>

            {/* Tercer par de campos */}
            <div className="w-full md:w-1/2 px-3 mb-4 relative">
              <label htmlFor="ubicacion" className="text-gray-900 font-semibold px-1">
                Ubicación
              </label>
              <div className="relative">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="absolute left-3 top-3 text-yellow-500" />
                <input
                  type="text"
                  name="ubicacion"
                  id="ubicacion"
                  value={formData.ubicacion}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 rounded-lg border-2 border-yellow-400 outline-none focus:border-yellow-600"
                  placeholder="Dirección del evento"
                />
              </div>
            </div>

            <div className="w-full md:w-1/2 px-3 mb-4 relative">
              <label htmlFor="capacidad" className="text-gray-900 font-semibold px-1">
                Capacidad
              </label>
              <div className="relative">
                <FontAwesomeIcon icon={faUsers} className="absolute left-3 top-3 text-yellow-500" />
                <input
                  type="number"
                  name="capacidad"
                  id="capacidad"
                  value={formData.capacidad}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 rounded-lg border-2 border-yellow-400 outline-none focus:border-yellow-600"
                  placeholder="Cantidad de personas"
                />
              </div>
            </div>

            {/* Cuarto par de campos */}
            <div className="w-full md:w-1/2 px-3 mb-4 relative">
              <label htmlFor="precio_por_persona" className="text-gray-900 font-semibold px-1">
                Precio por Persona
              </label>
              <div className="relative">
                <FontAwesomeIcon icon={faDollarSign} className="absolute left-3 top-3 text-yellow-500" />
                <input
                  type="number"
                  name="precio_por_persona"
                  id="precio_por_persona"
                  value={formData.precio_por_persona}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 rounded-lg border-2 border-yellow-400 outline-none focus:border-yellow-600"
                  placeholder="Precio por persona"
                />
              </div>
            </div>

            <div className="w-full md:w-1/2 px-3 mb-4 relative">
              <label htmlFor="categoria" className="text-gray-900 font-semibold px-1">
                Categoría
              </label>
              <div className="relative">
                <FontAwesomeIcon icon={faList} className="absolute left-3 top-3 text-yellow-500" />
                <select
                  name="categoria"
                  id="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 rounded-lg border-2 border-yellow-400 outline-none focus:border-yellow-600"
                >
                  <option value="">Seleccione una categoría</option>
                  <option value="charlas">Charlas</option>
                  <option value="Teatro">Teatro</option>
                  <option value="Deportes">Deportes</option>
                  <option value="Culturales">Culturales</option>
                  <option value="Infantiles">Infantiles</option>
                </select>
              </div>
            </div>

            {/* Fecha Limite Inscripción */}
            <div className="w-full md:w-1/2 px-3 mb-4 relative">
              <label htmlFor="fecha_limite_inscripcion" className="text-gray-900 font-semibold px-1">
                Fecha Límite Inscripción
              </label>
              <div className="relative">
                <FontAwesomeIcon icon={faCalendar} className="absolute left-3 top-3 text-yellow-500" />
                <input
                  type="date"
                  name="fecha_limite_inscripcion"
                  id="fecha_limite_inscripcion"
                  value={formData.fecha_limite_inscripcion}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 pr-3 py-2 rounded-lg border-2 border-yellow-400 outline-none focus:border-yellow-600"
                />
              </div>
            </div>

            {/* Estado del Evento */}
            <div className="w-full md:w-1/2 px-3 mb-4 relative">
              <label htmlFor="estado" className="text-gray-900 font-semibold px-1">
                Estado
              </label>
              <div className="relative">
                <FontAwesomeIcon icon={faList} className="absolute left-3 top-3 text-yellow-500" />
                <select
                  name="estado"
                  id="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 rounded-lg border-2 border-yellow-400 outline-none focus:border-yellow-600"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Confirmado">Confirmado</option>
                </select>
              </div>
            </div>

            {/* Descripción */}
            <div className="w-full px-3 mb-4 relative">
              <label htmlFor="descripcion" className="text-gray-900 font-semibold px-1">
                Descripción
              </label>
              <textarea
                name="descripcion"
                id="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                className="w-full h-32 pl-3 py-2 rounded-lg border-2 border-yellow-400 outline-none focus:border-yellow-600"
                placeholder="Descripción del evento"
                maxLength="300"
              />
              <p className="text-gray-600 mt-1 text-sm">Máximo 300 caracteres</p>
            </div>

            {/* Imagen Evento */}
            <div className="w-full px-3 mb-4 relative">
              <label htmlFor="imagenevento" className="text-gray-900 font-semibold px-1">
                Imagen del Evento
              </label>
              <input
                type="text"
                name="imagenevento"
                id="imagenevento"
                value={formData.imagenevento}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 rounded-lg border-2 border-yellow-400 outline-none focus:border-yellow-600"
                placeholder="URL de la imagen"
              />
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="bg-yellow-500 text-black px-6 py-2 rounded-lg shadow-lg hover:bg-yellow-600 transition duration-300"
            >
              Registrar Evento
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>

    
  );
}

export default RegistroEventos;
