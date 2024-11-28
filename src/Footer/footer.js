import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSeedling, faUsers, faClock, faEnvelope, faDoorClosed, faCommentDots, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faInstagram, faTiktok } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  const messagesEndRef = useRef(null);
  const [chatVisible, setChatVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');

  const responses = {
    hola: "¡Hola! 👋 Bienvenido a Mila Gastro Bar. ¿En qué puedo ayudarte hoy?",
    tardes: "¡Hola! 👋 Bienvenido a Mila Gastro Bar. ¿En qué puedo ayudarte hoy?",
    dias: "¡Hola! 👋 Bienvenido a Mila Gastro Bar. ¿En qué puedo ayudarte hoy?",
    dias: "¡Hola! 👋 Bienvenido a Mila Gastro Bar. ¿En qué puedo ayudarte hoy?",
    noches: "¡Hola! 👋 Bienvenido a Mila Gastro Bar. ¿En qué puedo ayudarte hoy?",
    estas: "¡Hola! 👋 Bienvenido a Mila Gastro Bar. ¿En qué puedo ayudarte hoy?",
    esta: "¡Hola! 👋 Bienvenido a Mila Gastro Bar. ¿En qué puedo ayudarte hoy?",
    horarios: "Nuestros horarios son: Lunes: Cerrado, Martes-Miércoles: 9:00 AM - 10:00 PM, Jueves-Viernes: 9:00 AM - 11:00 PM, Sábado-Domingo: 10:00 AM - 11:00 PM. ¡Te esperamos!",
    menu: "Aquí puedes descargar nuestro menú: <a href='https://www.dropbox.com/scl/fi/o7rt5nrs30r4tbt6x4fje/menu.pdf?rlkey=b6m8h989a73z3y3fnclkuagne&st=ktg0961a&dl=0' target='_blank' class='text-blue-600 underline'>Descargar Menú</a>.",
    contacto: "Puedes contactarnos a través de nuestras redes sociales o llamando al número: 321286.",
    ubicacion: "Estamos ubicados en Kr 13 #52-10, Bogotá, Colombia. ¡Te esperamos!",
    adios: "Gracias por visitarnos. ¡Esperamos verte pronto! 😊",
    bye: "Gracias por visitarnos. ¡Esperamos verte pronto! 😊",
    hasta: "Gracias por visitarnos. ¡Esperamos verte pronto! 😊",
    bienvenida: "¡Bienvenido a Mila! ¿Te gustaría saber más sobre nuestros platos o hacer una reserva?",
    agradecimiento: "¡Gracias por tu interés! Si necesitas más información, no dudes en preguntar.",
    promocion: "No te pierdas nuestras ofertas especiales. Síguenos en nuestras redes para enterarte de todo.",
    feedback: "¡Nos encantaría saber tu opinión! Déjanos un comentario y cuéntanos qué te ha parecido tu experiencia con nosotros.",
    reservas: "Para hacer una reserva, por favor indícanos la fecha, hora y el número de personas. ¡Te esperamos!",
    bienvenida_noche: "¡Buenas noches! 🌙 ¿En qué te podemos ayudar esta noche en Mila?",
    bienvenida_dia: "¡Buenos días! ☀️ Estamos listos para atenderte. ¿Cómo podemos ayudarte hoy?",
    disculpas: "Lo siento mucho, parece que no entendí tu pregunta. ¿Puedes intentar de nuevo?",
    fecha_error: "Parece que la fecha que has ingresado no es válida. ¿Puedes verificarla y probar de nuevo?",
    gracias_comentario: "¡Gracias por dejar tu comentario! Lo tendremos en cuenta para seguir mejorando.",
    menu_bebidas: "Aquí te dejo nuestra carta de bebidas: <a href='https://www.dropbox.com/scl/fi/xyz123/carta_bebidas.pdf' target='_blank' class='text-blue-600 underline'>Carta de Bebidas</a>.",
    menu_platos: "Aquí te dejo nuestra carta de platos: <a href='https://www.dropbox.com/scl/fi/xyz123/carta_platos.pdf' target='_blank' class='text-blue-600 underline'>Carta de Platos</a>.",
    mensaje_reserva_confirmada: "¡Tu reserva ha sido confirmada! Nos vemos el [fecha] a las [hora].",
    pregunta_plato_favorito: "¿Te gustaría saber más sobre algún plato en específico o nuestras especialidades?",
    saludo_cumpleanos: "¡Feliz cumpleaños! 🎉 Esperamos que tengas un día increíble, y si decides celebrar con nosotros, estaremos encantados de recibirte.",
    recomendacion_plato: "Te recomendamos probar nuestro [nombre del plato], es uno de los favoritos de nuestros clientes. ¡Seguro te encantará!",
    informativo_oferta: "Tenemos un 20% de descuento en todos los platos los martes y miércoles. ¡No te lo puedes perder!",
    disponibilidad_mesa: "Por el momento, tenemos disponibilidad para [número] personas en las siguientes franjas horarias: [horarios disponibles]. ¿Te gustaría hacer una reserva?",
    promociones_redes: "¡Síguenos en nuestras redes sociales para enterarte de nuestras promociones y eventos especiales! 📱",
    celebracion_evento: "¡Tenemos espacios disponibles para celebraciones y eventos privados! ¿Te gustaría saber más?",
    menu_vegetariano: "Contamos con una selección de platos vegetarianos. Aquí puedes ver más: <a href='https://www.dropbox.com/scl/fi/xyz123/menu_vegetariano.pdf' target='_blank' class='text-blue-600 underline'>Menú Vegetariano</a>.",
    menu_gluten_free: "Para nuestros clientes con intolerancia al gluten, ofrecemos opciones sin gluten. Descúbrelas aquí: <a href='https://www.dropbox.com/scl/fi/xyz123/menu_gluten_free.pdf' target='_blank' class='text-blue-600 underline'>Menú Sin Gluten</a>.",
    informativo_nuevos_platos: "¡Acabamos de agregar nuevos platos a nuestro menú! Ven a probarlos y déjanos saber qué te parecen.",
    detalles_evento: "Si estás organizando un evento, cuéntanos más sobre lo que necesitas y te ayudaremos a organizar todo.",
    recomendacion_postre: "Si te gustan los postres, no te puedes perder nuestro [nombre del postre]. ¡Es la manera perfecta de terminar tu comida!",
    horario_lunes: "Los lunes estamos cerrados, pero estaremos encantados de verte el martes a partir de las 9:00 AM.",
    saludo_positivo: "¡Nos alegra saber que estás contento! 😊 ¿Cómo más podemos ayudarte hoy?",
    saludo_negativo: "Lamentamos mucho que no hayas tenido una buena experiencia. Si hay algo que podamos hacer para mejorar, por favor háznoslo saber.",
    saludo_reserva: "¿Estás listo para hacer una reserva o necesitas ayuda con algo más?",
    ayuda_general: "Estoy aquí para ayudarte con cualquier duda que tengas. ¿Te gustaría saber más sobre el menú, reservas o algo más?"
};

  const toggleChatbot = () => {
    setChatVisible(!chatVisible);
    if (!chatVisible) {
      setMessages(["Chatbot: ¡Hola! Me puedes preguntar sobre nuestros horarios, menú, contacto, ubicación y más."]);
    }
  };

  const sendMessage = () => {
    if (!userInput) return;

    const newMessages = [...messages, `Tú: ${userInput}`];
    setMessages(newMessages);
    const lowerCaseMessage = userInput.toLowerCase();

    const closeKeywords = ["adiós", "hasta luego", "hasta pronto", "chao", "bye"];
    if (closeKeywords.some(keyword => lowerCaseMessage.includes(keyword))) {
      setMessages([]);
      setChatVisible(false);
      setUserInput('');
      return;
    }

    let response = "Lo siento, no tengo una respuesta para eso.";
    for (const key in responses) {
      if (lowerCaseMessage.includes(key)) {
        response = responses[key];
        break;
      }
    }

    newMessages.push(`Chatbot: ${response}`);
    setMessages(newMessages);
    setUserInput('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <footer className="text-center text-lg-start text-gray-800 bg-[#fff8e7] py-6 relative">
      <section className="container mx-auto text-center mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-6 border-t border-gray-300 pt-6">
          <article className="mb-4">
            <h6 className="text-xl font-bold text-[#d4af37] uppercase flex items-center justify-center">
              <FontAwesomeIcon icon={faSeedling} className="text-[#d4af37] mr-2" /> Por qué nosotros?
            </h6>
            <hr className="my-4 mx-auto w-32 border-[#d4af37] border-2" />
            <p className="text-gray-600 leading-relaxed">
              Ingredientes frescos, sostenibilidad y una experiencia gourmet en un entorno acogedor.
              Innovación y personalización en cada plato.
            </p>
          </article>
          <aside className="mb-4">
            <h6 className="text-xl font-bold text-[#d4af37] uppercase flex items-center justify-center">
              <FontAwesomeIcon icon={faUsers} className="text-[#d4af37] mr-2" /> Síguenos
            </h6>
            <hr className="my-4 mx-auto w-32 border-[#d4af37] border-2" />
            <ul className="space-y-4">
              <li className="flex flex-col items-center">
                <a href="https://www.facebook.com/MilaGastroFusion/" target="_blank" rel="noopener noreferrer" aria-label="Facebook de Mila" className="text-black hover:text-gray-600 transition flex items-center justify-center space-x-2">
                  <FontAwesomeIcon icon={faFacebook} className="text-3xl text-[#3b5998]" />
                  <span className="text-lg font-bold">Facebook</span>
                </a>
              </li>
              <li className="flex flex-col items-center">
              <a href="https://www.instagram.com/milagastrofusion/" target="_blank" rel="noopener noreferrer" aria-label="Instagram de Mila" className="text-black hover:text-gray-600 transition flex items-center justify-center space-x-2">
                  <FontAwesomeIcon icon={faInstagram} className="text-3xl text-[#e1306c]" />
                  <span className="text-lg font-bold">Instagram</span>
              </a>
            </li>
            <li className="flex flex-col items-center">
                <a href="https://www.tiktok.com/@milagastrobar?lang=es" target="_blank" rel="noopener noreferrer" aria-label="TikTok de Mila" className="text-black hover:text-gray-600 transition flex items-center justify-center space-x-2">
                    <FontAwesomeIcon icon={faTiktok} className="text-3xl text-black" />
                    <span className="text-lg font-bold">TikTok</span>
                </a>
            </li>
            </ul>
          </aside>
          <div className="mb-4">
            <h6 className="text-xl font-bold text-[#d4af37] uppercase flex items-center justify-center">
              <FontAwesomeIcon icon={faClock} className="text-[#d4af37] mr-2" /> Horarios
            </h6>
            <hr className="my-4 mx-auto w-32 border-[#d4af37] border-2" />
            <div className="flex flex-col space-y-3">
              <p className="flex items-center justify-center">
                <FontAwesomeIcon icon={faDoorClosed} className="mr-2" /> <span className="font-bold">Lunes:</span> Cerrado
              </p>
              <p className="flex items-center justify-center">
                <FontAwesomeIcon icon={faClock} className="mr-2" /> <span className="font-bold">Martes - Miércoles:</span> 9:00 AM - 10:00 PM
              </p>
              <p className="flex items-center justify-center">
                <FontAwesomeIcon icon={faClock} className="mr-2" /> <span className="font-bold">Jueves - Viernes:</span> 9:00 AM - 11:00 PM
              </p>
              <p className="flex items-center justify-center">
                <FontAwesomeIcon icon={faClock} className="mr-2" /> <span className="font-bold">Sábado - Domingo:</span> 10:00 AM - 11:00 PM
              </p>
            </div>
          </div>
          <div className="mb-4">
            <h6 className="text-xl font-bold text-[#d4af37] uppercase flex items-center justify-center">
              <FontAwesomeIcon icon={faEnvelope} className="text-[#d4af37] mr-2" /> Contacto
            </h6>
            <hr className="my-4 mx-auto w-32 border-[#d4af37] border-2" />
            <p className="text-gray-600 flex items-center justify-center">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" /> Carrera 13 #52 - 10, Bogotá, Colombia
            </p>
            <h6 className="text-lg font-bold text-[#d4af37] mt-4">¡Haz tu comentario!</h6>
            <p className="text-gray-600">Tus opiniones son importantes para nosotros.</p>
            <div className="flex justify-center mt-2">
              <a href="/pagina-de-comentarios" className="bg-[#d4af37] text-white py-2 px-4 rounded hover:bg-[#b39e28] transition duration-200">Deja tu comentario</a>
            </div>
          </div>
        </div>
        <div className="text-center mt-7 border-t border-gray pt-4 text-sm text-[#333333] bg-yellow-200 py-4">
           <b>© 2024 Mila Gastrobar.</b> Todos los derechos reservados.
         </div>
      </section>
      {/* Botón del chatbot dentro del footer */}
      <button className="absolute bottom-24 left-20 bg-[#d4af37] p-4 rounded-full shadow-lg hover:bg-[#b39e28] transition" onClick={toggleChatbot}>
  <FontAwesomeIcon icon={faCommentDots} className="text-white" />
</button>

      {/* Chatbot */}
      {chatVisible && (
        <div className="fixed bottom-20 left-8 bg-[#f9f9f9] shadow-xl rounded-lg w-80 max-h-96 overflow-hidden border border-[#d4af37] flex flex-col">
        <div className="p-4 border-b border-gray-300 flex-shrink-0"> {/* Se añade flex-shrink-0 para evitar que se reduzca */}
          <h3 className="text-lg font-bold text-[#d4af37] mb-2">Chatbot</h3>
          <button className="absolute top-2 right-2 text-gray-500" onClick={() => setChatVisible(false)}>
            &times;
          </button>
        </div>
        <div className="flex-1 overflow-auto"> {/* Este contenedor se expandirá */}
          {/* Aquí puedes agregar el contenido del chatbot, como mensajes */}
        </div>
          <div className="p-4 h-72 overflow-y-auto">
            {messages.map((message, index) => (
              <div key={index} className={`my-2 ${message.startsWith('Tú:') ? 'text-right' : 'text-left'}`}>
                <span className={`inline-block p-2 rounded ${message.startsWith('Tú:') ? 'bg-[#d4af37] text-white' : 'bg-gray-200'}`}>
                  {message.startsWith("Chatbot:") ? <span dangerouslySetInnerHTML={{ __html: message.replace("Descargar Menú", "Descargar Menú") }} /> : message}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} /> {/* Paso 3: Referencia al final del contenedor */}
          </div>
          <div className="p-4 border-t border-gray-300 flex">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Escribe tu mensaje..."
              className="flex-1 border rounded-l px-2 py-1"
            />
            <button onClick={sendMessage} className="bg-[#d4af37] text-white px-4 rounded-r hover:bg-[#b39e28] transition">
              Enviar
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
