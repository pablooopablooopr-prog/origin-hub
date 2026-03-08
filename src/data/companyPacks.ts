export interface CompanyPack {
  id: string;
  name: string;
  type: 'micro' | 'raiz' | 'esencia' | 'gourmet';
  price: number;
  description: string;
  expandedDescription: string;
  company: {
    name: string;
    logo: string;
    location: string;
  };
  region: string;
  autonomousCommunity: string;
  categories: string[];
  image?: string;
  products: {
    name: string;
    description: string;
    company: string;
    companyLogo: string;
    seasonal?: boolean;
    limitedEdition?: boolean;
  }[];
  addedValue?: string[];
  qualitySeal?: boolean;
  featured?: 'recommended' | 'bestseller' | 'new';
  rating: number;
  reviews: number;
  fastShipping: boolean;
  sustainablePackaging: boolean;
  loyaltyPoints: number;
  seasonal?: boolean;
}

export const companyPacks: CompanyPack[] = [
  // ===== MICROSELECCIONES =====
  {
    id: "micro-miel-alpujarra",
    name: "Miel Pura de la Alpujarra",
    type: "micro",
    price: 15,
    description: "Un tarro de miel artesana de montaña, recolectada a mano en la Alpujarra granadina.",
    expandedDescription: "Miel cruda y sin pasteurizar, elaborada por abejas que polinizan las flores silvestres de la Alpujarra. Cada tarro es único según la temporada de floración. Un pequeño tesoro del sur que concentra todo el sabor de la sierra.",
    company: {
      name: "Colmenas del Valle",
      logo: "/lovable-uploads/2e843717-7b23-4291-b3d1-54fb8e5f294c.png",
      location: "Granada"
    },
    region: "Granada",
    autonomousCommunity: "Andalucía",
    categories: ["Miel"],
    products: [
      {
        name: "Miel de Flores de Montaña 250g",
        description: "Miel cruda multifloral de alta montaña",
        company: "Colmenas del Valle",
        companyLogo: "/lovable-uploads/2e843717-7b23-4291-b3d1-54fb8e5f294c.png",
        limitedEdition: true
      }
    ],
    addedValue: ["Envío cuidado en caja ecológica"],
    qualitySeal: true,
    featured: "new",
    rating: 4.8,
    reviews: 42,
    fastShipping: true,
    sustainablePackaging: true,
    loyaltyPoints: 15
  },
  {
    id: "micro-pimenton-vera",
    name: "Pimentón de la Vera DOP",
    type: "micro",
    price: 15,
    description: "Pimentón ahumado artesano con Denominación de Origen Protegida, directo de Extremadura.",
    expandedDescription: "Elaborado con pimientos secados lentamente al humo de encina, este pimentón conserva el método tradicional que lleva siglos practicándose en La Vera. Un imprescindible de la despensa española en formato auténtico.",
    company: {
      name: "Ahumados de la Vera",
      logo: "/lovable-uploads/a327eccb-ce74-42aa-9e98-6181b1501e23.png",
      location: "Cáceres"
    },
    region: "Cáceres",
    autonomousCommunity: "Extremadura",
    categories: ["Otros artesanales"],
    products: [
      {
        name: "Pimentón Ahumado DOP Lata 75g",
        description: "Pimentón dulce ahumado con leña de encina",
        company: "Ahumados de la Vera",
        companyLogo: "/lovable-uploads/a327eccb-ce74-42aa-9e98-6181b1501e23.png"
      }
    ],
    addedValue: ["Recetario tradicional incluido"],
    qualitySeal: true,
    rating: 4.9,
    reviews: 67,
    fastShipping: true,
    sustainablePackaging: true,
    loyaltyPoints: 15
  },

  // ===== ANDALUCÍA =====
  {
    id: "pack-raiz-olivar-sierra",
    name: "Pack Raíz - Olivar de la Sierra",
    type: "raiz",
    price: 35,
    description: "Lo esencial de la tierra andaluza. Productos artesanos que capturan la esencia del sur.",
    expandedDescription: "Una selección auténtica y asequible que captura los sabores más representativos de Andalucía. Ideal para descubrir lo esencial de la región sin gastar mucho.",
    company: {
      name: "Olivar de la Sierra",
      logo: "/lovable-uploads/2e843717-7b23-4291-b3d1-54fb8e5f294c.png",
      location: "Granada"
    },
    region: "Granada",
    autonomousCommunity: "Andalucía",
    categories: ["Aceites", "Dulces"],
    products: [
      {
        name: "Aceite de Oliva Virgen Extra",
        description: "Aceite artesano de primera prensada en frío",
        company: "Olivar de la Sierra",
        companyLogo: "/lovable-uploads/2e843717-7b23-4291-b3d1-54fb8e5f294c.png"
      },
      {
        name: "Almendras Garrapiñadas",
        description: "Dulce tradicional andaluz",
        company: "Olivar de la Sierra",
        companyLogo: "/lovable-uploads/2e843717-7b23-4291-b3d1-54fb8e5f294c.png"
      }
    ],
    addedValue: ["Cata guiada de aceites", "Libro de recetas tradicionales de Granada"],
    qualitySeal: true,
    featured: "recommended",
    rating: 4.6,
    reviews: 89,
    fastShipping: true,
    sustainablePackaging: true,
    loyaltyPoints: 35
  },
  {
    id: "pack-esencia-olivar-sierra",
    name: "Pack Esencia - Olivar de la Sierra",
    type: "esencia",
    price: 60,
    description: "Selección equilibrada con carácter andaluz. La esencia de nuestra tierra.",
    expandedDescription: "El Pack Esencia recoge una cuidada combinación de alimentos artesanales que representan la tradición y calidad andaluza. Un viaje gastronómico más completo por los sabores del sur.",
    company: {
      name: "Olivar de la Sierra",
      logo: "/lovable-uploads/2e843717-7b23-4291-b3d1-54fb8e5f294c.png",
      location: "Granada"
    },
    region: "Granada",
    autonomousCommunity: "Andalucía",
    categories: ["Aceites", "Embutidos", "Miel", "Dulces"],
    products: [
      {
        name: "Aceite Picual Premium",
        description: "Aceite de oliva virgen extra ecológico",
        company: "Olivar de la Sierra",
        companyLogo: "/lovable-uploads/2e843717-7b23-4291-b3d1-54fb8e5f294c.png",
        limitedEdition: true
      },
      {
        name: "Jamón Serrano de Trevélez DOP",
        description: "Jamón curado en alta montaña",
        company: "Jamones de la Alpujarra",
        companyLogo: "/lovable-uploads/2e843717-7b23-4291-b3d1-54fb8e5f294c.png"
      },
      {
        name: "Miel de Flores de Montaña",
        description: "Miel artesana de la Alpujarra",
        company: "Colmenas del Valle",
        companyLogo: "/lovable-uploads/2e843717-7b23-4291-b3d1-54fb8e5f294c.png"
      }
    ],
    addedValue: ["Visita guiada a almazara", "Cata de aceites"],
    qualitySeal: true,
    featured: "bestseller",
    rating: 4.9,
    reviews: 203,
    fastShipping: true,
    sustainablePackaging: true,
    loyaltyPoints: 60
  },
  {
    id: "pack-raiz-sabor-serrano",
    name: "Pack Raíz - Sabor Serrano",
    type: "raiz",
    price: 35,
    description: "Tradición serrana en cada bocado. Lo auténtico de la montaña andaluza.",
    expandedDescription: "Descubre los sabores tradicionales de la sierra andaluza con productos artesanos seleccionados de pequeños productores locales.",
    company: {
      name: "Sabor Serrano",
      logo: "/lovable-uploads/a327eccb-ce74-42aa-9e98-6181b1501e23.png",
      location: "Jaén"
    },
    region: "Jaén",
    autonomousCommunity: "Andalucía",
    categories: ["Embutidos", "Quesos"],
    products: [
      {
        name: "Chorizo Serrano",
        description: "Chorizo artesano curado al aire de montaña",
        company: "Sabor Serrano",
        companyLogo: "/lovable-uploads/a327eccb-ce74-42aa-9e98-6181b1501e23.png"
      },
      {
        name: "Queso de Cabra Curado",
        description: "Queso artesano de cabra payoya",
        company: "Quesería El Castillo",
        companyLogo: "/lovable-uploads/a327eccb-ce74-42aa-9e98-6181b1501e23.png"
      }
    ],
    addedValue: ["Envío gratuito"],
    qualitySeal: false,
    rating: 4.4,
    reviews: 76,
    fastShipping: true,
    sustainablePackaging: false,
    loyaltyPoints: 35
  },
  {
    id: "pack-esencia-sabor-serrano",
    name: "Pack Esencia - Sabor Serrano",
    type: "esencia",
    price: 60,
    description: "La esencia de la sierra andaluza. Productos con historia y sabor.",
    expandedDescription: "Una cuidada selección que captura el alma de la sierra andaluza, con productos que llevan generaciones elaborándose de la misma forma tradicional.",
    company: {
      name: "Sabor Serrano",
      logo: "/lovable-uploads/a327eccb-ce74-42aa-9e98-6181b1501e23.png",
      location: "Jaén"
    },
    region: "Jaén",
    autonomousCommunity: "Andalucía",
    categories: ["Embutidos", "Quesos", "Aceites"],
    products: [
      {
        name: "Lomo Embuchado Ibérico",
        description: "Lomo curado artesanalmente",
        company: "Sabor Serrano",
        companyLogo: "/lovable-uploads/a327eccb-ce74-42aa-9e98-6181b1501e23.png"
      },
      {
        name: "Queso Semicurado de Oveja",
        description: "Queso tradicional de oveja segureña",
        company: "Quesería El Castillo",
        companyLogo: "/lovable-uploads/a327eccb-ce74-42aa-9e98-6181b1501e23.png"
      },
      {
        name: "Aceite Premium Picual",
        description: "Aceite de primera calidad",
        company: "Molino Los Olivos",
        companyLogo: "/lovable-uploads/a327eccb-ce74-42aa-9e98-6181b1501e23.png"
      }
    ],
    addedValue: ["Incluye degustación", "Pack exclusivo de temporada"],
    qualitySeal: true,
    rating: 4.7,
    reviews: 134,
    fastShipping: true,
    sustainablePackaging: true,
    loyaltyPoints: 60
  },

  // ===== CASTILLA Y LEÓN =====
  {
    id: "pack-raiz-cecinas-pablo",
    name: "Pack Raíz - Cecinas Pablo",
    type: "raiz",
    price: 35,
    description: "Lo esencial de Castilla y León. Productos tradicionales de la meseta.",
    expandedDescription: "El Pack Raíz de Cecinas Pablo te acerca a los sabores más auténticos de León, con productos elaborados siguiendo métodos centenarios.",
    company: {
      name: "Cecinas Pablo",
      logo: "/lovable-uploads/3300b4e5-f593-466b-a789-16c6237a5b84.png",
      location: "León"
    },
    region: "León",
    autonomousCommunity: "Castilla y León",
    categories: ["Embutidos", "Quesos"],
    products: [
      {
        name: "Cecina de León IGP",
        description: "Cecina artesana curada al aire de montaña",
        company: "Cecinas Pablo",
        companyLogo: "/lovable-uploads/3300b4e5-f593-466b-a789-16c6237a5b84.png"
      },
      {
        name: "Queso de Valdeón DOP",
        description: "Queso azul curado en cuevas naturales",
        company: "Quesería Los Picos",
        companyLogo: "/lovable-uploads/3300b4e5-f593-466b-a789-16c6237a5b84.png"
      }
    ],
    addedValue: ["Degustación incluida", "Recetario tradicional"],
    qualitySeal: true,
    featured: "recommended",
    rating: 4.8,
    reviews: 156,
    fastShipping: true,
    sustainablePackaging: true,
    loyaltyPoints: 35
  },
  {
    id: "pack-esencia-cecinas-pablo",
    name: "Pack Esencia - Cecinas Pablo",
    type: "esencia",
    price: 60,
    description: "La esencia de Castilla y León. Tradición centenaria en cada producto.",
    expandedDescription: "Una selección que representa la mejor tradición chacinera leonesa, con productos que han pasado de generación en generación.",
    company: {
      name: "Cecinas Pablo",
      logo: "/lovable-uploads/3300b4e5-f593-466b-a789-16c6237a5b84.png",
      location: "León"
    },
    region: "León",
    autonomousCommunity: "Castilla y León",
    categories: ["Embutidos", "Quesos", "Conservas"],
    products: [
      {
        name: "Cecina de León IGP Premium",
        description: "Cecina de máxima calidad curada 24 meses",
        company: "Cecinas Pablo",
        companyLogo: "/lovable-uploads/3300b4e5-f593-466b-a789-16c6237a5b84.png"
      },
      {
        name: "Botillo del Bierzo IGP",
        description: "Embutido tradicional leonés",
        company: "Cecinas Pablo",
        companyLogo: "/lovable-uploads/3300b4e5-f593-466b-a789-16c6237a5b84.png"
      },
      {
        name: "Queso Zamorano DOP",
        description: "Queso curado de oveja churra",
        company: "Quesería Castilla",
        companyLogo: "/lovable-uploads/3300b4e5-f593-466b-a789-16c6237a5b84.png"
      }
    ],
    addedValue: ["Visita a secadero tradicional", "Cata dirigida"],
    qualitySeal: true,
    rating: 4.9,
    reviews: 187,
    fastShipping: true,
    sustainablePackaging: true,
    loyaltyPoints: 60
  },

  // ===== GALICIA =====
  {
    id: "pack-raiz-conservas-ortega",
    name: "Pack Raíz - Conservas Ortega",
    type: "raiz",
    price: 35,
    description: "El sabor auténtico del mar gallego. Tradición conservera familiar.",
    expandedDescription: "Descubre la esencia de la costa gallega con conservas artesanas elaboradas por una familia que lleva cuatro generaciones dedicada al mar.",
    company: {
      name: "Conservas Ortega",
      logo: "/lovable-uploads/83f11de4-7868-48bc-bcf0-9c5fd4e36abe.png",
      location: "Vigo"
    },
    region: "Vigo",
    autonomousCommunity: "Galicia",
    categories: ["Conservas", "Dulces"],
    products: [
      {
        name: "Sardinas en Aceite de Oliva",
        description: "Sardinas gallegas conservadas artesanalmente",
        company: "Conservas Ortega",
        companyLogo: "/lovable-uploads/83f11de4-7868-48bc-bcf0-9c5fd4e36abe.png"
      },
      {
        name: "Tarta de Santiago Mini",
        description: "Dulce tradicional gallego",
        company: "Repostería Compostela",
        companyLogo: "/lovable-uploads/83f11de4-7868-48bc-bcf0-9c5fd4e36abe.png"
      }
    ],
    addedValue: ["Envío gratuito"],
    qualitySeal: false,
    rating: 4.5,
    reviews: 98,
    fastShipping: true,
    sustainablePackaging: true,
    loyaltyPoints: 35
  },
  {
    id: "pack-gourmet-conservas-ortega",
    name: "Pack Gourmet - Conservas Ortega",
    type: "gourmet",
    price: 90,
    description: "Para los paladares exigentes. La máxima expresión del mar gallego.",
    expandedDescription: "El Pack Gourmet de Conservas Ortega es una experiencia sensorial completa del mejor marisco y pescado gallego, con productos premium y de temporada.",
    company: {
      name: "Conservas Ortega",
      logo: "/lovable-uploads/83f11de4-7868-48bc-bcf0-9c5fd4e36abe.png",
      location: "Vigo"
    },
    region: "Vigo",
    autonomousCommunity: "Galicia",
    categories: ["Conservas", "Quesos", "Vinos", "Dulces"],
    products: [
      {
        name: "Conservas Premium Variadas",
        description: "Selección de conservas artesanas del mar",
        company: "Conservas Ortega",
        companyLogo: "/lovable-uploads/83f11de4-7868-48bc-bcf0-9c5fd4e36abe.png"
      },
      {
        name: "Queso San Simón da Costa DOP",
        description: "Queso ahumado con madera de abedul",
        company: "Quesería Monte Verde",
        companyLogo: "/lovable-uploads/83f11de4-7868-48bc-bcf0-9c5fd4e36abe.png"
      },
      {
        name: "Licor de Hierbas Gallego",
        description: "Licor artesano de hierbas autóctonas",
        company: "Destilería Casa do Monte",
        companyLogo: "/lovable-uploads/83f11de4-7868-48bc-bcf0-9c5fd4e36abe.png"
      },
      {
        name: "Pulpo Cocido al Vacío",
        description: "Pulpo gallego cocido tradicionalmente",
        company: "Mariscos Rías",
        companyLogo: "/lovable-uploads/83f11de4-7868-48bc-bcf0-9c5fd4e36abe.png"
      }
    ],
    addedValue: ["Experiencia en conservera", "Cata de licores", "Maridaje con vinos gallegos", "Recomendado por ORIGEN"],
    qualitySeal: true,
    featured: "new",
    rating: 5.0,
    reviews: 89,
    fastShipping: true,
    sustainablePackaging: true,
    loyaltyPoints: 90
  }
];

export const getPackById = (id: string): CompanyPack | undefined => {
  return companyPacks.find(pack => pack.id === id);
};

export const getPacksByRegion = (region: string): CompanyPack[] => {
  return companyPacks.filter(pack => pack.region.toLowerCase() === region.toLowerCase());
};

export const getPacksByCategory = (category: string): CompanyPack[] => {
  return companyPacks.filter(pack => 
    pack.categories.some(cat => cat.toLowerCase() === category.toLowerCase())
  );
};

export const getFeaturedPacks = (): CompanyPack[] => {
  return companyPacks.filter(pack => pack.featured);
};

export const filterPacks = (
  packs: CompanyPack[],
  filters: {
    location?: string;
    categories?: string[];
    packType?: string;
    addedValue?: string[];
    priceRange?: string;
  }
): CompanyPack[] => {
  return packs.filter(pack => {
    // Location filter
    if (filters.location && pack.autonomousCommunity !== filters.location) {
      return false;
    }

    // Categories filter
    if (filters.categories && filters.categories.length > 0) {
      const hasMatchingCategory = filters.categories.some(category =>
        pack.categories.some(packCategory => 
          packCategory.toLowerCase() === category.toLowerCase()
        )
      );
      if (!hasMatchingCategory) return false;
    }

    // Pack type filter
    if (filters.packType && pack.type !== filters.packType) {
      return false;
    }

    // Added value filter
    if (filters.addedValue && filters.addedValue.length > 0) {
      const hasMatchingValue = filters.addedValue.some(value => {
        if (!pack.addedValue) return false;
        
        // Handle specific mappings
        const valueMapping: { [key: string]: string[] } = {
          "Incluye degustación": ["Degustación incluida", "Incluye degustación", "Cata dirigida", "Cata de aceites", "Cata de licores"],
          "Envío gratuito": ["Envío gratuito"],
          "Pack exclusivo de temporada": ["Pack exclusivo de temporada"],
          "Recomendado por ORIGEN": ["Recomendado por ORIGEN"]
        };
        
        const mappedValues = valueMapping[value] || [value];
        return mappedValues.some(mappedValue => 
          pack.addedValue!.some(packValue => 
            packValue.toLowerCase() === mappedValue.toLowerCase()
          )
        );
      });
      if (!hasMatchingValue) return false;
    }

    // Price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(p => parseInt(p));
      if (max && (pack.price < min || pack.price > max)) {
        return false;
      }
      if (!max && pack.price < min) {
        return false;
      }
    }

    return true;
  });
};

export const regions = [
  "Castilla y León", "Andalucía", "Galicia", "Aragón", "Cataluña", 
  "Valencia", "Madrid", "País Vasco", "Asturias", "Cantabria",
  "Navarra", "Extremadura", "Murcia", "La Rioja", "Castilla-La Mancha"
];

export const categories = [
  "Quesos", "Carnes", "Embutidos", "Lácteos", "Miel", "Vinos", 
  "Dulces", "Panes", "Conservas", "Aceites", "Frutas y verduras",
  "Productos sin gluten", "Ecológicos / Bio", "Otros artesanales"
];