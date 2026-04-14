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
  referencias?: string[];
  destacado?: boolean;
}

export const articulos: Articulo[] = [
  {
    id: "1",
    slug: "efecto-mercosur-futuro-campo-espanol",
    titulo: "España produce, pero no decide: el efecto Mercosur que puede cambiar el futuro del campo",
    extracto:
      "España sigue siendo una de las grandes potencias agrícolas de Europa. Sin embargo, en paralelo a esa fortaleza productiva, se desarrolla una tendencia menos visible: la pérdida progresiva de control sobre las condiciones en las que compite su propio campo.",
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
      "Este proceso tiene una derivada más profunda. Cuando la producción local pierde competitividad de forma continuada, el mercado tiende a sustituirla por importaciones más \"económicas\", pero… ¿a qué coste real? A corto plazo, el abastecimiento se mantiene; a medio plazo, la dependencia exterior aumenta. Con ello, también se debilita la capacidad de decisión sobre algo tan esencial como la calidad, la seguridad y el control de los alimentos que llegan a nuestra mesa.",
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
];
