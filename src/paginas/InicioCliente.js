import React, { useEffect, useState} from "react";
import '../index.css';
import BarraNormal from "../componentes/barras/Barra_Normal";
import CardSlider from "../cards/cards";
import '@fortawesome/fontawesome-free/css/all.min.css';


const Index = () => {
  // Datos del carrusel
  const images = [
    'https://media.istockphoto.com/id/1427778211/es/foto/comida-de-camarones-de-alta-cocina-en-el-plato.jpg?s=612x612&w=0&k=20&c=64-42xcRzHopOTV4NBo8mYCqdJpbs_v6z7K2JMhVNwY=',
    'https://images.unsplash.com/photo-1457666134378-6b77915bd5f2?q=80&w=1934&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1712247452824-4c98e36925cc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1571870251082-d965ef9e7530?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://media.istockphoto.com/id/911843812/es/foto/sald-delicioso-con-acelga-hojas-rodajas-de-remolacha-y-pomelo.jpg?s=612x612&w=0&k=20&c=S0Pl6uOnlvqQBgOIMY0LRYoN0aIIEceBIMOH1RuurEI='
  ];

  const texts = [
    '¡Descubre los sabores únicos de Mila! Cada plato es una experiencia gastronómica inolvidable.',
    'Disfruta de una cena elegante en nuestro gastro bar con una selección de vinos exclusivos.',
    'Nuestra cocina innovadora fusiona ingredientes frescos para crear platillos sorprendentes.',
    'Ven y prueba nuestras deliciosas tapas, perfectas para compartir en un ambiente acogedor.',
    'En Mila, cada comida es una celebración. ¡Reserva tu mesa y vive una experiencia culinaria excepcional!'
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  const next = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const back = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const startAutoSlide = () => {
    const id = setInterval(next, 4000);
    setIntervalId(id);
  };

  const stopAutoSlide = () => {
    clearInterval(intervalId);
    setIntervalId(null);
  };

  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide(); // Limpiar intervalo al desmontar
  }, []);


  return (
  <div className="-mt-20">
    {/* Renderiza la barra de navegación correspondiente */}
    <BarraNormal />
    
    {/* CARRUSEL ------------------------------------------------------------------------------------------------------------------------------------------------------*/}
    <article
    onMouseOver={stopAutoSlide}
    onMouseLeave={startAutoSlide}
    className="relative w-full h-[500px] overflow-hidden shadow-2xl ">
      {images.map((image, index) => (
        <figure key={index} className={`absolute inset-0 w-11/12 h-full mx-auto ${currentIndex === index ? 'block' : 'hidden'}`}>
          <img src={image} alt="carrusel" className="w-full h-full object-cover" />
          <figcaption className="absolute inset-x-0 bottom-0 bg-gray-900 bg-opacity-60 text-white p-4 text-center text-sm">
            <p>{texts[index]}</p>
          </figcaption>
        </figure>
      ))}
      
      {/* Botones navegación carrusel */}
      <button onClick={back} className="absolute left-5 top-1/2 -translate-y-1/2 bg-yellow-300 hover:bg-yellow-200 rounded-full p-6">
      <svg className="w-6 h-6 text-black-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
      
      <button onClick={next} className="absolute right-5 top-1/2 -translate-y-1/2 bg-yellow-300 hover:bg-yellow-200 rounded-full p-6">
      <svg className="w-6 h-6 text-back-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
      
      {/* Indicadores en la parte inferior */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-2">
        {images.map((_, index) => (
          <span key={index} 
            onClick={() => setCurrentIndex(index)} 
            className={`w-3 h-3 rounded-full cursor-pointer ${currentIndex === index ? 'bg-yellow-500' : 'bg-gray-400'}`}> 
          </span>
        ))}
      </div>
    </article>
    
    {/* SERVICIOS -----------------------------------------------------------------------------------------------------------------------------------------------------*/}
    <div className="container mx-auto pt-5" id="servicios">
      <div className="relative text-center py-[115px] pb-[35px]">
        <h5 className="tracking-widest text-yellow-500"><b>Nuestros Servicios</b></h5>
        <h1 className="text-4xl font-bold hover:text-yellow-500 transition-colors duration-300"><b>Comida Fresca & Natural</b></h1>
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[2px] h-[100px] bg-[#DA9F5B]"></div>
      </div>
      <div className="flex flex-wrap -mx-4">
        
        {/* Organización de eventos */}
        <div className="w-full lg:w-1/2 px-4 mb-5 transition-transform duration-300 ease-in-out transform hover:scale-105">
          <div className="flex items-center">
            <div className="w-2/5">
              <img className="w-full mb-2 lg:mb-0 transition-transform duration-300 ease-in-out hover:scale-105 hover:border-2 hover:border-yellow-400 rounded-lg" src="https://i.ibb.co/k4BnvTc/service-1-2.jpg" alt="Organización de Eventos" />
            </div>
            <div className="w-3/5 pl-4">
              <h4 className="text-xl mb-2"><i className="fas fa-birthday-cake service-icon text-[#b5944f]"></i> Organización de Eventos</h4>
              <p className="m-0 transition-transform duration-300 ease-in-out hover:scale-105 hover:text-gray-700">En Mila, ofrecemos un servicio de organización de eventos para hacer de tu ocasión especial un momento inolvidable. Nos encargamos de todos los detalles para que tú puedas disfrutar.</p>
            </div>
          </div>
        </div>
        
        {/* Reservas */}
        <div className="w-full lg:w-1/2 px-4 mb-5 transition-transform duration-300 ease-in-out transform hover:scale-105">
          <div className="flex items-center">
            <div className="w-2/5">
              <img className="w-full mb-3 lg:mb-0 transition-transform duration-300 ease-in-out hover:scale-105 hover:border-2 hover:border-yellow-400 rounded-lg" src="https://i.ibb.co/XX5gPhT/service-2-1.jpg" alt="Reservas" />
            </div>
            <div className="w-3/5 pl-4">
              <h4 className="text-xl mb-2"><i className="fas fa-calendar-check service-icon text-[#b5944f]"></i> Reservas</h4>
              <p className="m-0 transition-transform duration-300 ease-in-out hover:scale-105 hover:text-gray-700">Facilitamos el proceso de reservas para que siempre tengas un lugar en nuestro restaurante. Ya sea para una cena con tu pareja o una reunión familiar, puedes reservar con antelación.</p>
            </div>
          </div>
        </div>
        
        {/* Pedidos */}
        <div className="w-full lg:w-1/2 px-4 mb-5 transition-transform duration-300 ease-in-out transform hover:scale-105">
          <div className="flex items-center">
            <div className="w-2/5">
              <img className="w-full mb-3 lg:mb-0 transition-transform duration-300 ease-in-out hover:scale-105 hover:border-2 hover:border-yellow-400 rounded-lg" src="https://i.ibb.co/sQJ2C9b/service-3-1.jpg" alt="Pedidos" />
            </div>
            <div className="w-3/5 pl-4">
              <h4 className="text-xl mb-2"><i className="fas fa-shopping-cart service-icon text-[#b5944f]"></i> Pedidos</h4>
              <p className="m-0 transition-transform duration-300 ease-in-out hover:scale-105 hover:text-gray-700">Realiza tus pedidos de manera rápida y sencilla a través de nuestro sistema en línea. Ofrecemos un servicio eficiente para que disfrutes de tus comidas favoritas sin complicaciones.</p>
            </div>
          </div>
        </div>
        
        {/* Disfruta con la Familia */}
        <div className="w-full lg:w-1/2 px-4 mb-5 transition-transform duration-300 ease-in-out transform hover:scale-105">
          <div className="flex items-center">
            <div className="w-2/5">
              <img className="w-full mb-3 lg:mb-0 transition-transform duration-300 ease-in-out hover:scale-105 hover:border-2 hover:border-yellow-400 rounded-lg" src="https://i.ibb.co/5x7QT98/service-4-1.jpg" alt="Disfruta con la Familia" />
            </div>
            <div className="w-3/5 pl-4">
              <h4 className="text-xl mb-2"><i className="fas fa-users service-icon text-[#b5944f]"></i> Disfruta con la Familia</h4>
              <p className="m-0 transition-transform duration-300 ease-in-out hover:scale-105 hover:text-gray-700">Nuestro compromiso es ofrecerte los mejores productos para que disfrutes con tu familia. Cada plato está elaborado con ingredientes frescos y de calidad.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* ESTRATEGIA ORGANIZACIONAL MILA ------------------------------------------------------------------------------------------------------------------------------- */}
<div className="container mx-auto py-5" id="nosotrosbarra">
  <div className="relative text-center py-[115px] pb-[35px]">
    <h4 className="tracking-widest text-yellow-500"><b>Sobre Nosotros</b></h4>
    <h1 className="text-4xl font-bold hover:text-yellow-500 transition-colors duration-300"><b>Sirviendo desde 2018</b></h1>
    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[2px] h-[100px] bg-[#DA9F5B]"></div>
  </div>
  <div className="flex flex-col lg:flex-row">
    {/* Misión */}
    <div className="w-full lg:w-1/3 px-4 py-5 transition-transform duration-300 ease-in-out transform hover:scale-105">
      <h1 className="text-2xl mb-3 hover:text-yellow-500">Nuestra Misión</h1>
      <p className="transition-all duration-300 ease-in-out hover:text-gray-700">
        En Luz Mila gastro fusión, nuestra misión es ofrecer una experiencia gastronómica única que combina la tradición culinaria con la innovación moderna. Nos comprometemos a utilizar ingredientes frescos y locales, preparados con pasión y creatividad, para deleitar a nuestros clientes con platos que celebran la riqueza de la cocina regional e internacional. Buscamos crear un ambiente acogedor y sofisticado donde cada visita sea memorable y cada plato cuente una historia.
      </p>
    </div>

    {/* Imagen */}
    <div className="w-full lg:w-1/3 px-4 py-5 relative overflow-hidden rounded-lg">
      <img className="w-full h-auto object-cover transform transition-transform duration-300 ease-in-out hover:scale-110" src="https://i.ibb.co/ryV7zTy/about-1.png" alt="Sobre Nosotros" />
    </div>

    {/* Visión */}
    <div className="w-full lg:w-1/3 px-4 py-5 transition-transform duration-300 ease-in-out transform hover:scale-105">
      <h1 className="text-2xl mb-3 hover:text-yellow-500">Nuestra Visión</h1>
      <p className="transition-all duration-300 ease-in-out hover:text-gray-700">
        Ser reconocidos como el gastrobar de referencia en nuestra comunidad, famoso por nuestra cocina excepcional, nuestro servicio al cliente impecable y nuestro compromiso con la sostenibilidad. Aspiramos a expandir nuestra marca y abrir nuevas ubicaciones, manteniendo siempre nuestros valores de calidad y excelencia. Queremos ser un lugar donde las personas se reúnan para celebrar momentos especiales y disfrutar de una experiencia culinaria inigualable.
      </p>
      <h5 className="flex items-center mb-3">
        <i className="fa fa-check text-yellow-400 mr-2"></i>Los mejores servicios
      </h5>
      <h5 className="flex items-center mb-3">
        <i className="fa fa-check text-yellow-400 mr-2"></i>La mejor calidad en nuestras comidas
      </h5>
    </div>
  </div>


    {/* CARDS INFORMACIÓN MILA ------------------------------------------------------------------------------------------------------------------------------------- */}

    <div className="container mx-auto pt-5" id="porquemila">
      <div className="relative text-center py-[115px] pb-[10px]">
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[2px] h-[100px] bg-[#DA9F5B]"></div>
        <h4 className="tracking-widest text-yellow-500">Porque Mila</h4>
        <h1 className="text-4xl font-bold hover:text-yellow-500 transition-colors duration-300">¡Conocenos un Poco Más!</h1>
      </div>
      </div>
      </div>
    <div>
        
        <CardSlider/>
        
    {/* UBICACIÓN ------------------------------------------------------------------------------------------------------------------------------------------------ */}
      <div className="container mx-auto pt-5" id="ubicacion">
        <div className="relative text-center py-[115px] pb-[10px]">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[2px] h-[100px] bg-[#DA9F5B]"></div>
        <div className="relative text-center">
          <h4 className="tracking-widest text-yellow-500">Ven y Visitanos, Tenemos una Unica Sede</h4>
          <h1 className="text-4xl font-bold hover:text-yellow-500 transition-colors duration-300">¡ Donde nos Encontramos !</h1>
        </div>
        </div>
      </div>
      
      <div id="contact" className="text-black py-8">
        <div className="flex flex-col lg:flex-row">
        <div className="flex flex-col lg:flex-row items-start space-y-8 lg:space-y-0 lg:space-x-8">
        {/* Mapa (aumentado de tamaño) */}
        <div className="flex-1 h-[500px] lg:h-[500px] lg:min-h-[500px]">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.7467456711715!2d-74.06769082538494!3d4.639206095335593!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9a3a7f05c507%3A0xaec53f454f5a6c77!2zS3IgMTMgIzUyLTEwLCBCb2dvdMOh!5e0!3m2!1ses-419!2sco!4v1722490572590!5m2!1ses-419!2sco" 
            width="100%" 
            height="100%" 
            style={{ border: 0, borderRadius: '0.5rem' }} 
            title="Mapa de ubicación" 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-cross-origin">
          </iframe>
        </div>

        {/* Información de contacto y video */}
        <div className="lg:w-1/2 lg:pl-6">
        {/* Información de contacto */}
        <div className="mb-6">
          <h3 className="text-2xl font-semibold mb-4" id="ubicacion">Ubicación</h3>
          <p className="text-gray-800 mb-6">
            Ven y visítanos en nuestra única sede, comparte nuevas experiencias en nuestro restaurante con tus seres queridos y descubre nuestros sabores en nuestros platos y comidas. Al acudir, podrás disfrutar de diferentes eventos a los que puedes asistir, o tú mismo separar nuestro lugar o una mesa para que tu estadía aquí sea agradable y linda.
          </p>
          <div className="text-gray-800">
            <p className="flex items-center mb-4">
              <i className="fas fa-map-marker-alt mr-3 text-yellow-500"></i> Dirección: Kr 13 #52-10, Bogotá Colombia
            </p>
          </div>
        </div>

        {/* Video */}
        <div className="w-full">
          <iframe 
            className="w-full h-64 rounded-lg shadow-lg" 
            src="https://www.youtube.com/embed/4X7TrySuoAQ?si=bPAWWOF_EWX9C2NV" 
            title="Video de presentación" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerPolicy="strict-origin-when-cross-origin" 
            allowFullScreen
          ></iframe>
        </div>
        </div>
        </div>
        </div>
        </div>
        </div>
    {/* FOOTER --------------------------------------------------------------------------------------------------------------------------------- */}
        
    <div className="fixed bottom-5 right-5 bg-green-500 rounded-full shadow-lg p-5 w-16 h-16 flex items-center justify-center">
      <a href="https://wa.me/p/7007417162688189/573124875578" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center h-full w-full">
        <i className="fab fa-whatsapp text-white text-4xl"></i>
      </a>
    </div>
    {/* El footer se esta renderiando en las rutas por defecto a todas las paginas */}
    
    </div>
  );
};

export default Index;
