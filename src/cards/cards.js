import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faUtensils, faGlassCheers } from "@fortawesome/free-solid-svg-icons";

const CardSlider = () => {
  const data = [
    {
      title: "Eventos Especiales",
      images: [
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cmVzdGF1cmFudGV8ZW58MHwwfDB8fHww",
        "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHJlc3RhdXJhbnRlfGVufDB8fDB8fHww",
        "https://images.unsplash.com/photo-1481833761820-0509d3217039?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHJlc3RhdXJhbnRlfGVufDB8MHwwfHx8MA%3D%3D"
      ],
      texts: [
        "Únete a nosotros para celebrar noches especiales. ¡Cada evento es una oportunidad para crear recuerdos inolvidables!",
        "Ofrecemos eventos únicos con menús exclusivos y actividades interactivas para todos los gustos.",
        "Ven a disfrutar de nuestros eventos temáticos. Siempre hay algo emocionante en Mila."
      ],
      icon: <FontAwesomeIcon icon={faCalendarAlt} className="text-black" />
    },
    {
      title: "Delicias Gastronómicas",
      images: [
        "https://images.unsplash.com/photo-1639667870348-ac4c31dd31f9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGxhdG8lMjBkZSUyMGNvbWlkYXxlbnwwfDB8MHx8fDA%3D",
        "https://images.unsplash.com/photo-1703849133132-98c23595b981?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHBsYXRvcyUyMGRlJTIwY29taWRhfGVufDB8MHwwfHx8MA%3D%3D",
        "https://images.unsplash.com/photo-1563897539633-7374c276c212?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fHw%3D"
      ],
      texts: [
        "Descubre nuestra deliciosa variedad de platos. Desde recetas tradicionales hasta creaciones innovadoras.",
        "Sumérgete en un viaje gastronómico con nuestros platos únicos.",
        "Disfruta de un menú que tiene todo tipo de gustos, asegurando que siempre haya algo emocionante para probar en cada visita."
      ],
      icon: <FontAwesomeIcon icon={faUtensils} className="text-black" />
    },
    {
      title: "Bebidas Exclusivas",
      images: [
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmViaWRhc3xlbnwwfDB8MHx8fDA%3D",
        "https://images.unsplash.com/photo-1517620114540-4f6a4c43f8ed?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGJlYmlkYXN8ZW58MHwwfDB8fHww",
        "https://images.unsplash.com/photo-1577392648676-4fcbd86b83c7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJlYmlkYXN8ZW58MHwwfDB8fHww"
      ],
      texts: [
        "Relájate que mejor con una bebida para complementar tu comida y realzar tu experiencia en Mila.",
        "Explora nuestra carta de bebidas, donde encontrarás una diversa selección de diferentes sabores.",
        "Prueba nuestros refrescantes cócteles, elaborados con ingredientes frescos para ofrecerte una experiencia única."
      ],
      icon: <FontAwesomeIcon icon={faGlassCheers} className="text-black" />
    }
  ];

  const [currentIndexes, setCurrentIndexes] = useState([0, 0, 0]);
  const [fadeOut, setFadeOut] = useState([false, false, false]);

  useEffect(() => {
    const intervals = data.map((_, index) => {
      return setInterval(() => {
        setFadeOut((prev) => {
          const newFadeOut = [...prev];
          newFadeOut[index] = true;
          return newFadeOut;
        });

        setTimeout(() => {
          setCurrentIndexes((prevIndexes) => {
            const newIndexes = [...prevIndexes];
            newIndexes[index] =
              (newIndexes[index] + 1) % data[index].images.length;
            return newIndexes;
          });
          setFadeOut((prev) => {
            const newFadeOut = [...prev];
            newFadeOut[index] = false;
            return newFadeOut;
          });
        }, 1000);
      }, 3000);
    });

    return () => intervals.forEach(clearInterval);
  }, [data]);

  return (
    <div className="flex flex-wrap justify-center gap-8 p-4">
      {data.map((item, cardIndex) => (
        <div
          key={cardIndex}
          className="w-full sm:w-96 h-auto bg-gradient-to-b from-yellow-50 to-yellow-100 rounded-lg shadow-lg overflow-hidden flex flex-col border-2 border-yellow-100"
        >
          <div className="flex items-center p-4">
            {item.icon}
            <h3 className="font-bold text-lg text-black ml-2">
              {item.title}
            </h3>
          </div>
          <div className="w-full h-48 overflow-hidden flex-shrink-0">
            <img
              src={item.images[currentIndexes[cardIndex]]}
              alt={`Card ${cardIndex}`}
              className={`w-full h-full object-cover transition-opacity duration-1000 ${
                fadeOut[cardIndex] ? "opacity-0" : "opacity-100"
              }`}
            />
          </div>
          <div className="p-4 flex-grow">
            <p
              className={`text-gray-800 mt-2 transition-opacity duration-1000 ${
                fadeOut[cardIndex] ? "opacity-0" : "opacity-100"
              }`}
            >
              {item.texts[currentIndexes[cardIndex]]}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardSlider;
