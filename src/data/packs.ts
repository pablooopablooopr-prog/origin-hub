export interface PackStop {
  id: string;
  name: string;
  type: 'quesería' | 'carnicería' | 'bodega' | 'bar-tapas' | 'panadería' | 'restaurante';
  icon: string;
  description: string;
  activities: string[];
  address: string;
  schedule: string;
  coordinates: [number, number];
  images: string[];
  website?: string;
  reviews: {
    text: string;
    author: string;
    rating: number;
  }[];
}

export interface PackDetail {
  id: string;
  title: string;
  region: string;
  shortDescription: string;
  narrative: string;
  stops: PackStop[];
  dailyRecommendations: string[];
  practicalInfo: {
    difficulty: 'Fácil' | 'Moderado' | 'Avanzado';
    duration: string;
    recommendedPeople: string;
    tips: string[];
  };
  businesses: number;
  image: string;
  highlighted: boolean;
}

export const packsData: PackDetail[] = [
  {
    id: "leon",
    title: "Pack Tierra de León",
    region: "León",
    shortDescription: "Cecina artesana, botillo del Bierzo, queso de Valdeón",
    narrative: "León es tierra de montaña y tradición, donde cada producto cuenta una historia centenaria. En esta ruta descubrirás los sabores que han alimentado a generaciones de leoneses: desde la cecina ahumada en las antiguas secaderos hasta el queso azul que madura en las cuevas de los Picos de Europa. Una experiencia que conecta directamente con los maestros artesanos que mantienen vivo el patrimonio gastronómico de Castilla y León.",
    stops: [
      {
        id: "cecina-leon",
        name: "Cecinas Pablo",
        type: "carnicería",
        icon: "🥩",
        description: "Secadero tradicional familiar donde la cecina se elabora como hace 150 años",
        activities: ["Degustación de cecina recién cortada", "Visita al secadero", "Charla con el maestro cecinero", "Compra de productos artesanos"],
        address: "Calle Mayor 23, Astorga, León",
        schedule: "Lunes a Sábado: 9:00-14:00 y 17:00-20:00",
        coordinates: [-6.0679, 42.4571],
        images: ["/lovable-uploads/3300b4e5-f593-466b-a789-16c6237a5b84.png"],
        website: "https://cecinaspablo.com",
        reviews: [
          {
            text: "La mejor cecina que he probado en mi vida. Pablo nos explicó todo el proceso con una pasión increíble.",
            author: "María González",
            rating: 5
          }
        ]
      },
      {
        id: "queso-valdeon",
        name: "Quesería Los Picos",
        type: "quesería",
        icon: "🧀",
        description: "Elaboración artesanal del famoso queso azul de Valdeón en las cuevas naturales",
        activities: ["Ver el proceso de maduración", "Cata dirigida de quesos", "Comprar queso recién hecho", "Aprender sobre las cuevas"],
        address: "Posada de Valdeón, León",
        schedule: "Todos los días: 10:00-18:00",
        coordinates: [-4.9058, 43.1459],
        images: ["/lovable-uploads/3300b4e5-f593-466b-a789-16c6237a5b84.png"],
        reviews: [
          {
            text: "Impresionante ver cómo maduran los quesos en las cuevas naturales. El sabor es único.",
            author: "Carlos Ruiz",
            rating: 5
          }
        ]
      },
      {
        id: "botillo-bierzo",
        name: "Casa Pepe - El Botillo",
        type: "restaurante",
        icon: "🍽",
        description: "Restaurante familiar especializado en botillo del Bierzo y cocina tradicional leonesa",
        activities: ["Degustación de botillo auténtico", "Comida tradicional", "Maridaje con vinos del Bierzo"],
        address: "Plaza del Ayuntamiento 5, Ponferrada, León",
        schedule: "Miércoles a Domingo: 13:00-16:00 y 20:00-23:00",
        coordinates: [-6.5934, 42.5505],
        images: ["/lovable-uploads/3300b4e5-f593-466b-a789-16c6237a5b84.png"],
        reviews: [
          {
            text: "El botillo más auténtico del Bierzo. Pepe nos contó la historia de cada ingrediente.",
            author: "Ana López",
            rating: 5
          }
        ]
      }
    ],
    dailyRecommendations: [
      "Comienza temprano (9:00) en Cecinas Pablo para ver el proceso de elaboración matutino",
      "Llega a la quesería entre 11:00-12:00 para ver el queso recién desmoldado",
      "Reserva mesa en Casa Pepe para almorzar el botillo caliente (13:30h ideal)",
      "Lleva una cesta térmica para conservar los productos comprados"
    ],
    practicalInfo: {
      difficulty: "Fácil",
      duration: "Día completo (8-10 horas)",
      recommendedPeople: "2-6 personas",
      tips: [
        "Ropa cómoda y abrigo (las cuevas están a 8°C)",
        "Llevar cesta o nevera portátil",
        "Reservar con antelación en temporada alta",
        "Preguntar por descuentos grupales"
      ]
    },
    businesses: 45,
    image: "/lovable-uploads/3300b4e5-f593-466b-a789-16c6237a5b84.png",
    highlighted: true
  },
  {
    id: "granada",
    title: "Pack Granada Natural",
    region: "Granada",
    shortDescription: "Aceite Picual, jamón de Trevélez, miel de la Alpujarra",
    narrative: "Granada es el encuentro perfecto entre la sierra nevada y la vega fértil, creando productos únicos en el mundo. Esta ruta te lleva desde los olivares milenarios donde nace el oro líquido andaluz, hasta las alturas de Trevélez donde el aire puro cura el mejor jamón de España. Culminarás en la Alpujarra, donde las abejas elaboran una miel que sabe a flores de montaña y tradición morisca.",
    stops: [
      {
        id: "aceite-picual",
        name: "Olivar de la Sierra",
        type: "bodega",
        icon: "🫒",
        description: "Almazara ecológica familiar con olivares de más de 200 años",
        activities: ["Cata de aceites recién prensados", "Visita a los olivares centenarios", "Proceso de molturación", "Desayuno molinero tradicional"],
        address: "Carretera de Huéscar km 3, Granada",
        schedule: "Lunes a Viernes: 8:00-15:00, Sábados: 9:00-13:00",
        coordinates: [-3.1279, 37.4419],
        images: ["/lovable-uploads/2e843717-7b23-4291-b3d1-54fb8e5f294c.png"],
        reviews: [
          {
            text: "El aceite más fresco y sabroso. Ver la molturación en directo es una experiencia única.",
            author: "Roberto Martín",
            rating: 5
          }
        ]
      },
      {
        id: "jamon-trevelez",
        name: "Jamones de la Alpujarra",
        type: "carnicería",
        icon: "🥩",
        description: "Secadero natural a 1.200m de altitud donde el aire puro cura el mejor jamón",
        activities: ["Tour por el secadero natural", "Cata de jamón cortado a cuchillo", "Explicación del proceso de curado", "Compra de productos ibéricos"],
        address: "Calle Real 45, Trevélez, Granada",
        schedule: "Todos los días: 10:00-14:00 y 17:00-20:00",
        coordinates: [-3.2638, 36.9696],
        images: ["/lovable-uploads/2e843717-7b23-4291-b3d1-54fb8e5f294c.png"],
        reviews: [
          {
            text: "Jamón espectacular. La altura y el aire puro se notan en cada loncha.",
            author: "Isabel Romero",
            rating: 5
          }
        ]
      },
      {
        id: "miel-alpujarra",
        name: "Colmenas del Valle",
        type: "panadería",
        icon: "🍯",
        description: "Apicultor artesano que elabora mieles únicas de flores de alta montaña",
        activities: ["Visita al colmenar", "Degustación de mieles variadas", "Taller de extracción", "Productos con miel natural"],
        address: "Barrio Alto, Capileira, Granada",
        schedule: "Martes a Domingo: 11:00-19:00",
        coordinates: [-3.3596, 36.9618],
        images: ["/lovable-uploads/2e843717-7b23-4291-b3d1-54fb8e5f294c.png"],
        reviews: [
          {
            text: "Miel increíble con sabores únicos. El apicultor es todo un maestro.",
            author: "Pedro Sánchez",
            rating: 5
          }
        ]
      }
    ],
    dailyRecommendations: [
      "Arranca a las 8:30 en la almazara para el desayuno molinero",
      "Sube a Trevélez sobre las 12:00 cuando el secadero está más activo",
      "Visita las colmenas al atardecer (17:00) cuando las abejas regresan",
      "Lleva ropa de abrigo para la alta montaña"
    ],
    practicalInfo: {
      difficulty: "Moderado",
      duration: "Día completo (9-11 horas)",
      recommendedPeople: "2-8 personas",
      tips: [
        "Coche necesario (rutas de montaña)",
        "Ropa de abrigo para Trevélez y Capileira",
        "Cámara para paisajes espectaculares",
        "Reservar especialmente en primavera/otoño"
      ]
    },
    businesses: 32,
    image: "/lovable-uploads/2e843717-7b23-4291-b3d1-54fb8e5f294c.png",
    highlighted: false
  },
  {
    id: "galicia",
    title: "Pack Galicia Auténtica",
    region: "Galicia",
    shortDescription: "Conservas artesanas, queso San Simón, licor de hierbas",
    narrative: "Galicia es el alma del Atlántico español, donde el mar y la tierra se funden en productos únicos. Esta ruta te sumerge en la tradición conservera de las Rías Baixas, te lleva a conocer el queso ahumado más especial de Europa y culmina en la destilería donde las hierbas gallegas se convierten en el elixir perfecto. Una experiencia donde cada parada te conecta con siglos de sabiduría marinera y rural.",
    stops: [
      {
        id: "conservas-rias",
        name: "Conservas Ortega",
        type: "restaurante",
        icon: "🐟",
        description: "Conservera familiar artesana con 4 generaciones elaborando los mejores productos del mar",
        activities: ["Proceso de elaboración en vivo", "Cata de conservas premium", "Historia de la familia conservera", "Compra productos exclusivos"],
        address: "Muelle Pesquero s/n, Cambados, Pontevedra",
        schedule: "Lunes a Viernes: 9:00-17:00, Sábados: 10:00-14:00",
        coordinates: [-8.8154, 42.5154],
        images: ["/lovable-uploads/83f11de4-7868-48bc-bcf0-9c5fd4e36abe.png"],
        reviews: [
          {
            text: "Conservas de una calidad excepcional. Ver el proceso artesanal es fascinante.",
            author: "Laura Vázquez",
            rating: 5
          }
        ]
      },
      {
        id: "queso-san-simon",
        name: "Quesería Monte Verde",
        type: "quesería",
        icon: "🧀",
        description: "Elaboración tradicional del queso San Simón ahumado con madera de abedul",
        activities: ["Proceso de ahumado tradicional", "Cata de quesos maduros", "Visita a las vacas frisonas", "Taller de elaboración"],
        address: "Lugar de Friol, Villalba, Lugo",
        schedule: "Martes a Domingo: 10:00-18:00",
        coordinates: [-7.6856, 43.2974],
        images: ["/lovable-uploads/83f11de4-7868-48bc-bcf0-9c5fd4e36abe.png"],
        reviews: [
          {
            text: "El ahumado con abedul le da un sabor único al queso. Experiencia inolvidable.",
            author: "Miguel Torres",
            rating: 5
          }
        ]
      },
      {
        id: "licor-hierbas",
        name: "Destilería Casa do Monte",
        type: "bodega",
        icon: "🍷",
        description: "Destilería artesana donde las hierbas gallegas se transforman en licores únicos",
        activities: ["Proceso de destilación", "Cata de licores variados", "Paseo por el jardín de hierbas", "Elaboración de tu propio licor"],
        address: "Aldea de Ribas, Samos, Lugo",
        schedule: "Miércoles a Domingo: 11:00-19:00",
        coordinates: [-7.3198, 42.7285],
        images: ["/lovable-uploads/83f11de4-7868-48bc-bcf0-9c5fd4e36abe.png"],
        reviews: [
          {
            text: "Licores únicos con hierbas que recogen ellos mismos. Muy auténtico.",
            author: "Carmen Silva",
            rating: 5
          }
        ]
      }
    ],
    dailyRecommendations: [
      "Empieza en Cambados temprano (9:30) para ver la llegada del pescado fresco",
      "Visita la quesería al mediodía (12:00) cuando elaboran los quesos",
      "Llega a la destilería por la tarde (16:00) para la cata con mejor ambiente",
      "Reserva con tiempo en temporada de mariscos (octubre-marzo)"
    ],
    practicalInfo: {
      difficulty: "Fácil",
      duration: "Día completo (8-10 horas)",
      recommendedPeople: "2-6 personas",
      tips: [
        "Chubasquero recomendado (clima atlántico)",
        "Conductor designado (catas de licores)",
        "Pregunta por menús degustación",
        "Mejor época: primavera y otoño"
      ]
    },
    businesses: 28,
    image: "/lovable-uploads/83f11de4-7868-48bc-bcf0-9c5fd4e36abe.png",
    highlighted: false
  },
  {
    id: "pais-vasco",
    title: "Pack Euskadi Genuino",
    region: "País Vasco",
    shortDescription: "Queso Idiazábal, txakoli, pintxos tradicionales",
    narrative: "El País Vasco es la cuna de una gastronomía única donde la tradición pastoral se encuentra con la innovación culinaria. Esta ruta te lleva desde las montañas donde las ovejas Latxa pastan libremente y dan origen al queso Idiazábal, hasta las txakolis costeras donde se elabora el vino más refrescante de la península. Culminarás en los templos del pintxo, donde cada bocado es una obra de arte en miniatura.",
    stops: [
      {
        id: "queso-idiazabal",
        name: "Etxeberri Quesería",
        type: "quesería",
        icon: "🧀",
        description: "Quesería familiar de montaña donde elaboran Idiazábal DOP con leche de ovejas Latxa propias",
        activities: ["Ordeño tradicional de ovejas", "Proceso de elaboración del queso", "Cata de Idiazábal de diferentes maduraciones", "Paseo por los pastos de montaña"],
        address: "Barrio Etxeberri 12, Ordizia, Gipuzkoa",
        schedule: "Lunes a Sábado: 8:00-14:00 y 16:00-19:00",
        coordinates: [-2.0401, 42.9968],
        images: ["/lovable-uploads/a327eccb-ce74-42aa-9e98-6181b1501e23.png"],
        reviews: [
          {
            text: "Ver el ordeño y probar el queso recién hecho es una experiencia única. Auténtica tradición vasca.",
            author: "Mikel Aguirre",
            rating: 5
          }
        ]
      },
      {
        id: "txakoli-getaria",
        name: "Bodega Txomin Etxaniz",
        type: "bodega",
        icon: "🍷",
        description: "Bodega familiar con viñedos frente al Cantábrico, pionera en la elaboración de txakoli",
        activities: ["Visita a viñedos costeros", "Proceso de elaboración del txakoli", "Cata maridada con productos locales", "Vista panorámica al mar"],
        address: "Paraje Txakolindegia, Getaria, Gipuzkoa",
        schedule: "Martes a Domingo: 10:30-18:00",
        coordinates: [-2.2026, 43.3056],
        images: ["/lovable-uploads/a327eccb-ce74-42aa-9e98-6181b1501e23.png"],
        reviews: [
          {
            text: "Txakoli excepcional con vistas al mar. La cata es perfecta y el ambiente inmejorable.",
            author: "Ane Etxeberria",
            rating: 5
          }
        ]
      },
      {
        id: "pintxos-donosti",
        name: "Bar Txepetxa",
        type: "bar-tapas",
        icon: "🍺",
        description: "Templo de la anchoa y pintxos tradicionales en el corazón de la Parte Vieja donostiarra",
        activities: ["Ruta de pintxos guiada", "Cata de anchoas premium", "Maridaje con txakoli y cerveza", "Masterclass de pintxo perfecto"],
        address: "Calle Pescadería 5, San Sebastián, Gipuzkoa",
        schedule: "Todos los días: 11:00-15:30 y 19:00-24:00",
        coordinates: [-1.9812, 43.3230],
        images: ["/lovable-uploads/a327eccb-ce74-42aa-9e98-6181b1501e23.png"],
        reviews: [
          {
            text: "Las mejores anchoas de San Sebastián. Txepetxa es una institución que no puedes perderte.",
            author: "Jon Azkargorta",
            rating: 5
          }
        ]
      }
    ],
    dailyRecommendations: [
      "Empieza temprano en la quesería (8:30) para ver el ordeño matutino",
      "Visita la bodega al mediodía (12:00) para disfrutar del paisaje con buena luz",
      "Llega a la Parte Vieja sobre las 19:00 para el ambiente auténtico del pintxeo",
      "Reserva mesa en Txepetxa o prepárate para esperar de pie como los locales"
    ],
    practicalInfo: {
      difficulty: "Fácil",
      duration: "Día completo (9-10 horas)",
      recommendedPeople: "2-6 personas",
      tips: [
        "Coche recomendable para llegar a la quesería de montaña",
        "Ropa cómoda para caminar por San Sebastián",
        "Lleva efectivo para los pintxos (muchos bares no aceptan tarjeta)",
        "Aprende unas palabras en euskera para conectar con los artesanos"
      ]
    },
    businesses: 38,
    image: "/lovable-uploads/a327eccb-ce74-42aa-9e98-6181b1501e23.png",
    highlighted: false
  },
  {
    id: "cataluna", 
    title: "Pack Catalunya Artesana",
    region: "Cataluña",
    shortDescription: "Cava familiar, fuet tradicional, miel del Montseny",
    narrative: "Catalunya es diversidad de paisajes y sabores que van desde las burbujas doradas del Penedès hasta los bosques del Montseny donde las abejas elaboran mieles extraordinarias. Esta ruta te lleva por los orígenes del cava familiar, te introduce en los secretos del fuet de Vic y culmina en el corazón del Parque Natural donde la miel sabe a roble y castaño. Una experiencia que abarca desde el valle hasta la montaña catalana.",
    stops: [
      {
        id: "cava-penedes",
        name: "Celler Can Suriol del Castell",
        type: "bodega", 
        icon: "🥂",
        description: "Bodega familiar ecológica con 9 generaciones elaborando cava con métodos tradicionales",
        activities: ["Visita a viñedos ecológicos", "Proceso tradicional del cava", "Cata en cavas subterráneas", "Degema (eliminación de sedimentos) en directo"],
        address: "Finca Can Suriol, Font-rubí, Barcelona",
        schedule: "Miércoles a Domingo: 10:00-17:00",
        coordinates: [1.7234, 41.4932],
        images: ["/lovable-uploads/35b2d048-4fcd-4549-adb3-3a28245d7e87.png"],
        reviews: [
          {
            text: "Cava excepcional y trato familiar. Las cavas subterráneas son espectaculares.",
            author: "Montse Roca",
            rating: 5
          }
        ]
      },
      {
        id: "fuet-vic",
        name: "Casa Riera Ordeix",
        type: "carnicería",
        icon: "🥩", 
        description: "Charcutería centenaria especializada en fuet y embutidos tradicionales de Vic",
        activities: ["Proceso de elaboración del fuet", "Cata de embutidos curados", "Visita a las cámaras de curación", "Taller de corte tradicional"],
        address: "Plaça Major 4, Vic, Barcelona", 
        schedule: "Martes a Sábado: 9:00-14:00 y 17:00-20:00",
        coordinates: [2.2531, 41.9301],
        images: ["/lovable-uploads/35b2d048-4fcd-4549-adb3-3a28245d7e87.png"],
        reviews: [
          {
            text: "El fuet más auténtico de Catalunya. Riera Ordeix es tradición pura desde 1852.",
            author: "Pere Soler",
            rating: 5
          }
        ]
      },
      {
        id: "miel-montseny",
        name: "Mel Siuranella",
        type: "panadería",
        icon: "🍯",
        description: "Apicultor artesano del Montseny que elabora mieles monoflotales únicas de bosque mediterráneo", 
        activities: ["Visita al colmenar en el bosque", "Cata de mieles monoflotales", "Taller de extracción artesana", "Paseo botánico por el Montseny"],
        address: "Mas la Siuranella, Arbúcies, Girona",
        schedule: "Sábados y Domingos: 10:00-18:00 (concertar entre semana)",
        coordinates: [2.5123, 41.8087],
        images: ["/lovable-uploads/35b2d048-4fcd-4549-adb3-3a28245d7e87.png"],
        reviews: [
          {
            text: "Miel de castaño excepcional. El entorno del Montseny es mágico para la experiencia.",
            author: "Carme Vidal",
            rating: 5
          }
        ]
      }
    ],
    dailyRecommendations: [
      "Empieza en el Penedès (10:00) para la visita completa de la bodega",
      "Llega a Vic para el almuerzo (13:00) y prueba los embutidos frescos",
      "Visita el Montseny por la tarde (16:00) cuando las abejas están activas", 
      "Reserva con antelación, especialmente la visita apícola"
    ],
    practicalInfo: {
      difficulty: "Moderado",
      duration: "Día completo (8-10 horas)",
      recommendedPeople: "2-6 personas",
      tips: [
        "Coche imprescindible (distancias considerables)",
        "Ropa cómoda para caminar por el bosque",
        "Conductor designado para las catas de cava",
        "Mejor época: primavera y otoño para el Montseny"
      ]
    },
    businesses: 41,
    image: "/lovable-uploads/35b2d048-4fcd-4549-adb3-3a28245d7e87.png",
    highlighted: false
  },
  {
    id: "valencia",
    title: "Pack Valencia Natural", 
    region: "Valencia",
    shortDescription: "Arroz bomba, azafrán DOP, horchata artesana",
    narrative: "Valencia es la despensa de España, donde la huerta milenaria produce los ingredientes que han conquistado el mundo. Esta ruta te lleva por los campos donde crece el arroz bomba de la paella auténtica, te introduce en el oro rojo del azafrán manchego y culmina en las chufas que dan origen a la horchata más pura. Una experiencia que conecta directamente con los sabores que definen la esencia mediterránea.",
    stops: [
      {
        id: "arroz-albufera",
        name: "Arroces de la Albufera",
        type: "restaurante",
        icon: "🌾",
        description: "Productor tradicional de arroz bomba en los campos históricos de la Albufera valenciana",
        activities: ["Visita a los arrozales tradicionales", "Proceso de cultivo y secado", "Cata de diferentes variedades", "Paella auténtica con arroz propio"],
        address: "Partida del Saler s/n, Valencia",
        schedule: "Martes a Domingo: 9:00-17:00",
        coordinates: [-0.3218, 39.3560],
        images: ["/lovable-uploads/83f11de4-7868-48bc-bcf0-9c5fd4e36abe.png"],
        reviews: [
          {
            text: "Ver los arrozales de la Albufera y probar paella con su arroz es impresionante.",
            author: "Vicente Martínez",
            rating: 5
          }
        ]
      },
      {
        id: "azafran-manchego", 
        name: "Oro Rojo de La Mancha",
        type: "panadería",
        icon: "🌸",
        description: "Cultivador artesano de azafrán DOP que mantiene la tradición del oro rojo español",
        activities: ["Campos de azafrán en flor", "Recolección manual tradicional", "Proceso de tostado artesano", "Cata y maridajes con azafrán"],
        address: "Calle Real 23, Consuegra, Toledo",
        schedule: "Lunes a Viernes: 10:00-14:00 y 16:00-19:00 (temporada: octubre-noviembre)",
        coordinates: [-3.6123, 39.4598],
        images: ["/lovable-uploads/83f11de4-7868-48bc-bcf0-9c5fd4e36abe.png"],
        reviews: [
          {
            text: "El azafrán más puro que he probado. Ver la recolección manual es único en el mundo.",
            author: "Carmen Jiménez", 
            rating: 5
          }
        ]
      },
      {
        id: "horchata-alboraya",
        name: "Horchatería El Tío Che",
        type: "restaurante",
        icon: "🥛",
        description: "Horchatería tradicional que cultiva sus propias chufas y elabora horchata artesana diaria",
        activities: ["Visita a los campos de chufa", "Proceso completo de la horchata", "Degustación con fartons calientes", "Taller de elaboración casera"],
        address: "Calle Mayor 15, Alboraya, Valencia", 
        schedule: "Todos los días: 8:00-22:00 (temporada completa abril-octubre)",
        coordinates: [-0.3456, 39.5123],
        images: ["/lovable-uploads/83f11de4-7868-48bc-bcf0-9c5fd4e36abe.png"],
        reviews: [
          {
            text: "La horchata más cremosa y natural. Ver el proceso desde la chufa es fascinante.",
            author: "Amparo García",
            rating: 5
          }
        ]
      }
    ],
    dailyRecommendations: [
      "Empieza temprano en los arrozales (9:00) para ver la Albufera en calma",
      "Visita los campos de azafrán en temporada (octubre-noviembre) es imprescindible", 
      "Llega a Alboraya para la merienda (17:00) con horchata y fartons recién hechos",
      "Combina con visita al Parque Natural de la Albufera al atardecer"
    ],
    practicalInfo: {
      difficulty: "Fácil",
      duration: "Día completo (8-9 horas)",
      recommendedPeople: "2-8 personas",
      tips: [
        "Mejor época: octubre-noviembre para ver azafrán en flor",
        "Protección solar (campos abiertos)",
        "Ropa cómoda para caminar por campos",
        "Reserva obligatoria para campos de azafrán en temporada"
      ]
    },
    businesses: 29,
    image: "/lovable-uploads/83f11de4-7868-48bc-bcf0-9c5fd4e36abe.png",
    highlighted: false
  }
];

export const getPackById = (id: string): PackDetail | undefined => {
  return packsData.find(pack => pack.id === id);
};