import React, { useState } from 'react'; // Importa useState
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import Swal from 'sweetalert2';
import API_URL from '../../config/config'; 


const FormularioRegistro = () => {
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    correo: '',
    tipo_documento: 'Cedula de ciudadania',
    numero_documento: '',
    rol: 'Cliente',
    contrasena: '',
    direccion: '',
    barrio: '',
    estado: 'Activo', // Valor por defecto si no se proporciona
    aceptaTerminos: false,
  });

  // Validación de los requisitos de la contraseña al momento de crearla
  const validarContrasena = (contrasena) => {
    const longitudValida = contrasena.length >= 6 && contrasena.length <= 10;
    const contieneLetras = /[a-zA-Z]/.test(contrasena);
    const contieneNumeros = /\d/.test(contrasena);
    const contieneSimbolos = /[!@#$%^&*(),.?":{}|<>]/.test(contrasena);
    const contieneMayuscula = /[A-Z]/.test(contrasena);

    return {
      longitudValida,
      contieneLetras,
      contieneNumeros,
      contieneSimbolos,
      contieneMayuscula,
    };
  };

  const requisitos = validarContrasena(formData.contrasena);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Validación condicional para el campo número de documento
    if (name === 'tipo_documento') {
      // Si el tipo de documento es "Cedula de extranjeria", aplicar validación especial
      if (value === 'Cedula de extranjeria') {
        validateNumeroDocumento(formData.numero_documento, 'Cedula de extranjeria');
      }
    }
  };

  const validateNumeroDocumento = (numeroDocumento, tipoDocumento) => {
    let regex;
    if (tipoDocumento === 'Cedula de extranjeria') {
      regex = /^[A-Z0-9-a-z]{7,10}$/i; // Ajusta según el formato específico para "Cédula de extranjería"
    } else {
      regex = /^\d{8,12}$/; // Para otros tipos de documentos
    }
    if (!regex.test(numeroDocumento)) {
      // Manejo de error o estado de validación
      console.error('Número de documento inválido para el tipo de documento seleccionado.');
    }
  };

  const validateForm = () => {
    const { nombre, apellido, telefono, numero_documento, direccion, barrio, correo, contrasena } = formData;
    const errors = [];

    // Validación de nombre
    if (nombre.length > 15) errors.push('El nombre debe tener máximo 15 caracteres.');

    // Validación de apellido
    if (apellido.length > 20) errors.push('El apellido debe tener máximo 20 caracteres.');

    // Validación de email
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correoRegex.test(correo)) errors.push('El correo electrónico no es válido.');

    // Validación de teléfono
    if (!/^[0-9]{10}$/.test(telefono)) errors.push('El teléfono debe tener 10 dígitos.');

    const direccionRegex = /^(Calle|Cll|Carrera|Cra|Avenida|Av|Transversal|Tv|Diagonal|Dg)\s.*$/i;
    const caracteresValidos = /^[a-zA-Z0-9\s#.-]*$/;

    if (!direccionRegex.test(direccion)) {
      errors.push('La dirección debe comenzar con una palabra clave válida como Calle, Carrera, Avenida, etc.');
    } else if (!caracteresValidos.test(direccion)) {
      errors.push('La dirección contiene caracteres no válidos.');
    }

    // Validación de barrio
    if (/[^a-zA-Z\s]/.test(barrio)) errors.push('El barrio solo debe contener letras.');

    // Validación de número de documento
    if (formData.tipo_documento === 'Cedula de extranjeria') {
      if (numero_documento.length < 7 || numero_documento.length > 10) {
        errors.push('El número de documento para cédula de extranjería debe tener entre 7 y 10 caracteres.');
      }
    } else {
      if (numero_documento.length < 8 || numero_documento.length > 12) {
        errors.push('El número de documento debe tener entre 8 y 12 caracteres.');
      }
    }

    // Validación de contraseña
    const contrasenaErrors = [];

    if (contrasena.length < 6 || contrasena.length > 10) {
      contrasenaErrors.push('La contraseña debe tener entre 6 y 10 caracteres.');
    }

    if (!/[a-zA-Z]/.test(contrasena)) {
      contrasenaErrors.push('La contraseña debe incluir al menos una letra.');
    }

    if (!/[0-9]/.test(contrasena)) {
      contrasenaErrors.push('La contraseña debe incluir al menos un número.');
    }

    if (!/[\W_]/.test(contrasena)) {
      contrasenaErrors.push('La contraseña debe incluir al menos un símbolo.');
    }

    if (!/[A-Z]/.test(contrasena)) {
      contrasenaErrors.push('La contraseña debe incluir al menos una letra mayúscula.');
    }

    if (contrasenaErrors.length > 0) {
      errors.push(...contrasenaErrors);
    }

    return errors;
  };
  


const verificarUsuarioExistente = async () => {
    try {
        const response = await axios.post(`${API_URL}/usuarios/verificar-usuario`, {
            numero_documento: formData.numero_documento,
            correo: formData.correo,
        });
        return response.data; // Retorna la respuesta para usarla más tarde
    } catch (error) {
        console.error('Error al verificar usuario:', error);
        // Manejar errores específicos de la API
        if (error.response) {
            return {
                exists: true,
                message: error.response.data.message || 'Error al verificar el usuario.',
            };
        }
        await Swal.fire({
            title: "Error",
            text: "Error al verificar el usuario. Inténtalo de nuevo más tarde.",
            icon: "warning",
            iconColor: "#FFD700", // Dorado brillante para el ícono
            background: "rgba(244, 244, 244, 0.9)", // Fondo gris claro semitransparente
            color: "#333333",
            timer: 5000,
            timerProgressBar: true,
            showConfirmButton: false,
            customClass: {
            popup: "rounded-lg border-2 border-yellow-300 shadow-md animate_animated animate_fadeInDown", // Animación de entrada
            title: "text-lg font-semibold text-yellow-700",
            timerProgressBar: "bg-yellow-400" // Barra de progreso dorada
            }
        });
        return null; // En caso de error, retorna null
    }
};


const subir = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      Swal.fire({
        title: 'Errores de Validación',
        text: validationErrors.join(' '),
        icon: "warning",
        iconColor: "#FFD700", // Dorado brillante para el ícono
        background: "rgba(244, 244, 244, 0.9)", // Fondo gris claro semitransparente
        color: "#333333",
        timer: 5000,
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: {
        popup: "rounded-lg border-2 border-yellow-300 shadow-md animate_animated animate_fadeInDown", // Animación de entrada
        title: "text-lg font-semibold text-yellow-700",
        timerProgressBar: "bg-yellow-400" // Barra de progreso dorada
        }
      });
      return;
    }

    if (!formData.aceptaTerminos) {
      setMostrarModal(true);
      return;
    }

    // Verificar si el usuario ya existe
    const verificacion = await verificarUsuarioExistente();
    if (verificacion) {
        if (verificacion.exists) {
            // Muestra un mensaje de error si ya está registrado
            await Swal.fire({
                title: "Error",
                text: verificacion.message, // Aquí se muestra el mensaje correspondiente
                icon: "warning",
                iconColor: "#FFD700", // Dorado brillante para el ícono
                background: "rgba(244, 244, 244, 0.9)", // Fondo gris claro semitransparente
                color: "#333333",
                timer: 5000,
                timerProgressBar: true,
                showConfirmButton: false,
                customClass: {
                popup: "rounded-lg border-2 border-yellow-300 shadow-md animate_animated animate_fadeInDown", // Animación de entrada
                title: "text-lg font-semibold text-yellow-700",
                timerProgressBar: "bg-yellow-400" // Barra de progreso dorada
                }
            });
            return; // Detiene el registro
        }
    }

    // Si no existe, procede a registrar al usuario
    try {
        await axios.post(`${API_URL}/usuarios/`, formData);
        await Swal.fire({
            title: "Éxito",
            text: "Usuario registrado exitosamente.",
            icon: "success",
            iconColor: "#FFD700", // Dorado brillante para el ícono
            background: "rgba(244, 244, 244, 0.9)", // Fondo gris claro semitransparente
            color: "#333333",
            timer: 5000,
            timerProgressBar: true,
            showConfirmButton: false,
            customClass: {
            popup: "rounded-lg border-2 border-yellow-300 shadow-md animate_animated animate_fadeInDown", // Animación de entrada
            title: "text-lg font-semibold text-yellow-700",
            timerProgressBar: "bg-yellow-400" // Barra de progreso dorada
            }
        });
        navigate('/');  // Redirige a la página de inicio
    } catch (error) {
        console.error('Error registrando usuario:', error);
        // Verifica si el error es por duplicado
        if (error.response && error.response.data) {
            const errorMessage = error.response.data.message;
            await Swal.fire({
                title: "Error",
                text: errorMessage.includes('Duplicate entry') 
                    ? 'El documento o el correo ya están registrados.'
                    : 'Ocurrió un error al registrar el usuario. Inténtalo de nuevo más tarde.',
                icon: "error",
            });
        }
    }
};


  
  const [mostrarModal, setMostrarModal] = useState(false); // Estado para controlar el modal
  


  // Funciones para manejar el modal
  const manejarAceptarTerminos = () => {
    setMostrarModal(false); // Cierra el modal
    setFormData({ ...formData, aceptaTerminos: true }); // Marca el checkbox de aceptación
  };

  const manejarCancelarTerminos = () => {
    setMostrarModal(false); // Cierra el modal sin aceptar los términos
  };


  return (
  <div>
    <meta charSet="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/png" href="https://i.ibb.co/gj0Bpcc/logo-empresa-mila.png" />
    <title>Pagina de Registro -- Mila GastroFusion</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Lato:wght@400;700&display=swap" rel="stylesheet" />
    <link href="https://cdn.tailwindcss.com" rel="stylesheet" />
    <link rel="stylesheet" type="text/css" href="../estilos/estilos_barra.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
    <style>
      {`.espacio_imagen1 {background: linear-gradient(rgba(2,2,2,.7),rgba(0,0,0,.7)),url(https://i.ibb.co/Ny3wdG7/Y-si-empezamos-nuestra-semana-con-un-almuerzo-en-Mila.jpg) center center;}
        .imagen_formulario {background: linear-gradient(rgba(2, 2, 2, .7), rgba(0, 0, 0, .7)),url(https://i.ibb.co/nRVNh1H/En-mila-nuestras-tardes-se-ven-asi-ya-nos-conoces.jpg) center center;}
        body {font-family: 'Lato', sans-serif;}`}                                                                              
    </style>
    <div className="h-screen flex flex-col lg:flex-row mt-0  mb-6" style={{ height:'150%' }} >
      <div className="hidden lg:flex w-full lg:w-1/2 espacio_imagen1 justify-around items-center ">
      <div className="bg-black opacity-20 inset-0 z-0" />
      <div className="w-full mx-auto px-6 lg:px-16 flex-col items-center space-y-6 mb-4">
        <h1 className="text-white font-bold text-4xl font-sans ml-8 lg:ml-28 font-normal text-yellow-300">Beneficios de Registrarse</h1>
        <ul className="text-white list-none list-inside text-xl font-normal ml-8 lg:ml-28">
          <li><i className="fa-solid fa-check" style={{ color: '#FFD43B', marginRight: '3%' }} /> Invitaciones a Eventos Especiales</li>
          <li><i className="fa-solid fa-check" style={{ color: '#FFD43B', marginRight: '3%' }} /> Notificaciones y Recordatorios</li>
          <li><i className="fa-solid fa-check" style={{ color: '#FFD43B', marginRight: '3%' }} /> Podrás realizar tus reservas y cotizaciones</li>
          <li><i className="fa-solid fa-check" style={{ color: '#FFD43B', marginRight: '3%' }} /> Realizaras mas rapido tus pedidos </li>
        </ul>
        </div>
        </div>
        
        <div className="flex w-full lg:w-1/2 justify-center items-center imagen_formulario p-4 lg:p-6">
        <div className="w-full max-w-lg lg:max-w-2xl px-4 lg:px-6 bg-white rounded-lg shadow-lg p-4 space-y-4 overflow-hidden">
          <form onSubmit={subir} className="space-y-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <h1 className="text-gray-800 font-bold text-2xl col-span-2 text-center mb-0">¡Regístrate!</h1>
            <p className="text-xs font-normal text-gray-600 col-span-2 text-center mt-0">Ingresa tus datos personales</p>
            {/* Nombre */}
            <div className="flex flex-col space-y-1 relative">
              <label htmlFor="nombre" className="text-gray-700 font-semibold text-xs">Nombre</label>
              <div className="relative">
                <i className="fa-solid fa-user absolute left-2 top-2/4 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="nombre"
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  onInput={(e) => e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '')}
                  minLength={4}
                  maxLength={15}
                  pattern="^[A-Za-z\s]+$"
                  title="Solo letras, entre 4 y 15 caracteres"
                  className="pl-10 pr-2 border-2 border-yellow-300 py-1 rounded-lg text-sm outline-none focus:border-yellow-600 w-full"
                  required
                  autoFocus
                />
              </div>
              </div>

              {/* Apellido */}
              <div className="flex flex-col space-y-1 relative">
              <label htmlFor="apellido" className="text-gray-700 font-semibold text-xs">Apellido</label>
              <div className="relative">
                <i className="fa-solid fa-user-tag absolute left-3 top-2/4 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="apellido"
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  onInput={(e) => e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '')}
                  minLength={4}
                  maxLength={20}
                  pattern="^[A-Za-z\s]+$"
                  title="Solo letras, entre 4 y 20 caracteres"
                  className="pl-12 pr-2 border-2 border-yellow-300 py-1 rounded-lg text-sm outline-none focus:border-yellow-600 w-full"
                  required
                />
              </div>
              </div>

              {/* Celular */}
              <div className="flex flex-col space-y-1 relative">
              <label htmlFor="telefono" className="text-gray-700 font-semibold text-xs">Celular</label>
              <div className="relative">
                <i className="fa-solid fa-phone absolute left-2 top-2/4 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="telefono"
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10)}
                  maxLength={10}
                  pattern="^3\d{9}$"
                  title="Número de teléfono de 10 dígitos que comience con 3"
                  className="pl-10 pr-2 border-2 border-yellow-300 py-1 rounded-lg text-sm outline-none focus:border-yellow-600 w-full"
                  required
                />
              </div>
              </div>

              {/* Email */}
              <div className="flex flex-col space-y-1 relative">
              <label htmlFor="correo" className="text-gray-700 font-semibold text-xs">Email</label>
              <div className="relative">
                <i className="fa-solid fa-envelope absolute left-2 top-2/4 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="correo"
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  onInput={(e) => {
                    const value = e.target.value;
                    if (value.length > 55) {
                      e.target.value = value.slice(0, 55);
                    }
                  }}
                  minLength={5}
                  maxLength={55}
                  pattern=".{15,55}"
                  title="El correo debe tener entre 15 y 55 caracteres"
                  className="pl-10 pr-2 border-2 border-yellow-300 py-1 rounded-lg text-sm outline-none focus:border-yellow-600 w-full"
                  required
                />
              </div>
              </div>

              {/* Tipo de Documento */}
              <div className="flex flex-col space-y-1 relative">
              <label htmlFor="tipo_documento" className="text-gray-700 font-semibold text-xs">Tipo de Documento</label>
              <select
                id="tipo_documento"
                name="tipo_documento"
                value={formData.tipo_documento}
                onChange={handleChange}
                required
                className="border-2 border-yellow-300 py-1 rounded-lg text-sm outline-none focus:border-yellow-600 w-full"
              >
                <option value="Cedula de ciudadania">Cédula de Ciudadanía</option>
                <option value="Cedula de extranjeria">Cédula de Extranjería</option>
              </select>
              </div>

              {/* Número de Documento */}
              <div className="flex flex-col space-y-1 relative">
              <label htmlFor="numero_documento" className="text-gray-700 font-semibold text-xs">Número de Documento</label>
              <div className="relative">
                <i className="fa-solid fa-id-card absolute left-2 top-2/4 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="numero_documento"
                  type="text"
                  name="numero_documento"
                  value={formData.numero_documento}
                  onChange={(e) => {
                    handleChange(e);
                    const tipoDocumento = formData.tipo_documento;
                    if (tipoDocumento === 'Cedula de extranjeria') {
                      validateNumeroDocumento(e.target.value, tipoDocumento);
                    }
                  }}
                  onInput={(e) => {
                    const tipoDocumento = formData.tipo_documento;
                    let value = e.target.value;

                    if (tipoDocumento === 'Cedula de extranjeria') {
                      value = value.replace(/[^A-Z0-9]/gi, '').slice(0, 12);
                    } else {
                      value = value.replace(/[^0-9]/g, '').slice(0, 12);
                    }

                    e.target.value = value;
                  }}
                  minLength={8}
                  maxLength={12}
                  pattern={formData.tipo_documento === 'Cedula de extranjeria' ? '[A-Z0-9]{7,12}' : '[0-9]{8,12}'}
                  title={formData.tipo_documento === 'Cedula de extranjeria' ? 'Número de documento válido entre 7 y 12 caracteres alfanuméricos' : 'Número de documento válido entre 8 y 12 dígitos'}
                  className="pl-10 pr-2 border-2 border-yellow-300 py-1 rounded-lg text-sm outline-none focus:border-yellow-600 w-full"
                  required
                />
              </div>
              </div>

              {/* Dirección */}
              <div className="flex flex-col space-y-1 relative">
              <label htmlFor="direccion" className="text-gray-700 font-semibold text-xs">Dirección</label>
              <div className="relative">
                <i className="fa-solid fa-home absolute left-2 top-2/4 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="direccion"
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  onInput={(e) => e.target.value = e.target.value.replace(/[^a-zA-Z0-9\s#.-]/g, '')}
                  maxLength={50}
                  className="pl-10 pr-2 border-2 border-yellow-300 py-1 rounded-lg text-sm outline-none focus:border-yellow-600 w-full"
                  required
                />
              </div>
              </div>

              {/* Barrio */}
              <div className="flex flex-col space-y-1 relative">
              <label htmlFor="barrio" className="text-gray-700 font-semibold text-xs">Barrio</label>
              <div className="relative">
                <i className="fa-solid fa-map-marker-alt absolute left-2 top-2/4 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="barrio"
                  type="text"
                  name="barrio"
                  value={formData.barrio}
                  onChange={handleChange}
                  onInput={(e) => e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, '')}
                  maxLength={30}
                  className="pl-10 pr-2 border-2 border-yellow-300 py-1 rounded-lg text-sm outline-none focus:border-yellow-600 w-full"
                  required
                />
              </div>
              </div>
             {/* CONTRASEÑA */}
<div className="flex flex-col space-y-1 relative">
  <label htmlFor="contrasena" className="text-gray-700 font-semibold text-xs">
    Contraseña
  </label>
  <div className="flex items-start space-x-4">
    <div className="relative flex-1">
      <i 
        className={`fa-solid ${mostrarContrasena ? 'fa-eye-slash' : 'fa-eye'} absolute left-2 top-2/4 transform -translate-y-1/2 text-gray-400 cursor-pointer`} 
        onClick={() => setMostrarContrasena(!mostrarContrasena)}
      />
      <input
        id="contrasena"
        name="contrasena"
        value={formData.contrasena}
        onChange={handleChange}
        minLength={6}
        maxLength={10}
        pattern=".{6,10}"
        title="La contraseña debe tener entre 6 y 10 caracteres"
        className={`pl-10 pr-2 border-2 ${formData.contrasena === formData.contrasena ? 'border-yellow-300' : 'border-red-500'} py-1 rounded-lg text-sm outline-none focus:border-yellow-600 w-full`}
        required
      />
    </div>
  </div><br></br><br></br>

  {/* Texto ¿Ya tienes una cuenta? */}
  <p className="text-sm text-center mt-4">
    ¿Ya tienes una cuenta?{' '}
    <a href="/login" className="text-yellow-500 font-semibold hover:underline flex items-center justify-center">
      <i className="fa-solid fa-sign-in-alt mr-2"></i> Ingresa aquí
    </a>
  </p>
</div>


{/* Requisitos de la contraseña */}
<div className="flex flex-col text-xs text-gray-800 mt-1">
  <p className="font-semibold text-sm">Requisitos de la contraseña:</p>
  <ul className="list-disc pl-4 space-y-1">
    <li className={`text-xs ${requisitos.longitudValida ? 'text-green-500' : 'text-red-500'}`}>
      Entre 6 y 10 caracteres.
    </li>
    <li className={`text-xs ${requisitos.contieneLetras ? 'text-green-500' : 'text-red-500'}`}>
      Incluir letras.
    </li>
    <li className={`text-xs ${requisitos.contieneNumeros ? 'text-green-500' : 'text-red-500'}`}>
      Incluir números.
    </li>
    <li className={`text-xs ${requisitos.contieneSimbolos ? 'text-green-500' : 'text-red-500'}`}>
      Incluir símbolos.
    </li>
    <li className={`text-xs ${requisitos.contieneMayuscula ? 'text-green-500' : 'text-red-500'}`}>
      Incluir al menos una letra mayúscula.
    </li>
  </ul>
</div>

            
            {/* Checkbox de aceptación de términos */}
            <div className="flex items-center space-x-2 mt-10-">
              <input
              id="aceptaTerminos"
              type="checkbox"
              name="aceptaTerminos"
              checked={formData.aceptaTerminos}
              onChange={handleChange}
              className="form-checkbox h-4 w-4 text-yellow-600"
              />
              <label htmlFor="aceptaTerminos" className="text-gray-700 text-sm">
              Acepto los{' '}
              <button type="button" onClick={() => setMostrarModal(true)} className="text-yellow-500 underline">
                términos y condiciones
              </button>
              </label>
            </div>
            
            <button
              type="submit"
              disabled={!formData.aceptaTerminos}
              className={`bg-yellow-500 text-white py-2 px-12 rounded-lg font-semibold text-sm mx-auto ${!formData.aceptaTerminos ? 'opacity-60 cursor-not-allowed' : ''}`}>
              Registrarse
            </button>
          </form>
            </div>
        </div>
      </div>

      {/* Modal */}
      {mostrarModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-1/2 lg:w-1/3 ml-20 " style={{ width:'45%' }}>
            <h2 className="text-lg font-bold mb-4">Términos y Condiciones</h2>
            <p className="text-sm mb-4">Al utilizar este sistema, aceptas los siguientes términos y condiciones:</p>
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

    </div>
  );
};

export default FormularioRegistro;
