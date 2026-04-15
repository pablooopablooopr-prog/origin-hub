export interface SeccionArticulo {
  titulo: string;
  tipo: "lista" | "lista-numerada" | "texto";
  contenido?: string;
  items: string[];
  nota?: string;
}

export interface Articulo {
  id: string;
  slug: string;
  titulo: string;
  extracto: string;
  categoria: string;
  categoriaColor: string;
  fechaPublicacion: string;
  tiempoLectura: number;
  autor: string;
  parrafos: string[];
  secciones?: SeccionArticulo[];
  parrafosCierre?: string[];
  referencias?: string[];
  destacado?: boolean;
}

export const articulos: Articulo[] = [
  {
    id: "1",
    slug: "efecto-mercosur-futuro-campo-espanol",
    titulo: "España produce, pero no decide: el efecto Mercosur que puede cambiar el futuro del campo",
    extracto: "España sigue siendo una de las grandes potencias agrícolas de Europa. Sin embargo, en paralelo a esa fortaleza productiva, se desarrolla una tendencia menos visible: la pérdida progresiva de control sobre las condiciones en las que compite su propio campo.",
    categoria: "Política Agraria",
    categoriaColor: "bg-earth-light text-primary",
    fechaPublicacion: "14 de abril de 2025",
    tiempoLectura: 8,
    autor: "Equipo ORIGEN",
    destacado: true,
    parrafos: [
      "España sigue siendo una de las grandes potencias agrícolas de Europa. Produce, exporta y abastece tanto al mercado nacional como internacional. Sin embargo, en paralelo a esa fortaleza productiva, se está desarrollando una tendencia menos visible: la pérdida progresiva de control sobre las condiciones en las que compite su propio campo.",
      "En este contexto, el acuerdo entre la Unión Europea y Mercosur se convierte en una pieza clave para entender lo que está ocurriendo. Mercosur es un bloque económico formado por países como Brasil, Argentina, Uruguay y Paraguay, grandes potencias agrícolas con una enorme capacidad de producción y costes significativamente más bajos. El acuerdo con la Unión Europea busca facilitar el comercio entre ambos bloques, reduciendo barreras y permitiendo una mayor entrada de productos en ambos sentidos.",
      "Sobre el papel, se trata de una apertura comercial. En la práctica, introduce un nuevo escenario competitivo que no parte de las mismas condiciones.",
      "El agricultor español opera bajo uno de los marcos regulatorios más exigentes del mundo. Normativas medioambientales, controles sanitarios, trazabilidad o condiciones laborales elevan el estándar de producción, pero también los costes. Frente a ello, los países de Mercosur producen a gran escala, con estructuras que no tienen el mismo control sobre la calidad de producción y conservación de los alimentos y con costes muy inferiores. Cuando ambos modelos se encuentran en el mismo mercado, el precio se convierte en el factor dominante.",
      "Y es precisamente ahí donde empieza a aparecer el problema real.",
      "Porque cuando el precio baja por debajo de ciertos niveles, el impacto no es teórico. En determinadas campañas agrícolas, productores españoles han tenido que dejar parte de su cosecha sin recoger porque el coste de recolectarla superaba el precio que iban a recibir por ella. Es decir, producir ya no garantiza poder vender en condiciones sostenibles.",
      "Este tipo de situaciones no suelen ser visibles para el consumidor. En el supermercado, los precios apenas reflejan estas tensiones, y el origen del producto muchas veces pasa desapercibido. Sin embargo, en el campo, la consecuencia es directa: menos margen, más incertidumbre y decisiones cada vez más difíciles de sostener en el tiempo.",
      "A medida que esta presión se mantiene, el sistema empieza a ajustarse. Explotaciones que reducen su actividad, otras que desaparecen, territorios donde la actividad agraria pierde peso sin que exista una alternativa clara. No se trata de un colapso inmediato, sino de un desgaste progresivo que va erosionando la base productiva del campo español.",
      "Este proceso tiene una derivada más profunda. Cuando la producción local pierde competitividad de forma continuada, el mercado tiende a sustituirla por importaciones más “económicas”, pero… ¿a qué coste real? A corto plazo, el abastecimiento se mantiene; a medio plazo, la dependencia exterior aumenta. Con ello, también se debilita la capacidad de decisión sobre algo tan esencial como la calidad, la seguridad y el control de los alimentos que llegan a nuestra mesa.",
      "Además, no todos los productos compiten bajo los mismos estándares. En muchos países del Mercosur, los sistemas de control sobre el uso de pesticidas, las condiciones sanitarias, la trazabilidad o los procesos de producción no alcanzan el mismo nivel de exigencia que en la Unión Europea. A esto se suma un factor clave: el transporte de larga distancia, que implica tiempos prolongados, conservación intensiva y una cadena logística más compleja, donde el producto pierde frescura y control directo antes de llegar al consumidor final.",
      "El acuerdo con Mercosur intensifica estas dinámicas: introduce más volumen, más competencia en precio y, por tanto, más presión sobre un sistema que ya operaba con márgenes ajustados. La cuestión ya no es únicamente si el campo español puede competir, sino en qué condiciones lo hace y hasta qué punto puede sostenerlas sin comprometer los estándares que garantizan alimentos más seguros y de mayor calidad.",
      "En este contexto, el debate no debería limitarse a la apertura comercial, sino a cómo se equilibra esa apertura con la sostenibilidad del propio sistema productivo y con las garantías que recibe el consumidor. Porque competir únicamente en precio implica, en muchos casos, aceptar diferencias en los procesos de producción que no siempre son visibles, pero sí relevantes.",
      "Aquí es donde aparece un elemento que durante años ha quedado en segundo plano: la visibilidad del origen. Llegará un mercado donde el consumidor no tenga información clara sobre qué está comprando, ni siquiera el precio se convertirá en un criterio real de decisión. Todo lo demás: el territorio, las condiciones de producción, la trazabilidad, el cuidado y mimo personal del productor con el alimento, los controles sanitarios exhaustivos o el impacto… quedarán fuera de la ecuación.",
      "Sin embargo, cuando esa información se hace accesible, el comportamiento cambia. El producto deja de ser intercambiable y empieza a diferenciarse. No porque el mercado deje de ser competitivo, sino porque incorpora variables que afectan directamente a la calidad, la seguridad y la confianza directa con el consumidor.",
      "El efecto Mercosur, en este sentido, actúa como un punto de inflexión. No solo por lo que introduce, sino porque obliga a replantear cómo se estructura la relación entre producción y consumo en un entorno globalizado.",
      "España sigue produciendo. La cuestión es si, en este nuevo escenario, seguirá teniendo capacidad para decidir en qué condiciones lo hace y si está terminará perjudicando a nuestra salud. ¿Y tú, qué decisión tomarás?",
    ],
    referencias: [
      "Comisión Europea (2019). EU-Mercosur Trade Agreement: Key Facts.",
      "Parlamento Europeo (2020). Impacts of the EU-Mercosur Trade Agreement on the agricultural sector.",
      "Ministerio de Agricultura, Pesca y Alimentación (MAPA) (2022). Informe sobre comercio agroalimentario en España.",
      "FAO (2018). The State of Agricultural Commodity Markets.",
      "OECD (2021). Agricultural Policy Monitoring and Evaluation.",
      "Copa-Cogeca (2020). Assessment of the EU-Mercosur Agreement on EU Agriculture.",
    ],
  },
  {
    id: "2",
    slug: "pesticidas-glifosato-rastro-invisible-tu-cuerpo",
    titulo: "Pesticidas y glifosato: el rastro invisible que entra en tu cuerpo y no siempre sale igual",
    extracto: "Cada vez que comes una fresa convencional, una manzana de importación o un vaso de vino barato, es probable que estés ingiriendo trazas de sustancias que no deberían estar en tu plato. Los pesticidas son la sombra química de la agricultura industrial, y el glifosato, el herbicida más usado del mundo, se ha convertido en su símbolo más controvertido.",
    categoria: "Salud y Alimentación",
    categoriaColor: "bg-green-100 text-green-800",
    fechaPublicacion: "21 de abril de 2026",
    tiempoLectura: 10,
    autor: "Equipo ORIGEN",
    destacado: false,
    parrafos: [
      "Cada vez que comes una fresa convencional, una manzana de importación o un vaso de vino barato, es probable que estés ingiriendo trazas de sustancias que no deberían estar en tu plato. Los pesticidas son la sombra química de la agricultura industrial, y el glifosato, el herbicida más usado del mundo, se ha convertido en su símbolo más controvertido.",
      "El glifosato es el principio activo del herbicida Roundup, comercializado por Monsanto desde los años 70 y hoy utilizado masivamente en cultivos de cereales, legumbres, frutas y hortalizas. Su uso se disparó con la aparición de los cultivos transgénicos resistentes a él, lo que permitió rociarlo directamente sobre la planta sin matarla, pero dejando residuos sobre lo que después alguien comería.",
      "En 2015, la Agencia Internacional para la Investigación sobre el Cáncer (IARC), dependiente de la OMS, clasificó el glifosato como “probablemente cancerígeno para los humanos” (Grupo 2A). Esta clasificación encendió una alarma científica que todavía no se ha apagado. La Agencia Europea de Sustancias y Mezclas Químicas (ECHA) mantuvo en 2017 que no cumplía los criterios de clasificación como carcinógeno, pero la controversia no desapareció: cientos de estudios independientes señalan vínculos con linfoma no Hodgkin, disrupción hormonal y daño en la microbiota intestinal.",
      "Lo que resulta especialmente preocupante no es la exposición puntual, sino la acumulación. El problema real con los pesticidas no es una dosis alta en un momento concreto, sino el goteo constante de múltiples sustancias a lo largo de años. Este fenómeno, conocido como efecto cóctel, implica que la interacción entre distintos pesticidas puede ser más tóxica que cada uno por separado, aunque todos estén dentro de los límites legales individualmente.",
      "Los estudios de biomonitoración humana lo confirman: en muestras de orina de población general europea, se detectan con regularidad residuos de glifosato, clorpirifos, imidacloprid y otras sustancias. En España, un estudio de 2022 encontró glifosato en el 70% de las muestras de orina analizadas en la población general, con concentraciones especialmente elevadas en zonas agrícolas.",
      "El impacto va más allá del cáncer. Investigaciones recientes apuntan a que la exposición crónica a pesticidas organofosforados como el clorpirifos está vinculada a alteraciones del neurodesarrollo en niños, especialmente cuando la exposición ocurre durante el embarazo o los primeros años de vida. Estudios de cohorte en Francia, España y Estados Unidos han documentado asociaciones entre la exposición prenatal a pesticidas y menores cocientes intelectuales, mayor riesgo de TDAH y alteraciones del lenguaje.",
      "A esto se suma la disrupción endocrina. Muchos pesticidas actúan como disruptores del sistema hormonal: interfieren con los estrógenos, la testosterona y la tiroides, con efectos que pueden manifestarse décadas después o en la descendencia. La exposición prenatal a ciertos fungicidas, por ejemplo, se ha asociado en estudios con alteraciones en la función reproductiva masculina.",
    ],
    secciones: [
      {
        titulo: "Los 12 alimentos con más residuos de pesticidas (Dirty Dozen 2024)",
        tipo: "lista",
        contenido: "El Environmental Working Group (EWG) publica anualmente la lista de los alimentos con mayor presencia de residuos de pesticidas en la agricultura convencional. En 2024, los doce alimentos más contaminados fueron:",
        items: [
        "Fresas — el alimento con mayor número de residuos detectados, hasta 22 pesticidas distintos en una sola muestra",
        "Espinacas — altas concentraciones de permetrina, un neurotóxico",
        "Col rizada y mostaza — presencia frecuente de DCPA, posible carcinógeno",
        "Melocotones — hasta 17 pesticidas detectados",
        "Peras — residuos persistentes incluso tras lavado",
        "Nectarinas — similares a los melocotones en perfil de residuos",
        "Manzanas — glifosato y difenilamina habituales en variedades convencionales",
        "Pimientos (rojos y verdes) — uno de los más contaminados del ranking",
        "Cerezas — residuos de múltiples insecticidas",
        "Arándanos — presencia de fungicidas e insecticidas sistémicos",
        "Judías verdes — frecuente detección de acefato, prohibido en la UE pero presente en importaciones",
        "Uvas — residuos de fungicidas y herbicidas, también en vino convencional",
        ],
        nota: "Fuente: Environmental Working Group, Shopper’s Guide to Pesticides in Produce, 2024. Los datos corresponden a análisis del USDA y FDA en EE.UU., pero los patrones son comparables en Europa según los informes de la EFSA.",
      },
      {
        titulo: "Cómo reducir tu exposición sin que te cueste una fortuna",
        tipo: "lista-numerada",
        contenido: "Eliminar completamente la exposición a pesticidas es prácticamente imposible en el mundo actual, pero sí existen estrategias concretas para reducirla de forma significativa:",
        items: [
        "Prioriza el ecológico en el Dirty Dozen: no necesitas comprar todo bio, pero sí los alimentos con mayor carga de residuos. Empieza por las fresas, espinacas y manzanas.",
        "Lava con bicarbonato: sumergir las frutas y verduras en agua con bicarbonato sódico durante 15 minutos elimina hasta el 80% de los residuos superficiales de pesticidas como el tiabendazol y el imidacloprid.",
        "Pela cuando puedas: la mayor concentración de residuos está en la piel. Pelar manzanas, peras o pepinos convencionales reduce drásticamente la exposición.",
        "Compra de temporada y de proximidad: los productos locales de temporada requieren menos tratamientos post-cosecha para conservación y transporte, y tienen menos tiempo para acumular residuos.",
        "Diversifica: comer siempre los mismos alimentos aumenta la exposición acumulada a los pesticidas específicos de esos cultivos. La variedad reduce el riesgo.",
        "Reduce el consumo de cereales convencionales procesados: el trigo convencional se trata frecuentemente con glifosato antes de la cosecha como desecante. Los ultraprocesados basados en harinas convencionales pueden concentrar estos residuos.",
        "Elige vino ecológico o de pequeños productores: el vino convencional es uno de los productos con mayor presencia de residuos de fungicidas. Los vinos de producción artesanal suelen aplicar menos tratamientos.",
        "Conecta con el productor: cuando conoces a quien cultiva y puedes preguntarle directamente qué usa y cómo, tienes información real sobre lo que estás comiendo. Eso no tiene sustituto.",
        ],
      },
    ],
    parrafosCierre: [
      "La regulación existe, pero tiene límites. La Unión Europea fija Límites Máximos de Residuos (LMR) para pesticidas en alimentos, y la EFSA los revisa periódicamente. Sin embargo, estos límites se establecen sustancia por sustancia, sin considerar el efecto acumulativo de todas las sustancias presentes simultáneamente en un mismo alimento. El sistema regula el árbol, pero no el bosque.",
      "En 2023, el Parlamento Europeo impulsó el Reglamento sobre Uso Sostenible de Pesticidas (SUR), que proponía reducir el uso de pesticidas un 50% para 2030. El texto fue rechazado en votación, en parte por presión de lobbies agroindustriales y por el contexto geopolítico post-Ucrania que ponía el foco en la seguridad alimentaria. El debate sigue abierto.",
      "Mientras tanto, el consumidor sigue siendo el último eslabón de la cadena, el que absorbe lo que el sistema no ha filtrado. La buena noticia es que también puede ser el primero en decidir. Cada elección de compra, cada producto de proximidad elegido frente a uno de origen incierto, cada conversación con un productor artesano que trabaja sin químicos innecesarios, es un pequeño acto de soberanía alimentaria.",
      "No se trata de alarmar ni de generar angustia. Se trata de tener información real para tomar decisiones reales. El rastro invisible existe. Saber que está ahí es el primer paso para decidir cuánto de él quieres en tu cuerpo.",
    ],
    referencias: [
      "IARC (2015). Monographs Volume 112: evaluation of five organophosphate insecticides and herbicides. International Agency for Research on Cancer, World Health Organization.",
      "ECHA (2017). Glyphosate not classified as a carcinogen by ECHA. European Chemicals Agency.",
      "Environmental Working Group (2024). Shopper’s Guide to Pesticides in Produce — Dirty Dozen.",
      "EFSA (2022). Pesticide residues in food: 2020 European Union Report. European Food Safety Authority.",
      "Trasande et al. (2012). Organophosphate exposure and attention-deficit/hyperactivity disorder in a nationally representative sample of US adolescents. Environmental Health Perspectives.",
      "Capó Martí et al. (2022). Biomonitoración de glifosato en población general española. Revista Española de Salud Pública.",
      "Mesnage R, Antoniou MN (2017). Facts and Fallacies in the Debate on Glyphosate Toxicity. Frontiers in Public Health.",
      "Parlamento Europeo (2023). Sustainable Use Regulation (SUR): debate y resultado de la votación.",
      "MAPA (2023). Plan de Acción Nacional para el Uso Sostenible de Productos Fitosanitarios (PAN).",
    ],
  },
];
