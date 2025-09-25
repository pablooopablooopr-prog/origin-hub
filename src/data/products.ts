export interface Product {
  id: string;
  name: string;
  producer: {
    name: string;
    location: string;
    distance?: string; // e.g., "15 km"
  };
  description: string;
  image: string;
  price: number;
  originalPrice?: number; // For showing discounts
  badges: ('Km0' | 'DOP' | 'Bio' | 'Artesano' | 'Más vendido' | 'Producto Estrella')[];
  category: 'queso' | 'carnes' | 'conservas' | 'vinos' | 'dulces' | 'aceites' | 'otros';
  weight?: string;
  available: boolean;
  stock?: number;
}

export interface ProductPack {
  id: string;
  title: string;
  region: string;
  description: string;
  image: string;
  priceRange: {
    min: number;
    max: number;
  };
  category: 'regional' | 'budget' | 'theme';
  budgetType?: 'cazador' | 'tribu' | 'sabio'; // Only for budget category
  themeType?: 'quesos' | 'carnes' | 'dulces' | 'vinos'; // Only for theme category
  products: Product[];
  customizable: boolean;
  highlighted: boolean;
  totalProducts: number;
  estimatedDelivery: string;
  freeShippingFrom?: number;
}

export const productsData: Product[] = [
  // León products
  {
    id: "cecina-pablo",
    name: "Cecina de León IGP",
    producer: {
      name: "Cecinas Pablo",
      location: "Astorga, León",
      distance: "2 km"
    },
    description: "Cecina artesana curada durante 7 meses en secaderos naturales. Elaborada siguiendo métodos centenarios.",
    image: "/lovable-uploads/3300b4e5-f593-466b-a789-16c6237a5b84.png",
    price: 24.50,
    badges: ['DOP', 'Artesano', 'Más vendido'],
    category: 'carnes',
    weight: "200g",
    available: true,
    stock: 15
  },
  {
    id: "queso-valdeon",
    name: "Queso de Valdeón DOP",
    producer: {
      name: "Quesería Los Picos",
      location: "Posada de Valdeón, León"
    },
    description: "Queso azul elaborado con leche de vaca y cabra, madurado en cuevas naturales de los Picos de Europa.",
    image: "/lovable-uploads/3300b4e5-f593-466b-a789-16c6237a5b84.png",
    price: 18.90,
    originalPrice: 21.90,
    badges: ['DOP', 'Artesano'],
    category: 'queso',
    weight: "300g",
    available: true,
    stock: 8
  },
  {
    id: "botillo-bierzo",
    name: "Botillo del Bierzo IGP",
    producer: {
      name: "Casa Pepe",
      location: "Ponferrada, León"
    },
    description: "Embutido tradicional del Bierzo elaborado con carnes selectas de cerdo y especias naturales.",
    image: "/lovable-uploads/3300b4e5-f593-466b-a789-16c6237a5b84.png",
    price: 32.00,
    badges: ['DOP', 'Artesano', 'Producto Estrella'],
    category: 'carnes',
    weight: "500g",
    available: true,
    stock: 5
  },

  // Granada products
  {
    id: "aceite-picual",
    name: "Aceite de Oliva Virgen Extra Picual",
    producer: {
      name: "Olivar de la Sierra",
      location: "Granada",
      distance: "5 km"
    },
    description: "AOVE de primera presión en frío, de olivos centenarios. Intenso y afrutado.",
    image: "/lovable-uploads/2e843717-7b23-4291-b3d1-54fb8e5f294c.png",
    price: 16.50,
    badges: ['Bio', 'Km0', 'Artesano'],
    category: 'aceites',
    weight: "500ml",
    available: true,
    stock: 12
  },
  {
    id: "jamon-trevelez",
    name: "Jamón Serrano de Trevélez DOP",
    producer: {
      name: "Jamones de la Alpujarra",
      location: "Trevélez, Granada"
    },
    description: "Jamón curado a 1.200m de altitud. Mínimo 14 meses de curación natural.",
    image: "/lovable-uploads/2e843717-7b23-4291-b3d1-54fb8e5f294c.png",
    price: 89.90,
    badges: ['DOP', 'Artesano', 'Producto Estrella'],
    category: 'carnes',
    weight: "2kg (pieza entera)",
    available: true,
    stock: 3
  },
  {
    id: "miel-alpujarra",
    name: "Miel de Flores de Montaña",
    producer: {
      name: "Colmenas del Valle",
      location: "Capileira, Granada"
    },
    description: "Miel multiflorar de la Alpujarra granadina. Cristalización natural.",
    image: "/lovable-uploads/2e843717-7b23-4291-b3d1-54fb8e5f294c.png",
    price: 12.80,
    badges: ['Bio', 'Artesano'],
    category: 'dulces',
    weight: "450g",
    available: true,
    stock: 20
  },

  // Galicia products
  {
    id: "conservas-ortega",
    name: "Conservas Premium Variadas",
    producer: {
      name: "Conservas Ortega",
      location: "Cambados, Pontevedra"
    },
    description: "Pack de conservas artesanas: berberechos, mejillones y pulpo en aceite de oliva.",
    image: "/lovable-uploads/83f11de4-7868-48bc-bcf0-9c5fd4e36abe.png",
    price: 28.50,
    badges: ['Artesano', 'Más vendido'],
    category: 'conservas',
    weight: "3 latas",
    available: true,
    stock: 18
  },
  {
    id: "queso-san-simon",
    name: "Queso San Simón da Costa DOP",
    producer: {
      name: "Quesería Monte Verde",
      location: "Villalba, Lugo"
    },
    description: "Queso ahumado con madera de abedul. Sabor único y textura cremosa.",
    image: "/lovable-uploads/83f11de4-7868-48bc-bcf0-9c5fd4e36abe.png",
    price: 22.40,
    badges: ['DOP', 'Artesano'],
    category: 'queso',
    weight: "400g",
    available: true,
    stock: 10
  },
  {
    id: "licor-hierbas",
    name: "Licor de Hierbas Gallego",
    producer: {
      name: "Destilería Casa do Monte",
      location: "Samos, Lugo"
    },
    description: "Licor artesano de hierbas gallegas recolectadas a mano. Receta familiar centenaria.",
    image: "/lovable-uploads/83f11de4-7868-48bc-bcf0-9c5fd4e36abe.png",
    price: 19.90,
    badges: ['Artesano', 'Producto Estrella'],
    category: 'otros',
    weight: "700ml",
    available: true,
    stock: 7
  }
];

export const packsData: ProductPack[] = [
  {
    id: "leon",
    title: "Pack Tierra de León",
    region: "León",
    description: "Lo mejor de la gastronomía leonesa: cecina IGP, queso de Valdeón DOP y botillo del Bierzo. Productos artesanos con siglos de tradición.",
    image: "/lovable-uploads/3300b4e5-f593-466b-a789-16c6237a5b84.png",
    priceRange: {
      min: 65.00,
      max: 89.00
    },
    category: 'regional',
    products: [
      productsData.find(p => p.id === "cecina-pablo")!,
      productsData.find(p => p.id === "queso-valdeon")!,
      productsData.find(p => p.id === "botillo-bierzo")!
    ],
    customizable: true,
    highlighted: true,
    totalProducts: 3,
    estimatedDelivery: "2-3 días laborables",
    freeShippingFrom: 50
  },
  {
    id: "granada",
    title: "Pack Granada Natural",
    region: "Granada",
    description: "Sabores únicos de Granada: AOVE Picual ecológico, jamón de Trevélez DOP y miel pura de la Alpujarra.",
    image: "/lovable-uploads/2e843717-7b23-4291-b3d1-54fb8e5f294c.png",
    priceRange: {
      min: 85.00,
      max: 125.00
    },
    category: 'regional',
    products: [
      productsData.find(p => p.id === "aceite-picual")!,
      productsData.find(p => p.id === "jamon-trevelez")!,
      productsData.find(p => p.id === "miel-alpujarra")!
    ],
    customizable: true,
    highlighted: false,
    totalProducts: 3,
    estimatedDelivery: "3-4 días laborables"
  },
  {
    id: "galicia",
    title: "Pack Galicia Auténtica",
    region: "Galicia",
    description: "Tradición marinera y rural gallega: conservas artesanas Ortega, queso San Simón DOP ahumado y licor de hierbas.",
    image: "/lovable-uploads/83f11de4-7868-48bc-bcf0-9c5fd4e36abe.png",
    priceRange: {
      min: 60.00,
      max: 85.00
    },
    category: 'regional',
    products: [
      productsData.find(p => p.id === "conservas-ortega")!,
      productsData.find(p => p.id === "queso-san-simon")!,
      productsData.find(p => p.id === "licor-hierbas")!
    ],
    customizable: true,
    highlighted: false,
    totalProducts: 3,
    estimatedDelivery: "2-3 días laborables",
    freeShippingFrom: 45
  },
  {
    id: "cazador",
    title: "Pack Cazador",
    region: "Nacional",
    description: "Descubre España con productos seleccionados de diferentes regiones. Perfecto para iniciarse en los sabores auténticos.",
    image: "/lovable-uploads/clean-enso-symbol.png",
    priceRange: {
      min: 25.00,
      max: 30.00
    },
    category: 'budget',
    budgetType: 'cazador',
    products: [
      {
        ...productsData.find(p => p.id === "miel-alpujarra")!,
        price: 12.80
      },
      {
        ...productsData.find(p => p.id === "aceite-picual")!,
        price: 16.50
      }
    ],
    customizable: false,
    highlighted: false,
    totalProducts: 2,
    estimatedDelivery: "2-3 días laborables"
  },
  {
    id: "tribu",
    title: "Pack Tribu",
    region: "Nacional",
    description: "Selección intermedia con productos premium de diferentes regiones. Ideal para compartir en familia.",
    image: "/lovable-uploads/clean-enso-symbol.png",
    priceRange: {
      min: 45.00,
      max: 50.00
    },
    category: 'budget',
    budgetType: 'tribu',
    products: [
      productsData.find(p => p.id === "cecina-pablo")!,
      productsData.find(p => p.id === "queso-san-simon")!
    ],
    customizable: false,
    highlighted: false,
    totalProducts: 2,
    estimatedDelivery: "2-3 días laborables"
  },
  {
    id: "sabio",
    title: "Pack Sabio",
    region: "Nacional",
    description: "Experiencia gastronómica completa con los mejores productos artesanos de España. Para los paladares más exigentes.",
    image: "/lovable-uploads/clean-enso-symbol.png",
    priceRange: {
      min: 85.00,
      max: 100.00
    },
    category: 'budget',
    budgetType: 'sabio',
    products: [
      productsData.find(p => p.id === "jamon-trevelez")!,
      productsData.find(p => p.id === "queso-valdeon")!
    ],
    customizable: true,
    highlighted: false,
    totalProducts: 2,
    estimatedDelivery: "3-4 días laborables",
    freeShippingFrom: 75
  },
  {
    id: "quesos",
    title: "Pack Amante del Queso",
    region: "Nacional",
    description: "Los mejores quesos artesanos de España: Valdeón DOP y San Simón ahumado. Para los verdaderos cheese lovers.",
    image: "/lovable-uploads/clean-enso-symbol.png",
    priceRange: {
      min: 38.00,
      max: 45.00
    },
    category: 'theme',
    themeType: 'quesos',
    products: [
      productsData.find(p => p.id === "queso-valdeon")!,
      productsData.find(p => p.id === "queso-san-simon")!
    ],
    customizable: true,
    highlighted: false,
    totalProducts: 2,
    estimatedDelivery: "2-3 días laborables"
  }
];

export const getPackById = (id: string): ProductPack | undefined => {
  return packsData.find(pack => pack.id === id);
};

export const getProductsByCategory = (category: Product['category']): Product[] => {
  return productsData.filter(product => product.category === category);
};

export const getProductsByRegion = (region: string): Product[] => {
  return productsData.filter(product => 
    product.producer.location.toLowerCase().includes(region.toLowerCase())
  );
};