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
  },
  {
    id: "ruta-artesanos-castilla",
    title: "Artesanos de Castilla",
    description: "Descubre oficios tradicionales y artesanía única",
    duration: "1 día",
    businesses: 4,
    rating: "Una conexión única con nuestras tradiciones",
    participants: 35,
    image: oliveOilBottle,
    difficulty: "Fácil",
    narrative: "Sumérgete en el mundo de los oficios tradicionales que han perdurado a través de los siglos. Esta ruta te llevará a conocer artesanos que mantienen vivas técnicas ancestrales, donde cada pieza cuenta una historia y cada gesto tiene siglos de tradición.",
    stops: [
      {
        id: "ceramica-1",
        name: "Alfarería Traditional",
        type: "Taller de cerámica",
        typeIcon: "🏺",
        description: "Taller familiar de cerámica tradicional con más de 100 años de historia",
        whatToDo: [
          "Demostración del torno de alfarero",
          "Taller práctico de modelado",
          "Visita al horno tradicional",
          "Compra de piezas únicas artesanas"
        ],
        address: "Calle Alfareros, 15, Talavera de la Reina",
        schedule: "Lunes a Viernes: 9:00-18:00",
        coordinates: [-4.8300, 39.9631],
        images: [cheeseWheel],
        highlights: [
          "Técnica tradicional del torno",
          "Piezas únicas irrepetibles",
          "Horno del siglo XIX"
        ],
        featuredReview: {
          author: "María José",
          rating: 5,
          comment: "Ver trabajar a estos artesanos es hipnotizante. Cada pieza es una obra de arte."
        }
      }
    ],
    dailyRecommendations: [
      "Comienza temprano para ver todo el proceso artesanal",
      "Lleva ropa cómoda que pueda mancharse",
      "Reserva con antelación para talleres prácticos"
    ],
    practicalInfo: {
      level: "Fácil",
      duration: "Día completo (6-8 horas)",
      recommendedPeople: "2-6 personas",
      localTips: [
        "Parking gratuito en el centro del pueblo",
        "Cómete tradicional incluida en algunos talleres",
        "Mejor época: primavera y otoño"
      ]
    }
  },
  {
    id: "costa-marisqueo",
    title: "Costa y Marisqueo Tradicional",
    description: "Marisqueo artesanal y pescado fresco del Cantábrico",
    duration: "1 día",
    businesses: 5,
    rating: "El mar en estado puro",
    participants: 42,
    image: seafoodDisplay,
    difficulty: "Moderado",
    narrative: "Conecta con la tradición marinera más auténtica del Cantábrico. Acompaña a pescadores locales en su día a día, descubre técnicas de marisqueo centenarias y saborea el pescado más fresco directamente del mar.",
    stops: [
      {
        id: "puerto-1",
        name: "Puerto de Lastres",
        type: "Puerto pesquero",
        typeIcon: "⚓",
        description: "Puerto tradicional con lonja y pescadores locales",
        whatToDo: [
          "Asistir a la subasta de pescado fresco",
          "Charla con pescadores veteranos",
          "Visita a las embarcaciones tradicionales",
          "Degustación de pescado recién llegado"
        ],
        address: "Puerto de Lastres, Colunga, Asturias",
        schedule: "Todos los días: 6:00-12:00 (horario de marea)",
        coordinates: [-5.2784, 43.5122],
        images: [seafoodDisplay],
        highlights: [
          "Lonja tradicional centenaria",
          "Flota pesquera artesanal",
          "Pescado del día garantizado"
        ],
        featuredReview: {
          author: "Roberto Fernández",
          rating: 5,
          comment: "Levantarse temprano vale la pena. Ver llegar los barcos con la pesca del día es emocionante."
        }
      }
    ],
    dailyRecommendations: [
      "Madruga para ver la llegada de los barcos (6:00-7:00)",
      "Lleva ropa de abrigo y chubasquero",
      "Desayuno marinero en el puerto",
      "Respeta los horarios de marea"
    ],
    practicalInfo: {
      level: "Moderado",
      duration: "Día completo (8-10 horas)",
      recommendedPeople: "2-8 personas",
      localTips: [
        "Consulta la tabla de mareas",
        "Ropa impermeable imprescindible",
        "Calzado antideslizante recomendado",
        "Mejor época: primavera y verano"
      ]
    }
  },
  {
    id: "montes-ganaderia",
    title: "Montes y Ganadería Tradicional",
    description: "Ganadería extensiva y productos lácteos de montaña",
    duration: "1 día",
    businesses: 4,
    rating: "La vida en armonía con la naturaleza",
    participants: 28,
    image: cheeseWheel,
    difficulty: "Moderado",
    narrative: "Descubre la ganadería tradicional de montaña, donde los animales pastan en libertad y los productos mantienen sabores auténticos. Una ruta que te conectará con el ritmo pausado de la vida rural y la sabiduría de los ganaderos de toda la vida.",
    stops: [
      {
        id: "ganaderia-1",
        name: "Granja Picos Verdes",
        type: "Ganadería extensiva",
        typeIcon: "🐄",
        description: "Explotación ganadera familiar en los Picos de Europa",
        whatToDo: [
          "Acompañar al ganado a los pastos altos",
          "Ordeño tradicional matutino",
          "Elaboración de queso fresco",
          "Almuerzo campestre con productos propios"
        ],
        address: "Valle de Liébana, Cantabria",
        schedule: "Todos los días: 7:00-19:00 (previa reserva)",
        coordinates: [-4.6089, 43.1521],
        images: [cheeseWheel],
        highlights: [
          "Pastoreo en alta montaña",
          "Quesos con denominación de origen",
          "Vista panorámica de los Picos"
        ],
        featuredReview: {
          author: "Carmen Diez",
          rating: 5,
          comment: "Una experiencia que te reconecta con la naturaleza. Los quesos son extraordinarios."
        }
      }
    ],
    dailyRecommendations: [
      "Comienza muy temprano (7:00) para el ordeño",
      "Lleva ropa y calzado de montaña",
      "No olvides la cámara para los paisajes",
      "Respeta los ritmos de los animales"
    ],
    practicalInfo: {
      level: "Moderado",
      duration: "Día completo (10-12 horas)",
      recommendedPeople: "3-6 personas",
      localTips: [
        "Vehículo 4x4 recomendado",
        "Ropa de abrigo imprescindible",
        "Protección solar para alta montaña",
        "Mejor época: mayo a octubre"
      ]
    }
  }
];

export const getRouteById = (id: string): RouteDetail | undefined => {
  return routesData.find(route => route.id === id);
};