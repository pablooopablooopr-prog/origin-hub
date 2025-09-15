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
    id: "ruta-aceite-andaluz",
    title: "Ruta del Aceite Andaluz",
    description: "3 almazaras tradicionales en Jaén",
    duration: "1 día",
    businesses: 3,
    rating: "Auténtico de verdad",
    participants: 24,
    image: oliveOilBottle,
    difficulty: "Fácil",
    narrative: "Sumérgete en el corazón del olivar andaluz, donde el oro líquido cobra vida entre molinos centenarios y familias que han perfeccionado el arte de la extracción durante generaciones. Esta ruta te lleva por tres almazaras tradicionales de Jaén, donde podrás presenciar el proceso completo desde la aceituna recién recolectada hasta el aceite virgen extra que llega a tu mesa.",
    stops: [
      {
        id: "almazara-cortijo-nuevo",
        name: "Almazara Cortijo Nuevo",
        type: "Almazara tradicional",
        typeIcon: "🫒",
        whatToDo: ["Degustar aceites premium", "Ver proceso de extracción", "Charla con el maestro almazarero", "Comprar aceite recién prensado"],
        address: "Carretera de Jaén-Granada, Km 15, Jaén",
        recommendedHours: "10:00 - 12:00 (ver prensado en vivo)",
        coordinates: [-3.7492, 37.7749],
        images: [oliveOilBottle],
        externalLink: "https://cortijo-nuevo.com",
        highlights: ["Aceite DOP Sierra de Cazorla", "Molinos de piedra del s. XVIII", "Cata guiada incluida"]
      },
      {
        id: "taberna-el-olivo",
        name: "Taberna El Olivo",
        type: "Bar de tapas tradicional",
        typeIcon: "🍺",
        whatToDo: ["Desayuno con aceite nuevo", "Tapas con aceite de la zona", "Vermut local", "Charla con lugareños"],
        address: "Plaza Mayor, 8, Úbeda",
        recommendedHours: "12:30 - 14:00 (hora del vermut)",
        coordinates: [-3.3706, 38.0138],
        images: [oliveOilBottle],
        highlights: ["Tostada con aceite nuevo", "Jamón ibérico de la sierra", "Ambiente auténtico local"]
      },
      {
        id: "cooperativa-san-francisco",
        name: "Cooperativa San Francisco",
        type: "Cooperativa oleícola",
        typeIcon: "🏭",
        whatToDo: ["Visita a las instalaciones", "Proceso de clasificación", "Compra directa al productor", "Degustación comparativa"],
        address: "Calle Cooperativa, 12, Baeza",
        recommendedHours: "16:00 - 18:00 (tarde tranquila)",
        coordinates: [-3.4631, 37.9932],
        images: [oliveOilBottle],
        highlights: ["Precios de cooperativa", "Aceite ecológico certificado", "Explicación técnica detallada"]
      }
    ],
    dailyRecommendations: [
      "Llega a la primera almazara entre las 10:00 y las 12:00 para presenciar el prensado matutino y probar aceite recién extraído.",
      "Reserva mesa en la taberna para el vermut - es el momento perfecto para tapear con aceite nuevo.",
      "En la cooperativa, pregunta por los aceites de edición limitada que solo venden in situ."
    ],
    practicalInfo: {
      level: "Fácil - Apto para todas las edades",
      duration: "6-8 horas (día completo)",
      recommendedPeople: "2-6 personas",
      localTips: [
        "Lleva ropa cómoda y que no importe manchar",
        "Trae una bolsa térmica para conservar el aceite",
        "Pregunta por descuentos en compras múltiples",
        "El mejor momento es durante la cosecha (octubre-diciembre)"
      ]
    }
  },
  {
    id: "sabores-castilla",
    title: "Sabores de Castilla",
    description: "Embutidos, quesos y legumbres ancestrales",
    duration: "Weekend",
    businesses: 5,
    rating: "Lo recomendaría a mi abuela",
    participants: 18,
    image: cheeseWheel,
    difficulty: "Moderada",
    narrative: "Recorre los paisajes castellanos siguiendo los sabores que han alimentado a generaciones. Esta ruta de fin de semana te sumerge en la tradición charcutera, quesera y cerealista de Castilla, donde cada familia guarda secretos transmitidos de padres a hijos. Desde las bodegas subterráneas hasta los secaderos naturales, descubrirás por qué estos productos son el alma de la cocina española.",
    stops: [
      {
        id: "queseria-los-palomares",
        name: "Quesería Los Palomares",
        type: "Quesería artesana",
        typeIcon: "🧀",
        whatToDo: ["Ver elaboración del queso", "Degustación de curados", "Aprender sobre afinado", "Comprar quesos exclusivos"],
        address: "Calle Real, 23, Villalón de Campos",
        recommendedHours: "09:00 - 11:00 (proceso matutino)",
        coordinates: [-5.0261, 42.1058],
        images: [cheeseWheel],
        highlights: ["Queso de oveja tradicional", "Curación en cuevas naturales", "Cata con el maestro quesero"]
      },
      {
        id: "charcuteria-el-cuchillo",
        name: "Charcutería El Cuchillo",
        type: "Charcutería tradicional",
        typeIcon: "🥩",
        whatToDo: ["Ver secadero tradicional", "Degustación de embutidos", "Charla sobre curado", "Compra directa"],
        address: "Plaza del Mercado, 15, Medina del Campo",
        recommendedHours: "11:30 - 13:00 (corte tradicional)",
        coordinates: [-4.9155, 41.3055],
        images: [cheeseWheel],
        highlights: ["Chorizo de bellota", "Lomo embuchado artesano", "Proceso de curado natural"]
      },
      {
        id: "posada-del-campo",
        name: "Posada del Campo",
        type: "Restaurante típico",
        typeIcon: "🍽️",
        whatToDo: ["Comida castellana auténtica", "Productos de la ruta", "Vino de la zona", "Ambiente tradicional"],
        address: "Calle Mayor, 45, Tordesillas",
        recommendedHours: "14:00 - 16:00 (almuerzo tradicional)",
        coordinates: [-5.0068, 41.5009],
        images: [cheeseWheel],
        highlights: ["Cocido castellano", "Lechazo asado", "Vinos DO Rueda"]
      },
      {
        id: "molino-san-antonio",
        name: "Molino San Antonio",
        type: "Molino harinero",
        typeIcon: "🌾",
        whatToDo: ["Ver molienda tradicional", "Comprar harinas artesanas", "Aprender sobre cereales", "Degustación de pan"],
        address: "Ribera del Duero, s/n, Simancas",
        recommendedHours: "16:30 - 18:00 (tarde de molienda)",
        coordinates: [-4.8242, 41.5959],
        images: [cheeseWheel],
        highlights: ["Molino hidráulico del s. XVI", "Harinas de trigo antiguo", "Pan horneado al momento"]
      },
      {
        id: "bodega-subterranea",
        name: "Bodega Subterránea Los Arcos",
        type: "Bodega tradicional",
        typeIcon: "🍷",
        whatToDo: ["Visita a bodegas centenarias", "Cata de vinos locales", "Historia vitivinícola", "Compra exclusiva"],
        address: "Calle Bodegas, 8, La Seca",
        recommendedHours: "18:30 - 20:00 (cata atardecer)",
        coordinates: [-5.1275, 41.3833],
        images: [cheeseWheel],
        highlights: ["Bodegas excavadas s. XII", "Vinos DO Rueda", "Cata maridada con quesos"]
      }
    ],
    dailyRecommendations: [
      "Sábado: Comienza temprano en la quesería para ver el proceso completo, luego la charcutería y almuerza en la posada.",
      "Domingo: Visita matinal al molino seguida de la bodega para terminar con una cata al atardecer.",
      "Pregunta por el 'pack degustación' que incluye productos de todos los establecimientos."
    ],
    practicalInfo: {
      level: "Moderada - Requiere desplazamientos",
      duration: "2 días completos",
      recommendedPeople: "4-8 personas (grupo ideal)",
      localTips: [
        "Reserva alojamiento en posadas rurales de la zona",
        "Lleva nevera portátil para conservar productos",
        "Pregunta por descuentos de grupo en compras",
        "La mejor época es otoño-invierno (productos de temporada)"
      ]
    }
  },
  {
    id: "costa-gallega-autentica",
    title: "Costa Gallega Auténtica",
    description: "Conserveras artesanas y marisquerías locales",
    duration: "2 días",
    businesses: 4,
    rating: "Un lugar para volver",
    participants: 31,
    image: seafoodDisplay,
    difficulty: "Fácil",
    narrative: "La costa gallega esconde tesoros culinarios que van más allá de los típicos circuitos turísticos. Esta ruta te lleva por conserveras artesanales donde el mar se convierte en manjares únicos, y marisquerías familiares donde cada plato cuenta la historia de generaciones de pescadores. Descubre cómo el Atlántico nutre una cultura gastronómica incomparable.",
    stops: [
      {
        id: "conservas-cambados",
        name: "Conservas Cambados",
        type: "Conservera artesana",
        typeIcon: "🐟",
        whatToDo: ["Ver proceso artesanal", "Degustación de conservas premium", "Comprar latas exclusivas", "Charla con conserveros"],
        address: "Puerto de Cambados, Muelle 3",
        recommendedHours: "10:00 - 12:00 (proceso matutino)",
        coordinates: [-8.8143, 42.5125],
        images: [seafoodDisplay],
        highlights: ["Berberechos al natural", "Navajas en escabeche", "Latas de edición limitada"]
      },
      {
        id: "marisqueria-o-porto",
        name: "Marisquería O Porto",
        type: "Marisquería tradicional",
        typeIcon: "🦐",
        whatToDo: ["Marisco recién capturado", "Pulpo á feira auténtico", "Vinos albariños", "Ambiente marinero"],
        address: "Rúa do Mar, 12, O Grove",
        recommendedHours: "13:30 - 15:30 (almuerzo marinero)",
        coordinates: [-8.8651, 42.4928],
        images: [seafoodDisplay],
        highlights: ["Percebes de la ría", "Centollos gallegos", "Albariño DO Rías Baixas"]
      },
      {
        id: "bateas-mejillones",
        name: "Bateas de Mejillones Rías Baixas",
        type: "Cultivo marino",
        typeIcon: "🦪",
        whatToDo: ["Visita a bateas en barco", "Ver cultivo de mejillones", "Degustación en el mar", "Compra directa"],
        address: "Puerto deportivo de Sanxenxo",
        recommendedHours: "16:00 - 18:00 (paseo marítimo)",
        coordinates: [-8.8055, 42.4001],
        images: [seafoodDisplay],
        highlights: ["Mejillones recién sacados", "Experiencia en el mar", "Vistas de las rías"]
      },
      {
        id: "panaderia-naval",
        name: "Panadería Naval",
        type: "Panadería marinera",
        typeIcon: "🥖",
        whatToDo: ["Pan de centeno tradicional", "Empanadas gallegas", "Ver horno de leña", "Degustación"],
        address: "Praza do Concello, 7, Combarro",
        recommendedHours: "08:00 - 10:00 (pan recién hecho)",
        coordinates: [-8.6875, 42.4262],
        images: [seafoodDisplay],
        highlights: ["Empanada de zamburiñas", "Pan de maíz tradicional", "Horno del s. XIX"]
      }
    ],
    dailyRecommendations: [
      "Día 1: Madruga para la conservera, almuerza marisco fresco y visita las bateas por la tarde.",
      "Día 2: Desayuno tradicional en la panadería y paseo por los pueblos marineros típicos.",
      "No olvides preguntar por las conservas de temporada que solo preparan ciertos meses del año."
    ],
    practicalInfo: {
      level: "Fácil - Ideal para familias",
      duration: "2 días relajados",
      recommendedPeople: "2-6 personas",
      localTips: [
        "Reserva la excursión a las bateas con antelación",
        "Lleva ropa de abrigo incluso en verano",
        "Pregunta por los menús degustación en las marisquerías",
        "La mejor época es primavera-verano (mejor tiempo para el mar)"
      ]
    }
  }
];

export const getRouteById = (id: string): RouteDetail | undefined => {
  return routesData.find(route => route.id === id);
};