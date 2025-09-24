import oliveOilBottle from "@/assets/olive-oil-bottle.png";
import cheeseWheel from "@/assets/cheese-wheel.png";
import seafoodDisplay from "@/assets/seafood-display.png";

export interface RouteStop {
  id: string;
  name: string;
  type: string;
  typeIcon: string;
  whatToDo: string[];
  address: string;
  recommendedHours: string;
  coordinates: [number, number];
  images: string[];
  externalLink?: string;
  highlights: string[];
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
    narrative: "Adéntrate en los viñedos menos conocidos de La Rioja, donde pequeñas bodegas familiares crean vinos excepcionales lejos de las rutas turísticas masivas. Esta ruta exclusiva te llevará por cavas centenarias, viñedos ecológicos y encuentros íntimos con enólogos que mantienen vivas tradiciones ancestrales de elaboración.",
    stops: [
      {
        id: "bodega-el-secreto",
        name: "Bodega El Secreto",
        type: "Bodega familiar",
        typeIcon: "🍷",
        whatToDo: ["Cata de vinos únicos", "Visita a cavas del s. XVIII", "Charla con el enólogo", "Comprar botellas exclusivas"],
        address: "Camino del Viñedo, 15, Haro, La Rioja",
        recommendedHours: "10:00 - 12:00 (cata matutina)",
        coordinates: [-2.8452, 42.5840],
        images: [oliveOilBottle],
        externalLink: "https://bodega-secreto.com",
        highlights: ["Vinos de parcelas únicas", "Método tradicional familiar", "Cata en barricas centenarias"]
      },
      {
        id: "vinedo-ecologico",
        name: "Viñedo Ecológico Los Terruños",
        type: "Viñedo biodinámico",
        typeIcon: "🍇",
        whatToDo: ["Paseo entre viñas", "Aprender viticultura ecológica", "Degustación al aire libre", "Fotografiar paisajes"],
        address: "Colina de Briones, La Rioja",
        recommendedHours: "12:30 - 14:00 (luz perfecta)",
        coordinates: [-2.7756, 42.5234],
        images: [oliveOilBottle],
        highlights: ["Certificación ecológica", "Vistas panorámicas", "Filosofía biodinámica"]
      },
      {
        id: "taberna-vinatera",
        name: "Taberna La Vinatera",
        type: "Taberna tradicional",
        typeIcon: "🍴",
        whatToDo: ["Almuerzo riojano auténtico", "Maridaje con vinos locales", "Tapas de la región", "Ambiente local"],
        address: "Plaza Mayor, 8, Labastida",
        recommendedHours: "14:00 - 16:00 (almuerzo tradicional)",
        coordinates: [-2.7892, 42.5678],
        images: [oliveOilBottle],
        highlights: ["Chuletillas al sarmiento", "Patatas a la riojana", "Vinos de la casa"]
      },
      {
        id: "museo-vino-cultura",
        name: "Museo del Vino y la Cultura",
        type: "Centro cultural",
        typeIcon: "🏛️",
        whatToDo: ["Historia vitivinícola", "Herramientas antiguas", "Cata educativa", "Talleres temáticos"],
        address: "Calle Cultura, 22, Laguardia",
        recommendedHours: "16:30 - 18:00 (visita cultural)",
        coordinates: [-2.5834, 42.5567],
        images: [oliveOilBottle],
        highlights: ["Colección histórica única", "Cata didáctica", "Arquitectura medieval"]
      }
    ],
    dailyRecommendations: [
      "Comienza temprano en la bodega familiar para disfrutar de la cata sin prisas y conocer la historia familiar.",
      "El viñedo ecológico es perfecto al mediodía para fotografías con la mejor luz natural.",
      "Termina en el museo para consolidar todo lo aprendido sobre la cultura vinícola riojana."
    ],
    practicalInfo: {
      level: "Fácil - Apto para amantes del vino",
      duration: "8 horas (día completo)",
      recommendedPeople: "2-8 personas",
      localTips: [
        "Designa un conductor responsable o contrata transporte",
        "Lleva ropa cómoda para caminar entre viñas",
        "Pregunta por las añadas especiales disponibles solo en bodega",
        "La mejor época es vendimia (septiembre) o primavera (mayo-junio)"
      ]
    }
  },
  {
    id: "panaderia-dulce-tradicion",
    title: "Panadería y Dulce Tradición",
    description: "Hornos centenarios y repostería de convento",
    duration: "Weekend",
    businesses: 6,
    rating: "Dulzura pura y auténtica",
    participants: 28,
    image: cheeseWheel,
    difficulty: "Moderada",
    narrative: "Sumérgete en el mundo aromático de los hornos tradicionales y la repostería conventual, donde recetas secretas pasan de generación en generación. Esta ruta de fin de semana te lleva por panaderías centenarias, conventos donde las monjas elaboran dulces únicos, y obradores donde aún se trabaja como antaño.",
    stops: [
      {
        id: "horno-san-nicolas",
        name: "Horno de San Nicolás",
        type: "Panadería histórica",
        typeIcon: "🥖",
        whatToDo: ["Ver proceso de amasado", "Hornear tu propio pan", "Degustación de masas madre", "Comprar pan artesano"],
        address: "Calle del Horno, 5, Toledo",
        recommendedHours: "07:00 - 09:00 (amasado matutino)",
        coordinates: [-4.0273, 39.8628],
        images: [cheeseWheel],
        highlights: ["Horno de leña del s. XVI", "Pan de masa madre centenaria", "Técnicas tradicionales"]
      },
      {
        id: "convento-santa-clara",
        name: "Convento de Santa Clara",
        type: "Repostería conventual",
        typeIcon: "🍰",
        whatToDo: ["Comprar dulces de monja", "Conocer recetas secretas", "Degustación exclusiva", "Historia conventual"],
        address: "Plaza del Convento, 3, Tordesillas",
        recommendedHours: "10:00 - 12:00 (venta matutina)",
        coordinates: [-5.0068, 41.5009],
        images: [cheeseWheel],
        highlights: ["Yemas de Santa Teresa", "Recetas del s. XVII", "Venta tradicional por torno"]
      },
      {
        id: "obrador-miel-artesana",
        name: "Obrador de Miel Artesana",
        type: "Taller de repostería",
        typeIcon: "🍯",
        whatToDo: ["Elaborar dulces con miel", "Conocer tipos de miel", "Taller práctico", "Cata de mieles"],
        address: "Camino de las Colmenas, 12, El Escorial",
        recommendedHours: "15:00 - 17:00 (taller de tarde)",
        coordinates: [-4.1479, 40.5897],
        images: [cheeseWheel],
        highlights: ["Miel de montaña pura", "Taller interactivo", "Dulces sin azúcar añadido"]
      },
      {
        id: "pasteleria-francesa",
        name: "Pastelería La Francesa",
        type: "Pastelería clásica",
        typeIcon: "🥐",
        whatToDo: ["Ver técnica de hojaldre", "Degustación de croissants", "Café y dulces", "Comprar productos frescos"],
        address: "Calle Mayor, 45, Segovia",
        recommendedHours: "08:00 - 10:00 (productos recién hechos)",
        coordinates: [-4.1171, 40.9429],
        images: [cheeseWheel],
        highlights: ["Croissants mantecosos", "Técnica francesa auténtica", "Café de especialidad"]
      },
      {
        id: "chocolateria-artesana",
        name: "Chocolatería Artesana Cacao",
        type: "Taller de chocolate",
        typeIcon: "🍫",
        whatToDo: ["Elaborar chocolates", "Degustación de cacaos", "Taller de bombones", "Historia del chocolate"],
        address: "Calle del Cacao, 8, Astorga",
        recommendedHours: "11:00 - 13:00 (taller matutino)",
        coordinates: [-6.0679, 42.4571],
        images: [cheeseWheel],
        highlights: ["Cacao bean to bar", "Chocolates únicos", "Taller interactivo"]
      },
      {
        id: "cafe-tostaduria",
        name: "Café y Tostaduria Origen",
        type: "Tostaduria artesana",
        typeIcon: "☕",
        whatToDo: ["Ver proceso de tostado", "Cata de cafés", "Maridaje café-dulce", "Comprar café en grano"],
        address: "Plaza del Mercado, 15, Salamanca",
        recommendedHours: "16:30 - 18:00 (tostado de tarde)",
        coordinates: [-5.6640, 40.9701],
        images: [cheeseWheel],
        highlights: ["Tostado en pequeños lotes", "Cafés de origen único", "Cata profesional"]
      }
    ],
    dailyRecommendations: [
      "Sábado: Comienza muy temprano en el horno para ver todo el proceso, luego el convento y termina en el obrador de miel.",
      "Domingo: Desayuno en la pastelería francesa, chocolatería a media mañana y café de especialidad por la tarde.",
      "Lleva recipientes herméticos para conservar todo lo que compres durante la ruta."
    ],
    practicalInfo: {
      level: "Moderada - Incluye talleres prácticos",
      duration: "2 días intensivos",
      recommendedPeople: "4-10 personas (ideal para grupos)",
      localTips: [
        "Reserva los talleres prácticos con una semana de antelación",
        "Lleva ropa que pueda mancharse para los talleres",
        "Desayuna ligero, ¡probarás mucho durante el día!",
        "La mejor época es otoño-invierno (temporada de dulces navideños)"
      ]
    }
  },
  {
    id: "mercados-temporada",
    title: "Mercados de Temporada",
    description: "Productos frescos y productores de kilómetro 0",
    duration: "2 días",
    businesses: 5,
    rating: "Conecta con la tierra y sus frutos",
    participants: 35,
    image: seafoodDisplay,
    difficulty: "Fácil",
    narrative: "Descubre la magia de los mercados tradicionales donde los productores locales venden directamente los frutos de su trabajo. Esta ruta te conecta con la agricultura de temporada, los hortelanos que mantienen variedades autóctonas y los mercados que son el corazón social de cada pueblo. Una experiencia auténtica de producto kilómetro 0.",
    stops: [
      {
        id: "mercado-central-abastos",
        name: "Mercado Central de Abastos",
        type: "Mercado tradicional",
        typeIcon: "🥬",
        whatToDo: ["Comprar productos frescos", "Conocer productores locales", "Degustación de temporada", "Desayuno de mercado"],
        address: "Plaza del Mercado, 1, Valencia",
        recommendedHours: "08:00 - 10:00 (productos más frescos)",
        coordinates: [-0.3774, 39.4739],
        images: [seafoodDisplay],
        highlights: ["Productos de la huerta valenciana", "Arquitectura modernista", "Ambiente social auténtico"]
      },
      {
        id: "huerta-ecologica",
        name: "Huerta Ecológica La Verde",
        type: "Explotación agrícola",
        typeIcon: "🌱",
        whatToDo: ["Visitar cultivos ecológicos", "Recoger productos", "Charla sobre agricultura sostenible", "Compra directa"],
        address: "Camino de la Huerta, km 3, Murcia",
        recommendedHours: "09:30 - 11:30 (recogida matutina)",
        coordinates: [-1.1307, 37.9922],
        images: [seafoodDisplay],
        highlights: ["Agricultura biodinámica", "Variedades autóctonas", "Experiencia de recolección"]
      },
      {
        id: "queseria-cabras-sierra",
        name: "Quesería de Cabras de Sierra",
        type: "Granja quesera",
        typeIcon: "🐐",
        whatToDo: ["Ver proceso de elaboración", "Conocer a las cabras", "Degustar quesos frescos", "Paseo por la sierra"],
        address: "Sierra de Cazorla, Jaén",
        recommendedHours: "12:00 - 14:00 (ordeño y elaboración)",
        coordinates: [-2.9274, 37.9274],
        images: [seafoodDisplay],
        highlights: ["Queso fresco de cabra", "Entorno natural único", "Proceso artesanal"]
      },
      {
        id: "cooperativa-olivarera",
        name: "Cooperativa Olivarera Local",
        type: "Cooperativa agrícola",
        typeIcon: "🫒",
        whatToDo: ["Proceso de prensado", "Cata de aceites nuevos", "Compra directa", "Charla con olivareros"],
        address: "Calle Cooperativa, 25, Baeza",
        recommendedHours: "15:00 - 17:00 (proceso de tarde)",
        coordinates: [-3.4631, 37.9932],
        images: [seafoodDisplay],
        highlights: ["Aceite recién prensado", "Precios de cooperativa", "Variedades locales"]
      },
      {
        id: "restaurante-producto-local",
        name: "Restaurante Producto Local",
        type: "Restaurante km 0",
        typeIcon: "🍽️",
        whatToDo: ["Comida con productos de la ruta", "Conocer al chef", "Maridaje con vinos locales", "Menú de temporada"],
        address: "Plaza de los Productos, 3, Úbeda",
        recommendedHours: "20:00 - 22:00 (cena con productos del día)",
        coordinates: [-3.3706, 38.0138],
        images: [seafoodDisplay],
        highlights: ["Carta de temporada", "Productos de la ruta", "Cocina de autor local"]
      }
    ],
    dailyRecommendations: [
      "Día 1: Madruga para el mercado, visita la huerta por la mañana y la quesería antes del almuerzo.",
      "Día 2: Cooperativa por la tarde seguida de una cena especial con todos los productos descubiertos.",
      "Pregunta siempre por la temporada actual y qué productos están en su mejor momento."
    ],
    practicalInfo: {
      level: "Fácil - Ideal para familias",
      duration: "2 días relajados",
      recommendedPeople: "2-6 personas",
      localTips: [
        "Lleva bolsas de tela para las compras en mercados",
        "Madruga para encontrar los mejores productos",
        "Pregunta por recetas tradicionales a los productores",
        "La mejor época depende de la temporada que quieras descubrir"
      ]
    }
  }
];

export const getRouteById = (id: string): RouteDetail | undefined => {
  return routesData.find(route => route.id === id);
};