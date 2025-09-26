export interface CompanyPack {
  id: string;
  name: string;
  type: 'raiz' | 'esencia' | 'gourmet';
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
  }[];
  addedValue?: string[];
  qualitySeal?: boolean;
  featured?: 'recommended' | 'bestseller' | 'new';
  rating: number;
  reviews: number;
  fastShipping: boolean;
  sustainablePackaging: boolean;
  loyaltyPoints: number;
}

export const companyPacks: CompanyPack[] = [
  {
    id: "pack-raiz-leon",
    name: "Pack Raíz",
    type: "raiz",
    price: 35,
    description: "Lo esencial de la tierra. Un pack sencillo, auténtico y asequible con los sabores más representativos de cada región.",
    expandedDescription: "El Pack Raíz es la puerta de entrada a los sabores locales. Ideal para quienes quieren conocer lo básico y verdadero de cada tierra sin gastar mucho. Productos de proximidad, directos del productor, perfectos para una primera inmersión en el alma gastronómica de cada zona.",
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
      },
      {
        name: "Botillo del Bierzo",
        description: "Embutido tradicional leonés",
        company: "Casa Pepe",
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
    loyaltyPoints: 4
  },
  {
    id: "pack-esencia-granada", 
    name: "Pack Esencia",
    type: "esencia",
    price: 60,
    description: "Selección equilibrada con carácter. Productos con personalidad que definen la esencia de una región.",
    expandedDescription: "El Pack Esencia recoge una cuidada combinación de alimentos artesanales que representan la tradición, calidad y diversidad de cada comunidad. Para quienes quieren regalarse o regalar un viaje gastronómico más completo, sin llegar al extremo gourmet. Equilibrio entre sabor, origen y valor.",
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
        companyLogo: "/lovable-uploads/2e843717-7b23-4291-b3d1-54fb8e5f294c.png"
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
      },
      {
        name: "Almendras Garrapiñadas",
        description: "Dulce tradicional andaluz",
        company: "Dulces Granada",
        companyLogo: "/lovable-uploads/2e843717-7b23-4291-b3d1-54fb8e5f294c.png"
      }
    ],
    addedValue: ["Visita guiada a almazara", "Cata de aceites", "Desayuno molinero"],
    qualitySeal: true,
    featured: "bestseller",
    rating: 4.9,
    reviews: 203,
    fastShipping: true,
    sustainablePackaging: true,
    loyaltyPoints: 6
  },
  {
    id: "pack-gourmet-galicia",
    name: "Pack Gourmet",
    type: "gourmet",
    price: 90,
    description: "Para los paladares exigentes. Alta calidad, máxima expresión del producto local.",
    expandedDescription: "El Pack Gourmet es una experiencia sensorial completa. Incluye productos premium seleccionados, algunos de edición limitada o con D.O., pensados para sibaritas, amantes del buen comer y de lo auténtico. Una muestra exclusiva del saber hacer de cada productor. Incluye detalles únicos, sorpresas y en muchos casos, opciones de degustación o visita.",
    company: {
      name: "Conservas Ortega",
      logo: "/lovable-uploads/83f11de4-7868-48bc-bcf0-9c5fd4e36abe.png",
      location: "Galicia"
    },
    region: "Galicia",
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
      },
      {
        name: "Tarta de Santiago Artesana",
        description: "Dulce tradicional con almendra marcona",
        company: "Repostería Compostela",
        companyLogo: "/lovable-uploads/83f11de4-7868-48bc-bcf0-9c5fd4e36abe.png"
      }
    ],
    addedValue: ["Experiencia en conservera", "Cata de licores", "Maridaje con vinos gallegos", "Recetario del chef"],
    qualitySeal: true,
    featured: "new",
    rating: 5.0,
    reviews: 89,
    fastShipping: true,
    sustainablePackaging: true,
    loyaltyPoints: 9
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
      const hasMatchingValue = filters.addedValue.some(value =>
        pack.addedValue?.some(packValue => 
          packValue.toLowerCase().includes(value.toLowerCase())
        )
      );
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

export const regions = ["León", "Granada", "Galicia"];
export const categories = ["Embutidos", "Aceites", "Conservas", "Quesos", "Mieles", "Vinos", "Dulces"];