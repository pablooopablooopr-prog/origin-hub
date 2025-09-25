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

export const getRouteById = (id: string): RouteDetail | undefined => {
  return routesData.find(route => route.id === id);
};