import oliveOilBottle from "@/assets/olive-oil-bottle.png";
import cheeseWheel from "@/assets/cheese-wheel.png";
import seafoodDisplay from "@/assets/seafood-display.png";

export interface RouteStop {
  id: string;
  name: string;
  type: string;
  typeIcon: string;
  description: string;
  whatToDo: string[];
  address: string;
  schedule: string;
  coordinates: [number, number];
  images: string[];
  externalLink?: string;
  highlights: string[];
  featuredReview: {
    author: string;
    rating: number;
    comment: string;
  };
}

export interface RouteDetail {
  id: string;
  title: string;
  description: string;
  duration: string;
  businesses: number;
  rating: string;
  participants: number;
  image: string;
  difficulty: string;
  narrative: string;
  stops: RouteStop[];
  dailyRecommendations: string[];
  practicalInfo: {
    level: string;
    duration: string;
    recommendedPeople: string;
    localTips: string[];
  };
}

export const routesData: RouteDetail[] = [
  {
    id: "bodegas-y-vinedos",
    title: "Bodegas y Viñedos Secretos",
    description: "Descubre bodegas familiares ocultas en La Rioja",
    duration: "1 día",
    businesses: 4,
    rating: "Una experiencia única e irrepetible",
    participants: 42,
    image: oliveOilBottle,
    difficulty: "Fácil",
    narrative: "Sumérgete en los secretos mejor guardados de La Rioja. Esta ruta te llevará por bodegas familiares centenarias donde el tiempo parece haberse detenido. Conocerás a maestros bodegueros que han heredado técnicas ancestrales y que aún hoy elaboran vinos de forma artesanal. Cada parada es una ventana al alma vinícola riojana, donde podrás degustar caldos únicos mientras escuchas historias transmitidas de generación en generación.",
    stops: [
      {
        id: "bodega-1",
        name: "Bodega El Rincón Secreto",
        type: "Bodega familiar",
        typeIcon: "🍷",
        description: "Bodega familiar centenaria donde el vino se elabora como hace 100 años",
        whatToDo: [
          "Visita guiada por los viñedos centenarios",
          "Cata de 5 vinos de la cosecha actual",
          "Charla con el enólogo sobre técnicas tradicionales",
          "Compra directa de botellas exclusivas"
        ],
        address: "Camino de las Viñas, 15, Haro",
        schedule: "Lunes a Domingo: 10:00-18:00",
        coordinates: [-2.8449, 42.5836],
        images: [oliveOilBottle],
        externalLink: "https://bodegaelrinconscreto.com",
        highlights: [
          "Barricas de roble francés centenarias",
          "Método de fermentación tradicional",
          "Vista panorámica de La Rioja Alta"
        ],
        featuredReview: {
          author: "Ana Martínez",
          rating: 5,
          comment: "Una experiencia única. El vino artesano y el trato familiar hacen de esta visita algo inolvidable."
        }
      },
      {
        id: "bodega-2",
        name: "Viñedos del Abuelo",
        type: "Viñedo tradicional",
        typeIcon: "🍇",
        description: "Viñedos de más de 80 años con cepas autóctonas únicas en la región",
        whatToDo: [
          "Paseo entre viñas centenarias",
          "Explicación sobre variedades autóctonas",
          "Degustación de uvas según temporada",
          "Fotografía en los paisajes vinícolas"
        ],
        address: "Carretera del Vino km 3, Briones",
        schedule: "Martes a Domingo: 9:00-17:00",
        coordinates: [-2.7721, 42.5478],
        images: [cheeseWheel],
        highlights: [
          "Cepas de más de 80 años",
          "Variedades autóctonas recuperadas",
          "Paisajes únicos de La Rioja"
        ],
        featuredReview: {
          author: "Miguel Santos",
          rating: 5,
          comment: "Impresionante pasear entre viñas tan antiguas. El conocimiento del guía sobre las variedades locales es excepcional."
        }
      },
      {
        id: "bodega-3",
        name: "Celler Tradición",
        type: "Cava artesano",
        typeIcon: "🥂",
        description: "Elaboración tradicional de cavas con método champenoise desde 1920",
        whatToDo: [
          "Descenso a las cavas subterráneas",
          "Proceso de segunda fermentación en botella",
          "Cata de cavas de diferentes añadas",
          "Maridaje con productos locales"
        ],
        address: "Plaza de la Bodega, 8, Santo Domingo de la Calzada",
        schedule: "Miércoles a Domingo: 11:00-19:00",
        coordinates: [-2.9521, 42.4387],
        images: [seafoodDisplay],
        highlights: [
          "Cavas subterráneas del siglo XIX",
          "Método champenoise tradicional",
          "Colección de añadas históricas"
        ],
        featuredReview: {
          author: "Carlos Mendez",
          rating: 5,
          comment: "Las cavas subterráneas son espectaculares. El cava artesano no tiene comparación con los industriales."
        }
      },
      {
        id: "bodega-4",
        name: "Finca La Esperanza",
        type: "Enoturismo",
        typeIcon: "🍾",
        description: "Experiencia completa de enoturismo en finca familiar con alojamiento rural",
        whatToDo: [
          "Tour completo por viñedos y bodega",
          "Almuerzo maridaje en viñedos",
          "Taller de enología práctica",
          "Compra de vinos exclusivos de la finca"
        ],
        address: "Finca La Esperanza, Km 7, Laguardia",
        schedule: "Todos los días: 10:00-20:00 (previa reserva)",
        coordinates: [-2.6089, 42.5521],
        images: [oliveOilBottle],
        highlights: [
          "Experiencia enoturística completa",
          "Viñedos con certificación ecológica",
          "Vinos premiados internacionalmente"
        ],
        featuredReview: {
          author: "María González",
          rating: 5,
          comment: "La mejor experiencia enoturística que he vivido. Pablo nos explicó todo el proceso con una pasión increíble."
        }
      }
    ],
    dailyRecommendations: [
      "Empieza temprano en Bodega El Rincón Secreto (10:00) para disfrutar de la cata completa",
      "Almuerzo tradicional en el pueblo de Haro con maridaje local",
      "Tarde en los Viñedos del Abuelo cuando la luz es perfecta para fotografías",
      "Reserva con antelación, especialmente durante la época de vendimia"
    ],
    practicalInfo: {
      level: "Fácil",
      duration: "Día completo (8-10 horas)",
      recommendedPeople: "2-8 personas",
      localTips: [
        "Coche imprescindible (distancias considerables)",
        "Ropa cómoda para caminar por el campo", 
        "Conductor designado para las catas de vino",
        "Mejor época: primavera y otoño para el Rioja"
      ]
    }
  },
  {
    id: "panaderia-dulce-tradicion",
    title: "Panadería y Dulce Tradición",
    description: "Hornos centenarios y dulces artesanos de Castilla",
    duration: "Medio día",
    businesses: 3,
    rating: "El sabor auténtico de nuestros ancestros",
    participants: 28,
    image: cheeseWheel,
    difficulty: "Fácil",
    narrative: "Despierta todos tus sentidos en una ruta que te transportará a la esencia más pura de la repostería tradicional castellana. Visitarás hornos de leña que llevan generaciones encendidos, donde maestros panaderos elaboran cada pieza con la misma pasión que sus antepasados. El aroma del pan recién horneado y los dulces conventuales te acompañarán en este viaje gastronómico único.",
    stops: [
      {
        id: "panaderia-1",
        name: "Horno de Leña San Miguel",
        type: "Panadería tradicional",
        typeIcon: "🍞",
        description: "Horno de leña centenario donde aún se cuece el pan como antaño",
        whatToDo: [
          "Demostración de amasado tradicional",
          "Horneado en horno de leña centenario",
          "Degustación de panes artesanos",
          "Taller de elaboración de hogaza"
        ],
        address: "Plaza del Horno, 7, Medina del Campo",
        schedule: "Lunes a Sábado: 6:00-14:00 y 17:00-20:00",
        coordinates: [-4.9154, 41.3069],
        images: [seafoodDisplay],
        highlights: [
          "Horno de leña del siglo XVIII",
          "Técnicas de amasado ancestrales",
          "Pan de centeno tradicional"
        ],
        featuredReview: {
          author: "Carmen López",
          rating: 5,
          comment: "Ver cómo hacen el pan igual que hace 200 años es emocionante. El sabor es incomparable."
        }
      },
      {
        id: "convento-1",
        name: "Convento de Santa Clara",
        type: "Repostería conventual",
        typeIcon: "🍰",
        description: "Dulces elaborados por las monjas siguiendo recetas centenarias",
        whatToDo: [
          "Compra de dulces conventuales",
          "Historia de la repostería monacal",
          "Degustación de especialidades del convento",
          "Visita guiada por las instalaciones históricas"
        ],
        address: "Calle Convento, 12, Tordesillas",
        schedule: "Lunes a Viernes: 9:30-13:00 y 16:00-18:30",
        coordinates: [-5.0024, 41.5019],
        images: [oliveOilBottle],
        highlights: [
          "Recetas conventuales del siglo XVI",
          "Yemas de Santa Teresa artesanas",
          "Tradición repostera ininterrumpida"
        ],
        featuredReview: {
          author: "José Ramón",
          rating: 5,
          comment: "Los dulces más auténticos que he probado. La tradición se siente en cada bocado."
        }
      },
      {
        id: "pasteleria-1",
        name: "Cecinas Pablo",
        type: "Cecina artesana",
        typeIcon: "🥓",
        description: "Secadero tradicional familiar donde la cecina se elabora como hace 150 años",
        whatToDo: [
          "Degustación de cecina recién cortada",
          "Charla con el maestro cecinero",
          "Visita al secadero",
          "Compra de productos artesanos"
        ],
        address: "Calle Mayor, 23, Astorga, León",
        schedule: "Lunes a Sábado: 9:00-14:00 y 17:00-20:00",
        coordinates: [-6.0645, 42.4578],
        images: [cheeseWheel],
        highlights: [
          "Proceso artesano tradicional",
          "Cecina de denominación de origen",
          "Secadero natural centenario"
        ],
        featuredReview: {
          author: "María González",
          rating: 5,
          comment: "La mejor cecina que he probado en mi vida. Pablo nos explicó todo el proceso con una pasión increíble."
        }
      }
    ],
    dailyRecommendations: [
      "Visita matutina al horno (7:00) para ver el proceso completo de horneado",
      "Media mañana en el convento para la compra de dulces frescos", 
      "Almuerzo tradicional castellano con pan artesano",
      "Lleva una cesta para transportar tus compras gastronómicas"
    ],
    practicalInfo: {
      level: "Fácil",
      duration: "Medio día (4-5 horas)",
      recommendedPeople: "2-6 personas",
      localTips: [
        "Madruga para ver el proceso de horneado completo",
        "Lleva efectivo para las compras en el convento",
        "Los dulces conventuales tienen horarios limitados",
        "Mejor época: cualquier momento del año"
      ]
    }
  },
  {
    id: "mercados-temporada",
    title: "Mercados de Temporada",
    description: "Productos frescos y de proximidad en mercados tradicionales",
    duration: "Mañana",
    businesses: 5,
    rating: "La frescura y calidad que buscaba",
    participants: 65,
    image: seafoodDisplay,
    difficulty: "Fácil",
    narrative: "Descubre la autenticidad de los mercados tradicionales donde los productores locales ofrecen lo mejor de cada temporada. Esta ruta te conectará con el ritmo natural de la tierra, donde cada producto tiene su momento y cada vendedor conoce la historia de lo que ofrece. Una experiencia sensorial completa que despertará tu amor por los productos de proximidad.",
    stops: [
      {
        id: "mercado-1",
        name: "Mercado de San Miguel",
        type: "Mercado tradicional",
        typeIcon: "🥕",
        description: "Mercado centenario con productores locales de toda la comarca",
        whatToDo: [
          "Recorrido por puestos de productores locales",
          "Degustación de productos de temporada",
          "Charlas con agricultores sobre cultivos tradicionales",
          "Compra directa de productos frescos"
        ],
        address: "Plaza del Mercado, s/n, Salamanca",
        schedule: "Martes, Jueves y Sábados: 8:00-14:00",
        coordinates: [-5.6640, 40.9701],
        images: [seafoodDisplay],
        highlights: [
          "Productos certificados de proximidad",
          "Variedades autóctonas recuperadas", 
          "Trato directo con productores"
        ],
        featuredReview: {
          author: "Isabel Martín",
          rating: 5,
          comment: "Productos fresquísimos y trato personalizado. Cada puesto cuenta una historia diferente."
        }
      },
      {
        id: "finca-1",
        name: "Huerta Ecológica El Bancal",
        type: "Huerta ecológica",
        typeIcon: "🌱",
        description: "Producción ecológica familiar con más de 30 variedades de hortalizas",
        whatToDo: [
          "Visita guiada por los cultivos ecológicos",
          "Recolección de verduras de temporada",
          "Taller de compostaje natural",
          "Degustación de productos recién cosechados"
        ],
        address: "Camino de la Huerta, km 2, Béjar",
        schedule: "Todos los días: 10:00-18:00",
        coordinates: [-5.7767, 40.3853],
        images: [cheeseWheel],
        highlights: [
          "Certificación ecológica oficial",
          "30 variedades de hortalizas",
          "Método de cultivo biodinámico"
        ],
        featuredReview: {
          author: "Antonio García",
          rating: 5,
          comment: "Increíble ver cómo se cultiva de forma tan respetuosa. Los sabores son intensos y puros."
        }
      },
      {
        id: "queseria-1",
        name: "Quesería Artesana Los Picos",
        type: "Quesería",
        typeIcon: "🧀",
        description: "Elaboración artesana de quesos con leche de cabras autóctonas",
        whatToDo: [
          "Visita a las instalaciones queseras",
          "Proceso de elaboración tradicional",
          "Degustación de quesos curados",
          "Encuentro con las cabras en el pasto"
        ],
        address: "Carretera de Candelario, km 4, Béjar",
        schedule: "Lunes a Domingo: 9:30-18:00",
        coordinates: [-5.7624, 40.3721],
        images: [oliveOilBottle],
        highlights: [
          "Quesos premiados nacional e internacionalmente",
          "Cabras de raza autóctona",
          "Proceso de maduración en cuevas naturales"
        ],
        featuredReview: {
          author: "Pedro Sánchez",
          rating: 5,
          comment: "Quesos espectaculares con sabores únicos. La visita a las cabras fue muy divertida para los niños."
        }
      },
      {
        id: "cooperativa-1",
        name: "Cooperativa de Aceite Virgen",
        type: "Almazara",
        typeIcon: "🫒",
        description: "Almazara cooperativa con más de 200 socios olivicultores locales",
        whatToDo: [
          "Visita a la almazara moderna",
          "Proceso de extracción en frío",
          "Cata de aceites de diferentes variedades",
          "Compra directa de aceite virgen extra"
        ],
        address: "Polígono Industrial, Calle Olivo, 12, Jaén",
        schedule: "Lunes a Viernes: 8:00-15:00",
        coordinates: [-3.7882, 37.7749],
        images: [seafoodDisplay],
        highlights: [
          "Aceite virgen extra de primera extracción",
          "Variedades picual y arbequina",
          "Proceso completamente sostenible"
        ],
        featuredReview: {
          author: "Carmen Ruiz",
          rating: 5,
          comment: "El aceite más fresco que he probado. Ver todo el proceso desde la aceituna hasta la botella es fascinante."
        }
      },
      {
        id: "granja-1",
        name: "Granja Ecológica San Francisco",
        type: "Granja ecológica",
        typeIcon: "🐄",
        description: "Granja familiar ecológica con producción de lácteos y huevos camperos",
        whatToDo: [
          "Visita a los animales en libertad",
          "Ordeño tradicional de vacas",
          "Recolección de huevos camperos",
          "Degustación de productos lácteos frescos"
        ],
        address: "Finca San Francisco, km 8, Ávila",
        schedule: "Todos los días: 10:00-17:00",
        coordinates: [-4.7245, 40.6567],
        images: [cheeseWheel],
        highlights: [
          "Certificación ecológica completa",
          "Animales en pastoreo libre",
          "Productos lácteos sin aditivos"
        ],
        featuredReview: {
          author: "Ana Martínez",
          rating: 5,
          comment: "Una experiencia única. El vino artesano y el trato familiar hacen de esta visita algo inolvidable."
        }
      }
    ],
    dailyRecommendations: [
      "Comienza en el mercado temprano (8:30) para encontrar la mejor selección",
      "Visita la huerta a media mañana para ver los cultivos en plena actividad",
      "Lleva una nevera portátil para mantener productos frescos",
      "Pregunta por las variedades de temporada en cada puesto"
    ],
    practicalInfo: {
      level: "Fácil", 
      duration: "Media jornada (3-4 horas)",
      recommendedPeople: "2-4 personas",
      localTips: [
        "Madruga para encontrar la mejor selección",
        "Lleva bolsas reutilizables para las compras",
        "Los mercados tradicionales solo abren días específicos",
        "Pregunta siempre por el origen de los productos"
      ]
    }
  }
];

const restoredExperienceRoutes: RouteDetail[] = [
  {
    id: "ruta-queso-manchego",
    title: "Ruta Clasica del Queso Manchego",
    description: "Descubre el origen del queso manchego con visitas a queserias artesanas.",
    duration: "1 dia",
    businesses: 3,
    rating: "4.8/5",
    participants: 124,
    image: "https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=900&q=85",
    difficulty: "Facil",
    narrative:
      "Una experiencia pensada para conocer el queso manchego desde dentro: el pasto, la leche, el obrador y la mesa. Recorre pueblos de Ciudad Real donde la tradicion quesera sigue viva y habla directamente con quienes la mantienen.",
    stops: [
      {
        id: "queso-porzuna",
        name: "Queseria Artesanal El Refugio",
        type: "Queseria artesana",
        typeIcon: "cheese",
        description: "Obrador familiar especializado en queso manchego curado y semicurado.",
        whatToDo: ["Visita al obrador", "Cata de quesos por maduracion", "Compra directa al productor"],
        address: "Porzuna, Ciudad Real",
        schedule: "Sabados: 10:00-14:00",
        coordinates: [-4.1558, 39.1467],
        images: ["https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=700&q=85"],
        highlights: ["Leche de oveja manchega", "Curacion tradicional", "Trato directo"],
        featuredReview: {
          author: "Maria Lopez",
          rating: 5,
          comment: "Una experiencia increible. El queso y la explicacion del proceso merecen muchisimo la pena.",
        },
      },
      {
        id: "queso-piedrabuena",
        name: "Finca de Pasto Manchego",
        type: "Finca ganadera",
        typeIcon: "leaf",
        description: "Parada en el entorno donde nace la leche que define el caracter del queso.",
        whatToDo: ["Paseo por la finca", "Encuentro con el ganadero", "Explicacion del pastoreo"],
        address: "Piedrabuena, Ciudad Real",
        schedule: "Sabados: 12:00-14:00",
        coordinates: [-4.1752, 39.0358],
        images: ["https://images.unsplash.com/photo-1484557985045-edf25e08da73?auto=format&fit=crop&w=700&q=85"],
        highlights: ["Paisaje manchego", "Pastoreo local", "Origen del producto"],
        featuredReview: {
          author: "Carlos Martin",
          rating: 5,
          comment: "Se entiende el producto de otra manera cuando ves de donde viene.",
        },
      },
      {
        id: "queso-almagro",
        name: "Mesa Manchega de Temporada",
        type: "Restaurante local",
        typeIcon: "utensils",
        description: "Comida final con recetas manchegas y producto de la ruta.",
        whatToDo: ["Menu de temporada", "Maridaje local", "Charla con el cocinero"],
        address: "Almagro, Ciudad Real",
        schedule: "Sabados: 14:30-17:00",
        coordinates: [-3.7116, 38.8894],
        images: ["https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=700&q=85"],
        highlights: ["Cocina de territorio", "Producto de cercania", "Final gastronomico"],
        featuredReview: {
          author: "Lucia Fernandez",
          rating: 5,
          comment: "El cierre perfecto para una ruta muy autentica.",
        },
      },
    ],
    dailyRecommendations: [
      "Empieza temprano para disfrutar la visita al obrador sin prisas.",
      "Lleva calzado comodo para la parada en finca.",
      "Reserva con antelacion: las plazas son reducidas.",
    ],
    practicalInfo: {
      level: "Facil",
      duration: "Dia completo",
      recommendedPeople: "2-8 personas",
      localTips: ["Ideal en primavera", "Recomendable ir en coche", "Consulta horarios antes de salir"],
    },
  },
  {
    id: "ruta-vino-tierra",
    title: "Ruta del Vino y la Tierra",
    description: "Vinedos, bodegas familiares y sabores que nacen de la tierra.",
    duration: "2 dias",
    businesses: 3,
    rating: "4.7/5",
    participants: 98,
    image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=900&q=85",
    difficulty: "Facil",
    narrative:
      "Un recorrido por bodegas y paisajes viticolas manchegos donde el vino se entiende como cultura, oficio y territorio. Catas tranquilas, pueblos con historia y cocina local para saborear el viaje.",
    stops: [
      {
        id: "vino-almagro",
        name: "Bodega Familiar La Tierra",
        type: "Bodega",
        typeIcon: "grape",
        description: "Bodega de pequena produccion con vinos de parcela y elaboracion cuidada.",
        whatToDo: ["Visita a bodega", "Cata comentada", "Compra directa"],
        address: "Almagro, Ciudad Real",
        schedule: "Viernes y sabados: 11:00-18:00",
        coordinates: [-3.7116, 38.8894],
        images: ["https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=700&q=85"],
        highlights: ["Vinos de parcela", "Cata familiar", "Produccion limitada"],
        featuredReview: {
          author: "Lucia Fernandez",
          rating: 5,
          comment: "Aprendimos muchisimo y disfrutamos de paisajes preciosos.",
        },
      },
      {
        id: "vino-valdepenas",
        name: "Vinedos de Valdepenas",
        type: "Vinedo",
        typeIcon: "leaf",
        description: "Paseo entre cepas y explicacion del calendario agricola de la vid.",
        whatToDo: ["Paseo por vinedo", "Explicacion de variedades", "Fotos al atardecer"],
        address: "Valdepenas, Ciudad Real",
        schedule: "Sabados: 17:00-20:00",
        coordinates: [-3.3848, 38.7621],
        images: ["https://images.unsplash.com/photo-1528823872057-9c018a7a7556?auto=format&fit=crop&w=700&q=85"],
        highlights: ["Paisaje de vid", "Variedades manchegas", "Luz de tarde"],
        featuredReview: {
          author: "Javier Ruiz",
          rating: 5,
          comment: "Una ruta muy completa para entender el vino desde el campo.",
        },
      },
      {
        id: "vino-virtudes",
        name: "Mesa de Vino y Producto Local",
        type: "Restaurante",
        typeIcon: "utensils",
        description: "Cena maridada con vino de la ruta y platos manchegos.",
        whatToDo: ["Cena maridada", "Producto local", "Charla con sumiller"],
        address: "Las Virtudes, Ciudad Real",
        schedule: "Sabados: 21:00-23:30",
        coordinates: [-3.518, 38.689],
        images: ["https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=700&q=85"],
        highlights: ["Maridaje local", "Cocina manchega", "Ambiente cercano"],
        featuredReview: {
          author: "Ana Santos",
          rating: 5,
          comment: "La cena fue el broche perfecto.",
        },
      },
    ],
    dailyRecommendations: ["Reserva la cata con antelacion.", "Evita conducir despues de las catas.", "Lleva ropa comoda para caminar por vinedos."],
    practicalInfo: {
      level: "Facil",
      duration: "Fin de semana",
      recommendedPeople: "2-10 personas",
      localTips: ["Mejor en vendimia e invierno", "Plan ideal para parejas o grupos pequenos", "Consulta disponibilidad por bodega"],
    },
  },
  {
    id: "ruta-trashumancia",
    title: "Ruta de la Trashumancia y el Pastor",
    description: "Sigue los pasos del pastor y conoce la vida en la dehesa manchega.",
    duration: "1 dia",
    businesses: 3,
    rating: "4.6/5",
    participants: 76,
    image: "https://images.unsplash.com/photo-1484557985045-edf25e08da73?auto=format&fit=crop&w=900&q=85",
    difficulty: "Media",
    narrative:
      "Una ruta para entender un oficio antiguo que aun explica el paisaje. Caminos ganaderos, relatos de pastores y producto de temporada para vivir la tradicion sin convertirla en decorado.",
    stops: [
      {
        id: "trashumancia-labores",
        name: "Camino de Pastores",
        type: "Sendero ganadero",
        typeIcon: "route",
        description: "Tramo interpretado por caminos usados por pastores de la zona.",
        whatToDo: ["Paseo guiado", "Interpretacion del paisaje", "Historia de la trashumancia"],
        address: "Las Labores, Ciudad Real",
        schedule: "Domingos: 09:30-12:30",
        coordinates: [-3.5205, 39.2743],
        images: ["https://images.unsplash.com/photo-1484557985045-edf25e08da73?auto=format&fit=crop&w=700&q=85"],
        highlights: ["Camino tradicional", "Paisaje abierto", "Relato local"],
        featuredReview: {
          author: "Pedro Molina",
          rating: 5,
          comment: "Una forma preciosa de entender el campo manchego.",
        },
      },
      {
        id: "trashumancia-horcajo",
        name: "Encuentro con el Pastor",
        type: "Oficio tradicional",
        typeIcon: "user",
        description: "Conversacion y demostracion con un pastor local.",
        whatToDo: ["Charla de oficio", "Demostracion de manejo", "Degustacion sencilla"],
        address: "Horcajo de los Montes, Ciudad Real",
        schedule: "Domingos: 12:30-14:00",
        coordinates: [-4.6492, 39.3256],
        images: ["https://images.unsplash.com/photo-1511117833895-4b473c0b85d6?auto=format&fit=crop&w=700&q=85"],
        highlights: ["Oficio vivo", "Trato directo", "Cultura oral"],
        featuredReview: {
          author: "Marta Cano",
          rating: 5,
          comment: "Lo mejor fue escuchar las historias del pastor.",
        },
      },
      {
        id: "trashumancia-anchuras",
        name: "Comida de Dehesa",
        type: "Comida local",
        typeIcon: "utensils",
        description: "Final con comida sencilla de producto local y recetas de campo.",
        whatToDo: ["Comida de temporada", "Producto local", "Descanso en entorno rural"],
        address: "Anchuras, Ciudad Real",
        schedule: "Domingos: 14:30-17:00",
        coordinates: [-4.8357, 39.4813],
        images: ["https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=700&q=85"],
        highlights: ["Cocina de campo", "Producto cercano", "Ritmo tranquilo"],
        featuredReview: {
          author: "Sergio Nieto",
          rating: 5,
          comment: "Autentica, sencilla y muy humana.",
        },
      },
    ],
    dailyRecommendations: ["Lleva calzado de campo.", "Evita las horas centrales de calor.", "Pregunta por la disponibilidad segun meteorologia."],
    practicalInfo: {
      level: "Media",
      duration: "Dia completo",
      recommendedPeople: "2-12 personas",
      localTips: ["Mejor en primavera y otono", "No recomendada con lluvia fuerte", "Llevar agua"],
    },
  },
  {
    id: "ruta-pueblos-historia",
    title: "Ruta de Pueblos con Historia",
    description: "Arte, patrimonio y rincones unicos que cuentan nuestra historia.",
    duration: "1 dia",
    businesses: 3,
    rating: "4.8/5",
    participants: 112,
    image: "https://images.unsplash.com/photo-1558642084-fd07fae5282e?auto=format&fit=crop&w=900&q=85",
    difficulty: "Facil",
    narrative:
      "Un itinerario cultural por pueblos manchegos donde la arquitectura, la plaza, el teatro y la mesa cuentan una historia compartida. Pensada para viajar despacio y mirar con atencion.",
    stops: [
      {
        id: "historia-infantes",
        name: "Villanueva de los Infantes",
        type: "Conjunto historico",
        typeIcon: "map-pin",
        description: "Paseo por calles, patios y plazas con historia literaria y manchega.",
        whatToDo: ["Paseo guiado", "Visita a plaza mayor", "Fotografia de patrimonio"],
        address: "Villanueva de los Infantes, Ciudad Real",
        schedule: "Sabados: 10:00-12:30",
        coordinates: [-3.0126, 38.7362],
        images: ["https://images.unsplash.com/photo-1558642084-fd07fae5282e?auto=format&fit=crop&w=700&q=85"],
        highlights: ["Patrimonio", "Historia literaria", "Casco historico"],
        featuredReview: {
          author: "Elena Prieto",
          rating: 5,
          comment: "Un pueblo precioso explicado con mucho carino.",
        },
      },
      {
        id: "historia-almagro",
        name: "Almagro y su Corral",
        type: "Patrimonio cultural",
        typeIcon: "badge",
        description: "Parada cultural en uno de los lugares mas reconocibles de La Mancha.",
        whatToDo: ["Visita cultural", "Paseo por soportales", "Tiempo libre"],
        address: "Almagro, Ciudad Real",
        schedule: "Sabados: 13:00-15:00",
        coordinates: [-3.7116, 38.8894],
        images: ["https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=700&q=85"],
        highlights: ["Corral de comedias", "Plaza mayor", "Ambiente historico"],
        featuredReview: {
          author: "Rosa Jimenez",
          rating: 5,
          comment: "Almagro siempre sorprende, y asi se disfruta aun mas.",
        },
      },
      {
        id: "historia-villahermosa",
        name: "Mesa de Pueblo",
        type: "Restaurante local",
        typeIcon: "utensils",
        description: "Comida de cierre con recetas tradicionales y sobremesa tranquila.",
        whatToDo: ["Menu local", "Producto manchego", "Sobremesa de ruta"],
        address: "Villahermosa, Ciudad Real",
        schedule: "Sabados: 15:00-17:30",
        coordinates: [-2.8703, 38.7505],
        images: ["https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=700&q=85"],
        highlights: ["Cocina tradicional", "Final de ruta", "Trato cercano"],
        featuredReview: {
          author: "Manuel Ortega",
          rating: 5,
          comment: "La ruta tiene cultura, comida y calma. Justo lo que buscabamos.",
        },
      },
    ],
    dailyRecommendations: ["Lleva camara o movil cargado.", "Deja tiempo para pasear sin prisa.", "Ideal para primavera, otono e invierno."],
    practicalInfo: {
      level: "Facil",
      duration: "Dia completo",
      recommendedPeople: "2-10 personas",
      localTips: ["Apta para familias", "Mejor evitar horas de mucho calor", "Consulta visitas guiadas disponibles"],
    },
  },
];

export const getRouteById = (id: string): RouteDetail | undefined => {
  return [...routesData, ...restoredExperienceRoutes].find(route => route.id === id);
};

export const getAllRoutes = (): RouteDetail[] => {
  return [...routesData, ...restoredExperienceRoutes];
};
