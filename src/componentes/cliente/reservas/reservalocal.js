import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import API_URL from '../../../config/config'; 


const ReservaLocal = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    celular: '',
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
          celular: user.telefono || '',
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

      Swal.fire('¡Éxito!', 'La reserva ha sido registrada correctamente', 'success');

      setFormData({
        nombre: '',
        celular: '',
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
      <section className="min-h-screen relative">
        <div className="background-overlay"></div>
        <div className="reservation-form">
          <h2 className='titulo'>Personaliza la reserva del local</h2>
          <form id="reservation-form" className='reservation-form' onSubmit={handleSubmit}>
            <div className='container-layout'>
              <div className="container_usuario select-people-container">
                <h2>Datos del Usuario</h2>
                <label>Nombre:</label>
                <input
                  style={{ border: '2px solid #fcd8a9' }}
                  className="block appearance-none w-full bg-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-[#fcd8a9] text-center"
                  name="nombre"
                  type="text"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  readOnly
                />
                {errors.nombre && <p className="error">{errors.nombre}</p>}

                <label>Celular:</label>
                <input
                  style={{ border: '2px solid #fcd8a9' }}
                  className="block appearance-none w-full bg-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-[#fcd8a9] text-center"
                  name="celular"
                  type="text"
                  value={formData.celular}
                  onChange={handleChange}
                  required
                  readOnly
                />
                {errors.celular && <p className="error">{errors.celular}</p>}

                <label>Correo:</label>
                <input
                  style={{ border: '2px solid #fcd8a9' }}
                  className="block appearance-none w-full bg-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-[#fcd8a9] text-center"
                  name="correo"
                  type="email"
                  value={formData.correo}
                  onChange={handleChange}
                  required
                  readOnly
                />
                {errors.correo && <p className="error">{errors.correo}</p>}
                
                <label>Número de Documento:</label>
                <input
                  style={{ border: '2px solid #fcd8a9' }}
                  className="block appearance-none w-full bg-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-[#fcd8a9] text-center"
                  name="numero_documento"
                  type="text"
                  value={formData.numero_documento}
                  onChange={handleChange}
                  required
                  readOnly
                />
                {errors.numero_documento && <p className="error">{errors.numero_documento}</p>}
              </div>

              <div className="container_datos select-date-container">
                <h2>Información de la Reserva</h2>
                <label>Número de personas:</label>
                <input 
                  style={{ border: '2px solid #fcd8a9' }}
                  className="input-field"
                  name="numero_personas"
                  type="number"
                  min="15"
                  max="50"
                  value={formData.numero_personas}
                  onChange={handleChange}
                  required
                />
                {errors.numero_personas && <p className="error">{errors.numero_personas}</p>}

                <label>Fecha:</label>
                <input
                  style={{ border: '2px solid #fcd8a9' }}
                  className="input-field"
                  name="fecha"
                  type="date"
                  value={formData.fecha}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]} // Fecha de hoy
                  max={new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0]} // Último día del año
                  required
                />
                {errors.fecha && <p className="error">{errors.fecha}</p>}

                <label>Hora de Inicio:</label>
                <input
                  style={{ border: '2px solid #fcd8a9' }}
                  className="input-field"
                  name="horainicio"
                  type="time"
                  value={formData.horainicio}
                  onChange={handleChange}
                  required
                />
                {errors.horainicio && <p className="error">{errors.horainicio}</p>}

                <label>Hora Fin:</label>
                <input
                  style={{ border: '2px solid #fcd8a9' }}
                  className="input-field"
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
                  style={{ border: '2px solid #fcd8a9' }}
                  className="input-field"
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
              
              <div>
                <label>
                  <i className="fas fa-comments icon mr-2" />
                  Comentarios:
                </label>
                <input 
                  className='input-field'
                  id="grid-comments"
                  type="text"
                  name='comentarios' 
                  value={formData.comentarios}
                  onChange={handleChange} 
                />
                <p className="text-black-500 text-xs italic">Puedes escribir observaciones sobre tu reserva o peticiones adicionales(No estamos obligados a realizar estas peticiones extra)</p>
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

            <button type="submit" className="continue-btn">Continuar</button>
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
        /* Estilos generales */
        .nombre {
          background-color: #f8f8f8;
        }

        .error {
          color: red;
          font-size: 0.875rem;
          margin-top: -10px;
          margin-bottom: 10px;
        }
        
        body {
            position: relative;
            margin: 0;
            height: 100%;
            width: 100%; /* Asegúrate de que el body ocupe toda la altura de la ventana */
        }

        .titulo {
            font-family: 'Bold';
            font-size: 80px;
            color: Black;
            text-align: center;
            position: absolute;
            margin-top: 10px;
            justify-content: center;
            width: 86%;
        }

        .background-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          filter: brightness(50%);
          z-index: -1;
        }

        .reservation-form {
          display: flex;
          align-items: center;
          justify-content: space-between; /* Coloca los dos contenedores uno al lado del otro */
          align-items: flex-start;
          gap: 20px; /* Espacio entre los contenedores */
          margin-bottom: 20px; /* Separación con el contenedor inferior */
          flex-wrap: wrap; /* Esto asegura que los contenedores no se salgan de la pantalla */
        }

        /* Contenedor que envuelve los dos principales */
        .container-layout {
          display: flex;
          justify-content: center; /* Mantiene los dos contenedores alineados horizontalmente */
          gap: -5px; /* Espaciado entre ellos */
          margin-bottom: 5px; /* Espaciado con el siguiente contenedor */
          width: 100%; /* Abarca el ancho completo */
          margin-top: 70px
        }
        
        .terminos {
            background-color: rgba(255, 255, 255, 0.5);
            padding: 20px;
            border: 2px solid gold;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            text-align: center;
            margin-top: 80px;
            width: 300px; /* Ajuste consistente de tamaño */
            height: 70px;
            position: absolute; /* Cambiado a fixed */
            bottom: 1px; /* Espaciado desde el fondo */
            left: 50%; /* Centrado horizontalmente */
            transform: translateX(-50%); /* Ajusta el centro */
            display: flex;
            justify-content: center; /* Centra el contenido dentro del contenedor */
            align-items: center; /* Centra el contenido verticalmente */
        }

            /* Mantén los estilos de los contenedores que no quieres modificar */
        .container_usuario, .container_datos {
          background-color: rgba(255, 255, 255, 0.5);
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          text-align: center;
          backdrop-filter: blur(10px);
          width: 48%; /* Cada contenedor ocupa aproximadamente la mitad del espacio disponible */
          border: 2px solid gold;
          margin: 70px;
        }

        .containerr {
          width: 100%; /* Ocupa el ancho completo que suman los contenedores de arriba */
          margin: 70px; /* Centrado del contenedor */
          margin-top: -40px; /* Separación desde los otros dos contenedores */
          border: 2px solid gold;
          background-color: rgba(255, 255, 255, 0.5);
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
        }



        .container {
            background-color: rgba(255, 255, 255, 0.5);
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            text-align: center;
            backdrop-filter: blur(10px);
            width: 400px; /* Ajuste consistente de tamaño */
            margin-top: -170px;
            margin-left: 50px;
            border: 2px solid gold;
        }

        h2 {
          color: #000;
          margin-bottom: 10px;
        }

        label {
          color: #000;
          display: block;
          margin-bottom: 5px;
        }

        .input-field {
          width: 100%;
          padding: 10px;
          margin-bottom: 15px;
          border-radius: 5px;
          border: 1px solid #ccc;
          text-align: center;
        }

      
        /* Botón de continuar */
        .continue-btn {
          position: absolute; /* Fijo en la parte inferior de la pantalla */
          bottom: 0;
          width: 100%; /* Ocupa todo el ancho */
          background-color: gold;
          color: #000000;
          padding: 15px ;
          border: none;
          border-radius: 0;
          cursor: pointer;
          text-align: center;
          margin: -70px;
        }

        .continue-btn:hover {
           background-color: rgb(253, 216, 53);
        }
      `}</style>
    
    </div>
  );
};

export default ReservaLocal;
