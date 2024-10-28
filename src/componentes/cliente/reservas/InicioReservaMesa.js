import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';


const ReservaMesa = () => {
const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    correo: '',
    numero_documento: '',
    numero_personas: '',
    fecha: '',
    horainicio: '',
    horafin: '',
    decoracion: '',
    actividades: '',
    tipo_servicios: false,
    comentarios: '',
    estado_reserva: 'Pendiente',
    tipo_reserva: 'Reserva Mesa',
    terminos: false,
    id_usuario:'',
});
const [errors, setErrors] = useState({});
const [mostrarModal, setMostrarModal] = useState(false);
const id_usuario = localStorage.getItem('id_usuario');

useEffect(() => {
    const fetchUserData = async () => {
        try {
            const id_usuario = localStorage.getItem('id_usuario');
            if (!id_usuario) {
                throw new Error('ID de usuario no encontrado');
            }
            const response = await axios.get(`http://localhost:8000/usuarios/${id_usuario}`);
            const user = response.data;

            setFormData((prevFormData) => ({
                ...prevFormData,
                nombre: user.nombre || '',
                telefono: user.telefono || '',
                correo: user.correo || '',
                id_usuario: user.id || '',
                numero_documento: user.numero_documento || '',
            }));
        } catch (error) {
            console.error('Error al obtener los datos del usuario', error);
            Swal.fire('Error', 'No se pudo cargar los datos del usuario', 'error');
        }
    };

    fetchUserData();
}, [id_usuario]);

const checkAvailability = async () => {
    try {
    const response = await axios.get('http://localhost:8000/usuarios/reservas');
    const reservas = response.data;

    const fechaSolicitud = new Date(formData.fecha);
    const horaInicioSolicitud = new Date(`${formData.fecha}T${formData.horainicio}`);
    
    // Ajustar la duración si tienes un tiempo de reserva fijo
    const duracionReserva = 2 * 60 * 60 * 1000; // 2 horas en milisegundos
    const horaFinSolicitud = new Date(horaInicioSolicitud.getTime() + duracionReserva);

    // Verificar si hay conflictos con la reserva solicitada
    const esDisponible = reservas.every((reserva) => {
        const reservaFecha = new Date(reserva.fecha);
        const reservaHoraInicio = new Date(`${reserva.fecha}T${reserva.horainicio}`);
        // Asumimos que las reservas existentes también tienen una duración fija
        const reservaHoraFin = new Date(reservaHoraInicio.getTime() + duracionReserva);

        return (
        (horaFinSolicitud <= reservaHoraInicio) || // La solicitud termina antes de que comience la reserva
        (horaInicioSolicitud >= reservaHoraFin)    // La solicitud comienza después de que termina la reserva
        );
    });

    return esDisponible;
    } catch (error) {
    console.error('Error al verificar disponibilidad', error);
    Swal.fire('Error', 'No se pudo verificar la disponibilidad', 'error');
    return false;
    }
};

const validateForm = async () => {
    const newErrors = {};
    if (!formData.numero_personas.trim() || formData.numero_personas <= 0 || formData.numero_personas > 12) {
    newErrors.numero_personas = 'El número de personas debe ser entre 1 y 12';
    }
    if (!formData.fecha.trim()) {
    newErrors.fecha = 'La fecha es obligatoria';
    }
    if (!formData.horainicio.trim()) {
    newErrors.horainicio = 'La hora de inicio es obligatoria';
    }
    if (!formData.actividades.trim()) {
    newErrors.actividades = 'Elige un tipo de servicio';
    }

    // Verificar disponibilidad
    const esDisponible = await checkAvailability();
    if (!esDisponible) {
    newErrors.fecha = 'La fecha y hora seleccionadas ya están reservadas';
    }

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
      const response = await axios.post('http://localhost:8000/usuarios/reservas', reservaData);
      console.log("Respuesta del servidor:", response.data); // Agrega esta línea para ver la respuesta

      Swal.fire('¡Éxito!', 'La reserva ha sido registrada correctamente', 'success');

      setFormData({
        nombre: '',
        telefono: '',
        correo: '',
        numero_documento: '',
        numero_personas: '',
        fecha: '',
        horainicio: '',
        horafin: '',
        decoracion: '',
        actividades: '',
        tipo_servicios: false,
        comentarios: '',
        estado_reserva: 'Pendiente',
        tipo_reserva: 'reserva_mesa',
        terminos: false,
        id_usuario:'',
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
            <div className="reservation-form">
            <h2 className='titulo' >Personaliza tu reserva de mesa</h2>


            <form id="reservation-form" className='reservation-form' onSubmit={handleSubmit}>
                <div className='container-layout'>
                    
                <div className="container_usuario select-people-container shadow-lg p-4 bg-white rounded border-2 border-[#e2b16d]">
        <h2 className="text-center mb-2 text-2xl font-bold text-black">Datos del Usuario</h2>
        <div className="border-b-2 border-[#e2b16d] w-3/4 mx-auto mb-4"></div> {/* Línea dorada más ancha que el título */}
        
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
            <i className="fas fa-mobile-alt mr-2 text-[#c59d3f]"></i> Celular:
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
            

    <div className="container_datos select-date-container shadow-lg p-4 bg-white rounded border-2 border-[#5a3e23]">
        <h2 className="text-center mb-2 text-2xl font-bold text-black">Información de la Reserva</h2>
        <div className="border-b-2 border-[#e2b16d] w-3/4 mx-auto mb-4"></div> {/* Línea dorada más ancha que el título */}

        <label className="flex items-center mt-4">
            <i className="fas fa-users mr-2 text-[#c59d3f]"></i> Número de personas:
        </label>
        <select
            className="block appearance-none w-full bg-white text-gray-700 py-3 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-[#e2b16d] shadow-sm transition duration-200 ease-in-out border-2 border-[#5a3e23]"
            name="numero_personas"
            value={formData.numero_personas}
            onChange={handleChange}
            required
        >
            <option value="">Seleccione</option>
            {[...Array(12).keys()].map(i => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
        </select>
        {errors.numero_personas && <p className="error text-red-500">{errors.numero_personas}</p>}

        <label className="flex items-center mt-4">
            <i className="fas fa-calendar-alt mr-2 text-[#c59d3f]"></i> Fecha:
        </label>
        <input
            className="block appearance-none w-full bg-white text-gray-700 py-3 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-[#e2b16d] shadow-sm transition duration-200 ease-in-out border-2 border-[#5a3e23]"
            name="fecha"
            type="date"
            value={formData.fecha}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}  // No permitir fechas pasadas
            max={`${new Date().getFullYear()}-12-31`}     // No permitir fechas fuera del año actual
            required
        />
        {errors.fecha && <p className="error text-red-500">{errors.fecha}</p>}

        <label className="flex items-center mt-4">
            <i className="fas fa-clock mr-2 text-[#c59d3f]"></i> Hora de Inicio:
        </label>
        <input
            className="block appearance-none w-full bg-white text-gray-700 py-3 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-[#e2b16d] shadow-sm transition duration-200 ease-in-out border-2 border-[#5a3e23]"
            name="horainicio"
            type="time"
            value={formData.horainicio}
            onChange={handleChange}
            required
        />
        {errors.horainicio && <p className="error text-red-500">{errors.horainicio}</p>}

        <label className="flex items-center mt-4">
            <i className="fas fa-clock mr-2 text-[#c59d3f]"></i> Hora de Finalizacion:
        </label>
        <input
            className="block appearance-none w-full bg-white text-gray-700 py-3 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-[#e2b16d] shadow-sm transition duration-200 ease-in-out border-2 border-[#5a3e23]"
            name="horafin"
            type="time"
            value={formData.horafin}
            onChange={handleChange}
            required
        />
        {errors.horafin && <p className="error text-red-500">{errors.horafin}</p>}

        <label className="flex items-center mt-4">
            <i className="fas fa-paint-brush mr-2 text-[#c59d3f]"></i> Elige la decoración:
        </label>
        <select 
            className="block appearance-none w-full bg-white text-gray-700 py-3 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-[#e2b16d] shadow-sm transition duration-200 ease-in-out border-2 border-[#5a3e23]" 
            id="grid-services"
            name="decoracion"
            value={formData.decoracion}
            onChange={handleChange}
        >
            <option value="">Seleccione</option>
            <option value="Fecha_especial">Fecha especial</option>
            <option value="Aniversario">Aniversario</option>
            <option value="Cumpleanos">Cumpleaños</option>
            <option value="Otro">Otro</option>
        </select>
        {errors.decoracion && <p className="error text-red-500">{errors.decoracion}</p>}
    </div>

                </div>

                <div className="containerr shadow-lg p-6 bg-white rounded-lg border-2 border-[#4b3621]"> {/* Sombra al formulario */}
        {/* Tipo de Servicio con Ícono */}
        <div className="relative">
            <label className="flex items-center">
                <i className="fas fa-concierge-bell mr-2 text-[#c59d3f]"></i> {/* Ícono de servicio */}
                Tipo de Servicio
            </label>
            <select 
                className="block appearance-none w-full bg-white text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-[#c59d3f] focus:shadow-lg border-[#4b3621] border-2 transition duration-200 ease-in-out"
                id="grid-services"
                name="actividades"
                value={formData.actividades}
                onChange={handleChange}
            >
                <option value="">Seleccione</option>
                <option value="Pintura de Escultura">Pintura de escultura</option>
                <option value="Parques">Parques</option>
                <option value="Dibujo con colores">Dibujo con colores</option>
            </select>
            {errors.actividades && <p className="error text-red-500">{errors.actividades}</p>}
        </div>
        
        {/* Comentarios con Ícono */}
        <div className="mt-4">
            <label className="flex items-center">
                <i className="fas fa-comments mr-2 text-[#c59d3f]"></i> {/* Ícono de comentarios */}
                Comentarios:
            </label>
            <input 
                className="block w-full bg-white text-gray-700 py-3 px-4 rounded leading-tight focus:outline-none focus:bg-white focus:border-[#c59d3f] focus:shadow-lg border-[#4b3621] border-2 transition duration-200 ease-in-out"
                id="grid-comments"
                type="text"
                name="comentarios"
                value={formData.comentarios}
                onChange={handleChange} 
            />
            <p className="text-black-500 text-xs italic mt-1">Puedes escribir observaciones sobre tu reserva o peticiones adicionales (No estamos obligados a realizar estas peticiones extra)</p>
        </div>
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
        .nombre {
        background-color: #f8f8f8;
        }

        .error {
        color: red;
        font-size: 0.875rem;
        margin-top: -1px;
        margin-bottom: 10px;
        }

        body {
        position: relative;
        margin: 0;
        height: 100%;
        width: 100%; /* Asegúrate de que el body ocupe toda la altura de la ventana */
        }

        .titulo {
        font-family: 'Merriweather';
        font-size: 65px;
        color: Black;
        text-align: center;
        position: absolute;
        margin-top: 10px;
        width: 105%;
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

        /* Contenedor del Tipo de Servicio y Comentarios ajustado */
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

        h2 {
        color: #000;
        margin-bottom: 10px;
        }
        
        .terminos {
            background-color: rgba(255, 255, 255, 0.5);
            padding: 20px;
            border: 2px solid gold;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            text-align: center;
            width: 400px; /* Ajuste consistente de tamaño */
            height: 70px;
            position: absolute; /* Cambiado a fixed */
            bottom: 1px; /* Espaciado desde el fondo */
            left: 50%; /* Centrado horizontalmente */
            transform: translateX(-50%); /* Ajusta el centro */
            display: flex;
            justify-content: center; /* Centra el contenido dentro del contenedor */
            align-items: center; /* Centra el contenido verticalmente */
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

        .continue-btn {
        position: absolute; /* Fijo en la parte inferior de la pantalla */
        bottom: 0;
        width: 120%; /* Ocupa todo el ancho */
        background-color: gold;
        color: #000000;
        padding: 15px;
        border: none;
        border-radius: 0;
        cursor: pointer;
        text-align: center;
        margin: -70px; /* Ajusta este margen según sea necesario */
    }
        .continue-btn:hover {
        background-color: rgb(253, 216, 53);
        }

        
    `}</style>


    
    </div>
);
};

export default ReservaMesa;