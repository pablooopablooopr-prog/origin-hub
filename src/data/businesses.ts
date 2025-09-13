export interface Business {
  id: string;
  name: string;
  category: string;
  description: string;
  address: string;
  city: string;
  province: string;
  coordinates: [number, number]; // [longitude, latitude]
  rating: number;
  tags: string[];
  phone?: string;
  website?: string;
}

export const businessesData: Business[] = [
  // Madrid
  {
    id: "1",
    name: "Panadería San Ginés",
    category: "Fermentos",
    description: "Pan artesano con masa madre desde 1894",
    address: "Calle Mayor, 12",
    city: "Madrid",
    province: "Madrid",
    coordinates: [-3.7038, 40.4168],
    rating: 4.8,
    tags: ["Artesano", "Sin aditivos", "Tradicional"]
  },
  {
    id: "2",
    name: "Carnicería Los Madriles",
    category: "Carnes",
    description: "Carne de ganadería extensiva de la Sierra",
    address: "Plaza de la Paja, 8",
    city: "Madrid", 
    province: "Madrid",
    coordinates: [-3.7109, 40.4095],
    rating: 4.7,
    tags: ["Ecológico", "Km 0", "Calidad Premium"]
  },
  {
    id: "3",
    name: "Quesería Manchega Real",
    category: "Lácteos",
    description: "Quesos artesanos de oveja manchega",
    address: "Mercado de San Miguel, Puesto 15",
    city: "Madrid",
    province: "Madrid", 
    coordinates: [-3.7077, 40.4155],
    rating: 4.9,
    tags: ["D.O. La Mancha", "Artesano", "Curado tradicional"]
  },
  
  // Barcelona
  {
    id: "4",
    name: "Herbolario Cal Xerta",
    category: "Herbolarios",
    description: "Productos naturales y plantas medicinales",
    address: "Carrer del Pi, 3",
    city: "Barcelona",
    province: "Barcelona",
    coordinates: [2.1734, 41.3851],
    rating: 4.6,
    tags: ["Ecológico", "Plantas medicinales", "Natural"]
  },
  {
    id: "5", 
    name: "Granja Catalana Sostenible",
    category: "Lácteos",
    description: "Yogures y quesos de cabra ecológicos",
    address: "Passeig de Gràcia, 85",
    city: "Barcelona",
    province: "Barcelona",
    coordinates: [2.1607, 41.3954],
    rating: 4.5,
    tags: ["Ecológico", "Cabra", "Sostenible"]
  },
  
  // Valencia
  {
    id: "6",
    name: "Huerta Valenciana Natural",
    category: "Vida Natural",
    description: "Verduras de temporada y cítricos",
    address: "Mercado Central, Puesto 42",
    city: "Valencia", 
    province: "Valencia",
    coordinates: [-0.3762, 39.4699],
    rating: 4.8,
    tags: ["Temporada", "Cítricos", "Huerta tradicional"]
  },
  {
    id: "7",
    name: "Almazara del Turia",
    category: "Vida Natural", 
    description: "Aceite de oliva virgen extra ecológico",
    address: "Plaza del Mercado, 19",
    city: "Valencia",
    province: "Valencia",
    coordinates: [-0.3774, 39.4734],
    rating: 4.7,
    tags: ["AOVE", "Ecológico", "Prensado en frío"]
  },

  // Sevilla
  {
    id: "8",
    name: "Jamones de la Sierra",
    category: "Carnes",
    description: "Jamón ibérico de bellota 100% puro",
    address: "Calle Sierpes, 74",
    city: "Sevilla",
    province: "Sevilla", 
    coordinates: [-5.9931, 37.3891],
    rating: 4.9,
    tags: ["Bellota", "100% Ibérico", "D.O. Jabugo"]
  },
  {
    id: "9",
    name: "Telares Andaluces",
    category: "EcoModa",
    description: "Textiles sostenibles y artesanía local",
    address: "Barrio de Santa Cruz, 12",
    city: "Sevilla",
    province: "Sevilla",
    coordinates: [-5.9884, 37.3848],
    rating: 4.4,
    tags: ["Sostenible", "Artesanía", "Lino orgánico"]
  },

  // Bilbao
  {
    id: "10", 
    name: "Pescados del Cantábrico",
    category: "Vida Natural",
    description: "Pescado fresco de lonja diaria",
    address: "Mercado de la Ribera, 8",
    city: "Bilbao",
    province: "Vizcaya",
    coordinates: [-2.9249, 43.2627],
    rating: 4.8,
    tags: ["Fresco", "Lonja", "Sostenible"]
  },
  {
    id: "11",
    name: "Sidrerías Asturianas", 
    category: "Fermentos",
    description: "Sidra natural artesana asturiana",
    address: "Calle del Arenal, 5",
    city: "Bilbao", 
    province: "Vizcaya",
    coordinates: [-2.9253, 43.2563],
    rating: 4.6,
    tags: ["Artesana", "Natural", "D.O. Asturias"]
  },

  // Zaragoza
  {
    id: "12",
    name: "Frutas del Ebro",
    category: "Vida Natural", 
    description: "Fruta de temporada del Valle del Ebro",
    address: "Mercado Central, 23",
    city: "Zaragoza",
    province: "Zaragoza",
    coordinates: [-0.8773, 41.6488],
    rating: 4.5,
    tags: ["Temporada", "Valle del Ebro", "Fresca"]
  },
  {
    id: "13",
    name: "Ternasco Aragonés",
    category: "Carnes",
    description: "Cordero ternasco I.G.P. Aragón",
    address: "Plaza del Pilar, 18",
    city: "Zaragoza",
    province: "Zaragoza", 
    coordinates: [-0.8791, 41.6561],
    rating: 4.7,
    tags: ["I.G.P.", "Ternasco", "Aragón"]
  },

  // Málaga
  {
    id: "14",
    name: "Aceitunas Malagueñas",
    category: "Vida Natural",
    description: "Aceitunas aliñadas tradicionales",
    address: "Calle Larios, 9", 
    city: "Málaga",
    province: "Málaga",
    coordinates: [-4.4214, 36.7196],
    rating: 4.6,
    tags: ["Tradicionales", "Aliñadas", "Málaga"]
  },
  {
    id: "15",
    name: "Moda Sostenible Andaluza",
    category: "EcoModa",
    description: "Ropa eco-friendly y comercio justo",
    address: "Plaza de la Constitución, 7",
    city: "Málaga",
    province: "Málaga",
    coordinates: [-4.4203, 36.7213],
    rating: 4.3,
    tags: ["Eco-friendly", "Comercio justo", "Sostenible"]
  }
];

export const categories = [
  { name: "Carnes", icon: "Beef", count: 89, color: "bg-primary" },
  { name: "Lácteos", icon: "Milk", count: 67, color: "bg-secondary" },
  { name: "Fermentos", icon: "Wheat", count: 45, color: "bg-moss-medium" },
  { name: "Herbolarios", icon: "Leaf", count: 78, color: "bg-earth-medium" },
  { name: "EcoModa", icon: "Shirt", count: 34, color: "bg-accent" },
  { name: "Vida Natural", icon: "Heart", count: 56, color: "bg-moss-dark" }
];