-- Create articulos table for news/editorial content
CREATE TABLE public.articulos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  titulo text NOT NULL,
  extracto text NOT NULL,
  categoria text NOT NULL,
  categoria_color text,
  fecha_publicacion text NOT NULL,
  tiempo_lectura integer NOT NULL,
  autor text DEFAULT 'Equipo ORIGEN',
  parrafos text[] NOT NULL,
  secciones jsonb,
  parrafos_cierre text[],
  referencias text[],
  destacado boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.articulos ENABLE ROW LEVEL SECURITY;

-- Public can read all articles
CREATE POLICY "Anyone can read articles"
  ON public.articulos FOR SELECT
  USING (true);

-- Only admin can insert
CREATE POLICY "Only admin can insert articles"
  ON public.articulos FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Only admin can update
CREATE POLICY "Only admin can update articles"
  ON public.articulos FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Only admin can delete
CREATE POLICY "Only admin can delete articles"
  ON public.articulos FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Seed initial 3 articles
INSERT INTO public.articulos (
  slug, titulo, extracto, categoria, categoria_color,
  fecha_publicacion, tiempo_lectura, autor, parrafos, referencias, destacado
) VALUES (
  'efecto-mercosur-futuro-campo-espanol',
  'España produce, pero no decide: el efecto Mercosur que puede cambiar el futuro del campo',
  'España sigue siendo una de las grandes potencias agrícolas de Europa. Sin embargo, en paralelo a esa fortaleza productiva, se desarrolla una tendencia menos visible: la pérdida progresiva de control sobre las condiciones en las que compite su propio campo.',
  'Política Agraria',
  'bg-earth-light text-primary',
  '14 de abril de 2026',
  8,
  'Equipo ORIGEN',
  ARRAY[
    'España sigue siendo una de las grandes potencias agrícolas de Europa. Produce, exporta y abastece tanto al mercado nacional como internacional. Sin embargo, en paralelo a esa fortaleza productiva, se está desarrollando una tendencia menos visible: la pérdida progresiva de control sobre las condiciones en las que compite su propio campo.',
    'En este contexto, el acuerdo entre la Unión Europea y Mercosur se convierte en una pieza clave para entender lo que está ocurriendo. Mercosur es un bloque económico formado por países como Brasil, Argentina, Uruguay y Paraguay, grandes potencias agrícolas con una enorme capacidad de producción y costes significativamente más bajos. El acuerdo con la Unión Europea busca facilitar el comercio entre ambos bloques, reduciendo barreras y permitiendo una mayor entrada de productos en ambos sentidos.',
    'Sobre el papel, se trata de una apertura comercial. En la práctica, introduce un nuevo escenario competitivo que no parte de las mismas condiciones.'
  ],
  ARRAY[
    'Comisión Europea (2019). EU-Mercosur Trade Agreement: Key Facts.',
    'Parlamento Europeo (2020). Impacts of the EU-Mercosur Trade Agreement on the agricultural sector.'
  ],
  true
), (
  'pesticidas-glifosato-rastro-invisible-tu-cuerpo',
  'Pesticidas y glifosato: el rastro invisible que entra en tu cuerpo y no siempre sale igual',
  'Cada vez que comes una fresa convencional, una manzana de importación o un vaso de vino barato, es probable que estés ingiriendo trazas de sustancias que no deberían estar en tu plato. Los pesticidas son la sombra química de la agricultura industrial, y el glifosato, el herbicida más usado del mundo, se ha convertido en su símbolo más controvertido.',
  'Salud y Alimentación',
  'bg-green-100 text-green-800',
  '21 de abril de 2026',
  10,
  'Equipo ORIGEN',
  ARRAY[
    'Cada vez que comes una fresa convencional, una manzana de importación o un vaso de vino barato, es probable que estés ingiriendo trazas de sustancias que no deberían estar en tu plato.',
    'El glifosato es el principio activo del herbicida Roundup, comercializado por Monsanto desde los años 70.',
    'En 2015, la Agencia Internacional para la Investigación sobre el Cáncer (IARC) clasificó el glifosato como probablemente cancerígeno para los humanos.'
  ],
  ARRAY[
    'IARC (2015). Monographs Volume 112: evaluation of organophosphate insecticides.',
    'ECHA (2017). Glyphosate not classified as a carcinogen by ECHA.'
  ],
  false
), (
  'del-campo-al-supermercado-pagas-mas-agricultor-cobra-menos',
  'Del campo al supermercado: por qué pagas más y el agricultor cobra menos',
  'Cada vez es más común escuchar una misma sensación en dos extremos opuestos del sistema: el consumidor percibe que los alimentos son caros, mientras que el agricultor insiste en que no le salen las cuentas. Ambos tienen razón.',
  'Cadena Alimentaria',
  'bg-amber-100 text-amber-800',
  '28 de abril de 2026',
  7,
  'Equipo ORIGEN',
  ARRAY[
    'Cada vez es más común escuchar una misma sensación en dos extremos opuestos del sistema: el consumidor percibe que los alimentos son caros, mientras que el agricultor insiste en que no le salen las cuentas.',
    'Entre el campo y el supermercado ocurre algo que rara vez se explica con claridad. El producto inicia su recorrido con un valor determinado en origen, pero ese valor cambia radicalmente a medida que avanza por la cadena de distribución.',
    'Un kilo de producto agrícola puede salir del campo por una cantidad muy baja, en ocasiones apenas suficiente para cubrir los costes de producción. Sin embargo, ese mismo producto puede aparecer días después en el lineal del supermercado a un precio varias veces superior.'
  ],
  ARRAY[
    'Ministerio de Agricultura, Pesca y Alimentación (MAPA) (2023). Informe de la cadena alimentaria.',
    'CNMC (2020). Estudio sobre la cadena de distribución alimentaria.'
  ],
  false
), (
  'huevos-numero-cascara-que-significa',
  'Huevos: lo que realmente significa el número que ves en la cáscara',
  'Cuando compras huevos, ¿sabes qué significa ese número impreso en la cáscara? Detrás de esos dígitos se esconde toda una clasificación sobre cómo han vivido las gallinas. Entenderlo cambia la forma en que comes uno de los alimentos más comunes de la despensa.',
  'Origen de los Alimentos',
  'bg-yellow-100 text-yellow-800',
  '10 de marzo de 2026',
  6,
  'Equipo ORIGEN',
  ARRAY[
    'Cuando compras huevos en el supermercado, ves un número impreso en la cáscara. Ese número, que parece mundano, es en realidad un código que cuenta una historia completa sobre la vida de la gallina que lo puso.',
    'En la Unión Europea, este sistema de clasificación es obligatorio desde 2004. El primer dígito del código indica el sistema de cría: 0 significa ecológico, 1 significa campero, 2 significa en jaula enriquecida, y 3 significa en jaula convencional.',
    '## ¿Qué significa cada número?',
    'El número 0 es el "huevo feliz": la gallina vive en un sistema ecológico, sin medicamentos sintéticos, alimentada con piensos ecológicos certificados. Tiene acceso a espacios al aire libre y un ambiente natural. Estos huevos son más caros, pero también reflejan mejores condiciones de vida para el animal.',
    'El número 1, o huevo campero, significa que la gallina pasa parte del día al aire libre. Vive en gallineros con espacios de movimiento, aunque no tan amplios como en el sistema ecológico. Su alimentación es menos restrictiva que la ecológica, pero generalmente de mejor calidad que los sistemas convencionales.',
    'El número 2 corresponde a huevos de jaula enriquecida. El nombre suena sofisticado, pero la realidad es que la gallina vive la mayor parte de su vida en una jaula, aunque con elementos como perchas y nidos que mejoran ligeramente sus condiciones respecto a las jaulas convencionales.',
    'El número 3 es el de la jaula convencional: la gallina vive prácticamente toda su existencia en una jaula sin apenas espacio para extender las alas. Es el sistema más barato de producción y el que genera más controversy desde el punto de vista del bienestar animal.',
    '## Por qué importa más allá del precio',
    'La diferencia entre sistemas no es solo de ética animal. Los huevos de gallinas criadas en mejores condiciones tienen diferencias nutricionales medibles: más ácidos grasos omega-3, mayor cantidad de vitamina E y mejores perfiles de aminoácidos. El color de la yema también refleja la alimentación: una yema de color naranja intenso típicamente indica una dieta más variada y natural.',
    'Además, los sistemas de jaula convencional han comenzado a prohibirse en varios países europeos por presión de bienestar animal. La Unión Europea planea eliminarlas gradualmente, lo que significa que los huevos con número 3 irán desapareciendo con el tiempo en el mercado comunitario.',
    '## Cómo elegir con criterio',
    'Si tu presupuesto te lo permite, los huevos 0 y 1 ofrecen la mejor garantía: bienestar animal verificado y perfiles nutricionales superiores. Los huevos 2 son una opción intermedia si buscas un equilibrio entre precio y condiciones de producción. Los huevos 3 son los más económicos, pero su sostenibilidad futura es cuestionable.',
    'Lo importante es que, al mirar ese número en la cáscara, sepas exactamente qué estás comprando. No es solo un código: es la vida entera de una gallina resumida en un dígito.'
  ],
  ARRAY[
    'Autoridad Europea de Seguridad Alimentaria (EFSA) (2023). Scientific Opinion on the welfare aspects of various systems for keeping laying hens.',
    'Institut de Recerca i Tecnologia Agroalimentàries (IRTA) (2022). Comparativa nutricional de huevos según sistema de cría.',
    'Comisión Europea (2021). Estrategia de la Granja a la Mesa.'
  ],
  false
);
