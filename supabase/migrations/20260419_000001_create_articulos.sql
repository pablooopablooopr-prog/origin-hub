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
  '14 de abril de 2025',
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
);
