import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import API_URL from '../../../config/config'; 


const ReservaLocal = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    correo: '',
    numero_documento: false,
    numero_personas: '',
    fecha: '',
    horainicio: '',
    horafin: '',
    comentarios: '',
    tipo_servicios: false,
    estado_reserva: 'Pendiente',
    tipo_reserva: 'Reserva Local',
    terminos: false,
    id_usuario: '',
  });
  const [errors, setErrors] = useState({});
  const [mostrarModal, setMostrarModal] = useState(false);
  const id_usuario = localStorage.getItem('id_usuario');

  useEffect(() => {
    const fetchUserData = async () => {
      if (!id_usuario) {
        Swal.fire('Error', 'Usuario no identificado. Por favor inicie sesión.', 'error');
        return;
      }
      try {
        const response = await axios.get(`${API_URL}/usuarios/${id_usuario}`);
        const user = response.data;

        setFormData((prevFormData) => ({
          ...prevFormData,
          nombre: user.nombre || '',
          telefono: user.telefono || '',
          correo: user.correo || '',
          numero_documento: user.numero_documento || '',
          id_usuario: user.id || ''
        }));
      } catch (error) {
        console.error('Error al obtener los datos del usuario', error);
        Swal.fire('Error', 'No se pudo cargar los datos del usuario. Intente nuevamente más tarde.', 'error');
      }
    };
    fetchUserData();
  }, [id_usuario]);

  const validateForm = () => {
    const newErrors = {};
    const today = new Date();

    // Validación para el número de personas
    if (!formData.numero_personas.trim() || formData.numero_personas <= 0) {
      newErrors.numero_personas = 'El número de personas debe ser mayor a 0';
    }

    // Validación para la fecha
    if (!formData.fecha) {
      newErrors.fecha = 'La fecha es requerida.';
    } else {
      const selectedDate = new Date(formData.fecha);
      if (selectedDate.getDay() === 0) {
        newErrors.fecha = 'No se pueden hacer reservas en domingos.';
      }
      if (selectedDate < today.setHours(0, 0, 0, 0)) {
        newErrors.fecha = 'La fecha no puede ser en el pasado.';
      }
    }

    // Validación para la hora de inicio
    if (!formData.horainicio.trim()) {
      newErrors.horainicio = 'La hora de inicio es obligatoria';
    } else {
      const [inicioHours] = formData.horainicio.split(':').map(Number);
      if (inicioHours < 0 || inicioHours > 23) {
        newErrors.horainicio = 'La hora de inicio debe estar entre 00:00 y 23:59';
      }
    }

    // Validación para la hora de fin
    if (!formData.horafin.trim()) {
      newErrors.horafin = 'La hora de fin es obligatoria';
    } else {
      const [finHours] = formData.horafin.split(':').map(Number);
      if (finHours < 0 || finHours > 23) {
        newErrors.horafin = 'La hora de fin debe estar entre 00:00 y 23:59';
      }
    }

    // Comprobar que la hora de fin sea después de la hora de inicio
    if (formData.horainicio && formData.horafin) {
      const [inicioHours, inicioMinutes] = formData.horainicio.split(':').map(Number);
      const [finHours, finMinutes] = formData.horafin.split(':').map(Number);

      const selectedDate = new Date(formData.fecha);
      const inicio = new Date(selectedDate);
      inicio.setHours(inicioHours, inicioMinutes);

      const fin = new Date(selectedDate);
      fin.setHours(finHours, finMinutes);

      if (fin <= inicio) {
        newErrors.horafin = 'La hora de fin debe ser después de la hora de inicio';
      }
    }

    // Validación para el tipo de servicio
    if (!formData.tipo_servicios.trim()) {
      newErrors.tipo_servicios = 'Elige un tipo de servicio';
    }

    // Validación para términos y condiciones
    if (!formData.terminos) {
      newErrors.terminos = 'Debes aceptar los términos y condiciones';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const checkAvailability = async () => {
    try {
      const response = await axios.get(`${API_URL}/usuarios/reservalocal`);
      const reservas = response.data;
  
      const horaInicioSolicitud = new Date(formData.fecha + 'T' + formData.horainicio);
      const horafinSolicitud = new Date(formData.fecha + 'T' + formData.horafin);
  
      console.log("Hora Inicio Solicitud:", horaInicioSolicitud);
      console.log("Hora Fin Solicitud:", horafinSolicitud);
      
      const esDisponible = reservas.every((reserva) => {
        const reservaHoraInicio = new Date(reserva.fecha + 'T' + reserva.horainicio);
        const reservahorafin = new Date(reserva.fecha + 'T' + reserva.horafin);
  
        console.log("Reserva Hora Inicio:", reservaHoraInicio);
        console.log("Reserva Hora Fin:", reservahorafin);
  
        return (
          horafinSolicitud <= reservaHoraInicio || 
          horaInicioSolicitud >= reservahorafin
        );
      });
      return esDisponible;
    } catch (error) {
      console.error('Error al verificar disponibilidad', error);
      Swal.fire('Error', 'No se pudo verificar la disponibilidad', 'error');
      return false;
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const disponibilidad = await checkAvailability();
    if (!disponibilidad) {
      Swal.fire('Error', 'La fecha y hora solicitadas no están disponibles', 'error');
      return;
    }

    const reservaData = {
      ...formData,
      id_usuario: id_usuario,
    };

    console.log("Datos a enviar:", reservaData); // Agrega esta línea para depuración

    try {
      const response = await axios.post(`${API_URL}/usuarios/reservalocal`, reservaData);
      console.log("Respuesta del servidor:", response.data); // Agrega esta línea para ver la respuesta

      Swal.fire({
        title: '¡Éxito!',
        text: 'La reserva ha sido registrada correctamente',
        icon: 'success',
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
      

      setFormData({
        nombre: '',
        telefono: '',
        correo: '',
        numero_documento: '',
        numero_personas: '',
        fecha: '',
        horainicio: '',
        horafin: '',
        comentarios: '',
        tipo_servicios: '',
        estado_reserva: 'Pendiente',
        tipo_reserva: 'reserva_local',
        terminos: false,
        id_usuario: id_usuario,
      });

    } catch (error) {
        console.error('Hubo un error al registrar la reserva', error);
        if (error.response) {
            console.error("Error del servidor:", error.response.data); // Detalles del error del servidor
        }
        Swal.fire('Error', 'Hubo un problema al registrar la reserva', 'error');
      }
  };

  const manejarAceptarTerminos = () => {
    setFormData((prevFormData) => ({ ...prevFormData, terminos: true }));
    setMostrarModal(false);
  };

  const manejarCancelarTerminos = () => {
    setMostrarModal(false);
  };

  return (
    <div>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Formulario de Reserva local</title>
      <link rel="icon" type="image/png" href="https://i.ibb.co/gj0Bpcc/logo-empresa-mila.png" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />
  
      <section className="min-h-screen relative mt-12">
        <div className="background-overlay"></div>
        <div className="reservation-form"><br></br>
          
  
          <form id="reservation-form" className="reservation-form" onSubmit={handleSubmit}>
            <div className="container-layout">
              
              {/* Card para Datos del Usuario */}
              <div className="container_usuario select-people-container shadow-lg p-4 bg-white rounded border-2 border-[#e2b16d]">
                <h2 className="text-center mb-2 text-2xl font-bold text-black">Datos del Usuario</h2>
                <div className="border-b-2 border-[#e2b16d] w-3/4 mx-auto mb-4"></div>
  
                <label className="flex items-center">
                  <i className="fas fa-user mr-2 text-[#c59d3f]"></i> Nombre:
                </label>
                <input
                  className="block appearance-none w-full bg-gray-100 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-[#e2b16d] text-center shadow-sm transition duration-200 ease-in-out border-2 border-[#d1d5db]"
                  name="nombre"
                  type="text"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  readOnly
                />
                {errors.nombre && <p className="error text-red-500">{errors.nombre}</p>}
  
                <label className="flex items-center mt-4">
                  <i className="fas fa-mobile-alt mr-2 text-[#c59d3f]"></i> telefono:
                </label>
                <input
                  className="block appearance-none w-full bg-gray-100 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-[#e2b16d] text-center shadow-sm transition duration-200 ease-in-out border-2 border-[#d1d5db]"
                  name="telefono"
                  type="text"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                  readOnly
                />
                {errors.telefono && <p className="error text-red-500">{errors.telefono}</p>}
  
                <label className="flex items-center mt-4">
                  <i className="fas fa-envelope mr-2 text-[#c59d3f]"></i> Correo:
                </label>
                <input
                  className="block appearance-none w-full bg-gray-100 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-[#e2b16d] text-center shadow-sm transition duration-200 ease-in-out border-2 border-[#d1d5db]"
                  name="correo"
                  type="email"
                  value={formData.correo}
                  onChange={handleChange}
                  required
                  readOnly
                />
                {errors.correo && <p className="error text-red-500">{errors.correo}</p>}
  
                <label className="flex items-center mt-4">
                  <i className="fas fa-id-card mr-2 text-[#c59d3f]"></i> Número de Documento:
                </label>
                <input
                  className="block appearance-none w-full bg-gray-100 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-[#e2b16d] text-center shadow-sm transition duration-200 ease-in-out border-2 border-[#d1d5db]"
                  name="numero_documento"
                  type="text"
                  value={formData.numero_documento}
                  onChange={handleChange}
                  required
                  readOnly
                />
                {errors.numero_documento && <p className="error text-red-500">{errors.numero_documento}</p>}
              </div>
  
              {/* Card para Información de la Reserva */}
              <div className="container_datos select-date-container shadow-lg p-4 bg-white rounded border-2 border-[#e2b16d]">
                <h2 className="text-center mb-2 text-2xl font-bold text-black">Información Reserva Local</h2>
                <div className="border-b-2 border-[#e2b16d] w-3/4 mx-auto mb-4"></div>
                
                <label className="flex items-center mt-4 text-[#4b3621] hover:text-[#c59d3f] focus-within:text-[#c59d3f]">
                <i className="fas fa-users mr-2 text-[#c59d3f]"></i> Número de personas:
                </label>
              <input
                className="block w-full bg-white text-gray-700 py-3 px-4 rounded leading-tight shadow-sm transition duration-200 ease-in-out border-2 border-[#3a2a1a] focus:outline-none focus:border-[#e2b16d] focus:ring-2 focus:ring-[#e2b16d]"
                name="numero_personas"
                type="number"
                min="15"
                max="50"
                value={formData.numero_personas}
                onChange={handleChange}
                required
              />

                {errors.numero_personas && <p className="error">{errors.numero_personas}</p>}
  
                <label className="flex items-center mt-4">
                  <i className="fas fa-calendar-alt mr-2 text-[#c59d3f]"></i> Fecha:
                </label>
                <input
                className="block w-full bg-white text-gray-700 py-3 px-4 rounded leading-tight shadow-sm transition duration-200 ease-in-out border-2 border-[#3a2a1a] focus:outline-none focus:border-[#e2b16d] focus:ring-2 focus:ring-[#e2b16d]"
                name="fecha"
                  type="date"
                  value={formData.fecha}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  max={new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0]}
                  required
                />
                {errors.fecha && <p className="error">{errors.fecha}</p>}
  
                <label className="flex items-center mt-4">
                  <i className="fas fa-clock mr-2 text-[#c59d3f]"></i> Hora de Inicio:
                </label>
                <input
                  className="block w-full bg-white text-gray-700 py-3 px-4 rounded leading-tight shadow-sm transition duration-200 ease-in-out border-2 border-[#3a2a1a] focus:outline-none focus:border-[#e2b16d] focus:ring-2 focus:ring-[#e2b16d]"
                  name="horainicio"
                  type="time"
                  value={formData.horainicio}
                  onChange={handleChange}
                  required
                />
                {errors.horainicio && <p className="error">{errors.horainicio}</p>}
  
                <label className="flex items-center mt-4">
                  <i className="fas fa-clock mr-2 text-[#c59d3f]"></i> Hora de Finalización:
                </label>
                <input
                className="block w-full bg-white text-gray-700 py-3 px-4 rounded leading-tight shadow-sm transition duration-200 ease-in-out border-2 border-[#3a2a1a] focus:outline-none focus:border-[#e2b16d] focus:ring-2 focus:ring-[#e2b16d]"
                name="horafin"
                  type="time"
                  value={formData.horafin}
                  onChange={handleChange}
                  required
                />
                {errors.horafin && <p className="error">{errors.horafin}</p>}
              </div>
            </div>

            <div className="containerr select-date-container">
              <div className="relative">
                <label>Tipo de Servicio</label>
                <select 
                className="block w-full bg-white text-gray-700 py-3 px-4 rounded leading-tight shadow-sm transition duration-200 ease-in-out border-2 border-[#3a2a1a] focus:outline-none focus:border-[#e2b16d] focus:ring-2 focus:ring-[#e2b16d]"
                id="grid-services"
                  name="tipo_servicios"
                  value={formData.tipo_servicios}
                  onChange={handleChange}
                >
                  <option value="">Seleccione</option>
                  <option value="Licoreria">Licorería</option>
                  <option value="Decoracion">Decoración</option>
                  <option value="Iluminacion">Iluminación - Sonido</option>
                  <option value="Ninguno">Ninguno</option>
                </select>
                {errors.tipo_servicios && <p className="error">{errors.tipo_servicios}</p>}
              </div>
              
              <div className="mt-4">
    <label className="flex items-center">
        <i className="fas fa-comments mr-2 text-[#e2b16d]"></i> {/* Ícono de comentarios */}
        Comentarios:
    </label>
    <textarea 
                className="block w-full bg-white text-gray-700 py-3 px-4 rounded leading-tight shadow-sm transition duration-200 ease-in-out border-2 border-[#3a2a1a] focus:outline-none focus:border-[#e2b16d] focus:ring-2 focus:ring-[#e2b16d]"
                id="grid-comments"
        name="comentarios"
        value={formData.comentarios}
        onChange={handleChange}
        rows="4" // Define un número inicial de filas visibles
    />
    <p className="text-black-500 text-xs italic mt-1">Puedes escribir observaciones sobre tu reserva o peticiones adicionales (No estamos obligados a realizar estas peticiones extra)</p>
</div>
            </div>

            <div className="terminos">
              <input
                id="aceptaTerminos"
                type="checkbox"
                name="terminos"
                checked={formData.terminos}
                onChange={handleChange}
                className="form-checkbox h-4 w-4 text-black-100"
              />
              <label htmlFor="aceptaTerminos" className="text-gray-700 text-sm">
                Acepto los{' '}
                <button type="button" onClick={() => setMostrarModal(true)} className="text-black underline">
                  términos y condiciones
                </button>
              </label>
              {errors.terminos && <p className="error">{errors.terminos}</p>}
            </div>

            <button type="submit" className="continue-btn text-center bg-yellow-50 hover:bg-yellow-400 transition-colors duration-300">Continuar</button>
          </form>
        </div>
      </section>

      {mostrarModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Términos y Condiciones</h2>
            <ul className="list-disc pl-4 text-sm mb-4 space-y-2">
              <li><strong>Reservas:</strong> Las reservas están sujetas a la disponibilidad y deben ser confirmadas por el restaurante. Puedes modificar o cancelar tu reserva con al menos 24 horas de antelación sin incurrir en penalizaciones. Cancelaciones tardías o no presentaciones pueden estar sujetas a cargos.</li>
              <li><strong>Pedidos:</strong> Los pedidos realizados a través del sistema son definitivos una vez confirmados. El restaurante no se hace responsable por errores en los pedidos debido a información incorrecta proporcionada por el usuario.</li>
              <li><strong>Productos:</strong> Los productos mostrados en el sistema están sujetos a disponibilidad. El restaurante se reserva el derecho de modificar o descontinuar productos sin previo aviso.</li>
              <li><strong>Eventos:</strong> La participación en eventos organizados por el restaurante está sujeta a los términos específicos del evento, que pueden incluir políticas de cancelación y reembolso.</li>
              <li><strong>Privacidad:</strong> Toda la información personal recopilada a través de este sistema será utilizada exclusivamente para gestionar tus reservas, pedidos, y participación en eventos. Nos comprometemos a proteger tu información y no compartirla con terceros sin tu consentimiento, excepto cuando sea necesario para el funcionamiento del sistema.</li>
              <li><strong>Cambios en los Términos:</strong> El restaurante se reserva el derecho de modificar estos términos y condiciones en cualquier momento. Es tu responsabilidad revisar estos términos periódicamente para estar al tanto de cualquier cambio.</li>
            </ul>
            <p className="text-sm mb-4">
              Al continuar utilizando este sistema, confirmas que has leído y aceptado estos términos y condiciones.
            </p>

            <div className="flex justify-end space-x-4">
              <button onClick={manejarCancelarTerminos} className="bg-gray-500 text-white py-1 px-3 rounded-lg text-sm">Cancelar</button>
              <button onClick={manejarAceptarTerminos} className="bg-yellow-500 text-white py-1 px-3 rounded-lg text-sm">Aceptar</button>
            </div>
          </div>
        </div>
      )}
    
    <style>{`
    /* permite que los cuadros del formulario esten en la posición que estan*/
    .container-layout {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-top: 50px; /* Ajustado para dar espacio adecuado después del título */
      flex-wrap: wrap;
    }

    /* tamaño de los cuadros de los formularios*/
    .container_usuario, .container_datos {
      background-color: rgba(255, 255, 255, 0.8);
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      text-align: center;
      backdrop-filter: blur(12px);
      width: 40%; /* Reducido aún más el tamaño de las cards */
      border: 2px solid #ffd700; /* Gold border */
      /* Eliminar transiciones */
    }

    /* Container for Service Type and Comments */
    .containerr {
      width: 80%; /* Mismo ancho que las otras dos cards */
      margin: 50px auto;
      background-color: rgba(255, 255, 255, 0.8);
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(12px);
      border: 2px solid #ffd700;
      position: relative;
      /* Eliminar transiciones */
    }

    /* Estilo para las etiquetas */
    label {
      font-size: 14px;
      color: #333;
      display: block;
      margin-bottom: 10px;
    }

    /* Estilo para los mensajes de error boton terminos y condiciones */
    .error {
      color: #ff4d4d;
      font-size: 0.9rem;
      margin-top: -5px;
      margin-bottom: 2px;
    }

    /* Términos y Condiciones */
    .terminos {
      background-color: rgba(255, 255, 255, 0.9);
      padding: 15px;
      border: 2px solid #ffd700;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      text-align: center;
      width: 400px;
      height: 80px;
      position: absolute;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%); 
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      color: #333;
      z-index: 1;
      padding-top: 20px; 
      padding-bottom: 20px; 
    }

    .terminos input[type="checkbox"] {
      vertical-align: middle;
      margin-right: 10px; 
     }

    .terminos label {
     line-height: 1.4;
    }

    /* Ajustamos la posición del botón de continuar */
    .continue-btn {
      width: auto;
      background-color: #ffd700;
      color: #1f1f1f;
      padding: 18px 40px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      transition: background-color 0.3s ease, transform 0.3s ease;
      margin-top: 140px; /* Aumentado para mover el botón aún más abajo */
      display: block;
      margin-left: auto;
      margin-right: auto;
      margin-bottom: 20px; /* Espaciado adicional para no estar pegado al fondo */
    }

    /* Estilo para los títulos de secciones */
    h2 {
      color: #333;
      margin-bottom: 15px;
      font-size: 22px;
      font-weight: 600;
    }

    /* Fuente y tamaño de las etiquetas */
      .titulo, h2, label {
      font-family: 'Poppins', sans-serif;

    `}</style>
    
    </div>
  );
};

export default ReservaLocal;
