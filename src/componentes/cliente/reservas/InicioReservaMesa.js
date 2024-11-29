import React, { useState, useEffect  } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import API_URL from '../../../config/config';



const ReservaMesa = () => {
    const navigate = useNavigate();
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
    tipo_servicios: '',
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
            const response = await axios.get(`${API_URL}/usuarios/${id_usuario}`);
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
    const response = await axios.get(`${API_URL}/usuarios/reservas`);
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
        const response = await axios.post(`${API_URL}/usuarios/reservass`, formData);
        console.log("Respuesta del servidor:", response.data);
  
        Swal.fire('¡Éxito!', 'La reserva ha sido registrada correctamente', 'success');
  
        // Limpia el formulario
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
          tipo_servicios: false,
          comentarios: '',
          estado_reserva: 'Pendiente',
          tipo_reserva: 'reserva_mesa',
          terminos: false,
          id_usuario: '',
        });
  
        
        navigate('/ReservasCliente');
      } catch (error) {
        console.error('Hubo un error al registrar la reserva', error);
        if (error.response) {
          console.error("Error del servidor:", error.response.data);
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
        <h2 className="text-center mb-2 text-2xl font-bold text-black">Información Reserva Mesa</h2>
        <div className="border-b-2 border-[#e2b16d] w-3/4 mx-auto mb-4"></div> {/* Línea dorada más ancha que el título */}

        <label className="flex items-center mt-4">
            <i className="fas fa-users mr-2 text-[#c59d3f]"></i> Número de personas:
        </label>
        <select
                className="block w-full bg-white text-gray-700 py-3 px-4 rounded leading-tight shadow-sm transition duration-200 ease-in-out border-2 border-[#3a2a1a] focus:outline-none focus:border-[#e2b16d] focus:ring-2 focus:ring-[#e2b16d]"
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
                className="block w-full bg-white text-gray-700 py-3 px-4 rounded leading-tight shadow-sm transition duration-200 ease-in-out border-2 border-[#3a2a1a] focus:outline-none focus:border-[#e2b16d] focus:ring-2 focus:ring-[#e2b16d]"
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
                className="block w-full bg-white text-gray-700 py-3 px-4 rounded leading-tight shadow-sm transition duration-200 ease-in-out border-2 border-[#3a2a1a] focus:outline-none focus:border-[#e2b16d] focus:ring-2 focus:ring-[#e2b16d]"
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
                className="block w-full bg-white text-gray-700 py-3 px-4 rounded leading-tight shadow-sm transition duration-200 ease-in-out border-2 border-[#3a2a1a] focus:outline-none focus:border-[#e2b16d] focus:ring-2 focus:ring-[#e2b16d]"
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
                className="block w-full bg-white text-gray-700 py-3 px-4 rounded leading-tight shadow-sm transition duration-200 ease-in-out border-2 border-[#3a2a1a] focus:outline-none focus:border-[#e2b16d] focus:ring-2 focus:ring-[#e2b16d]"
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
                        <i className="fas fa-concierge-bell mr-2 text-[#e2b16d]"></i> {/* Ícono de servicio */}
                        Tipo de Servicio
                    </label>
                    <select 
                        className="block w-full bg-white text-gray-700 py-3 px-4 rounded leading-tight shadow-sm transition duration-200 ease-in-out border-2 border-[#3a2a1a] focus:outline-none focus:border-[#e2b16d] focus:ring-2 focus:ring-[#e2b16d]"
                        id="grid-services"
                        name="tipo_servicios"
                        value={formData.tipo_servicios}
                        onChange={handleChange}
                    >
                        <option value="">Seleccione</option>
                        <option value="Pintura de Escultura">Pintura de escultura</option>
                        <option value="Parques">Parques</option>
                        <option value="Dibujo con colores">Dibujo con colores</option>
                    </select>
                    {errors.tipo_servicios && <p className="error text-red-500">{errors.tipo_servicios}</p>}
                </div>
        
        {/* Comentarios con Ícono */}
        <div className="mt-4">
    <label className="flex items-center">
        <i className="fas fa-comments mr-2 text-[#c59d3f]"></i> {/* Ícono de comentarios */}
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

/* Container Layout (for alignment) */
.container-layout {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 50px; /* Ajustado para dar espacio adecuado después del título */
    flex-wrap: wrap;
}

/* Container Styling (User & Data Sections) */
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

/* Labels */
label {
    font-weight: 600;
    font-size: 14px;
    color: #333;
    display: block;
    margin-bottom: 8px;
}

/* Error message styling */
.error {
    color: #ff4d4d;
    font-size: 0.9rem;
    margin-top: -5px;
    margin-bottom: 15px;
}

/* Terms section (positioned at the bottom) */
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
    bottom: 100px; /* Mantener una distancia adecuada entre el fondo */
    left: 50%;
    transform: translateX(-50%); /* Centramos el contenedor de términos horizontalmente */
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    color: #333;
    z-index: 1;
    padding-top: 20px; /* Espacio adicional para separar el texto del borde superior */
    padding-bottom: 20px; /* Espacio adicional para separar el texto del borde inferior */
}
    .terminos input[type="checkbox"] {
    vertical-align: middle; /* Alineación del checkbox con el texto */
    margin-right: 10px; /* Espacio entre el checkbox y el texto */
}

/* Si hay un texto largo, se ajusta automáticamente */
.terminos label {
    line-height: 1.4; /* Añadir espacio entre las líneas del texto */
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

/* Button hover effect */
.continue-btn:hover {
    background-color: #ffcc00;
    transform: none; /* Eliminar la transición exagerada */
}

/* Additional styling tweaks for a more polished look */
.titulo, h2, label {
    font-family: 'Poppins', sans-serif;
}

/* Estilo para hacer que el textarea se expanda automáticamente */
textarea {
    resize: none; /* Deshabilita la opción de redimensionar manualmente */
    overflow-y: auto; /* Añade barra de desplazamiento si es necesario */
    min-height: 120px; /* Altura mínima para el textarea */
    max-height: 300px; /* Limita la altura máxima */
}

/* Asegúrate de que el borde se vea bien al enfocar */
textarea:focus {
    border-color: #ffd700;
    background-color: #fff;
}


`}</style>




    </div>
);
};

export default ReservaMesa;