import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FileText } from "lucide-react";

const TerminosCondiciones = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0]">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#8B7355] to-[#A0826D] text-white py-12">
        <div className="container mx-auto px-6 max-w-4xl">
          <FileText className="w-12 h-12 mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Términos y Condiciones
          </h1>
          <p className="text-white/90">
            Última actualización: Enero 2025
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12 space-y-8">
          
          {/* Índice */}
          <nav className="bg-[#FAF6F0] p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-[#8B7355]">Índice</h2>
            <ol className="space-y-2 text-muted-foreground">
              <li><a href="#objeto" className="hover:text-[#8B7355]">1. Objeto</a></li>
              <li><a href="#usuario" className="hover:text-[#8B7355]">2. Usuario y registro</a></li>
              <li><a href="#productos" className="hover:text-[#8B7355]">3. Productos y servicios</a></li>
              <li><a href="#precios" className="hover:text-[#8B7355]">4. Precios y pagos</a></li>
              <li><a href="#envios" className="hover:text-[#8B7355]">5. Envíos y entregas</a></li>
              <li><a href="#devolucion" className="hover:text-[#8B7355]">6. Derecho de desistimiento</a></li>
              <li><a href="#garantias" className="hover:text-[#8B7355]">7. Garantías</a></li>
              <li><a href="#propiedad" className="hover:text-[#8B7355]">8. Propiedad intelectual</a></li>
              <li><a href="#responsabilidad" className="hover:text-[#8B7355]">9. Limitación de responsabilidad</a></li>
              <li><a href="#modificacion" className="hover:text-[#8B7355]">10. Modificación de los términos</a></li>
              <li><a href="#ley" className="hover:text-[#8B7355]">11. Ley aplicable y jurisdicción</a></li>
            </ol>
          </nav>

          {/* Secciones */}
          <section id="objeto">
            <h2 className="text-2xl font-bold mb-4 text-[#8B7355]">1. Objeto</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Los presentes términos y condiciones generales (en adelante, las "Condiciones Generales") 
                regulan el uso del sitio web www.origen.es (en adelante, el "Sitio Web" o la "Plataforma") 
                y la compra de productos a través del mismo.
              </p>
              <p>
                ORIGEN es una plataforma de comercio electrónico especializada en la venta de productos 
                locales y artesanales de distintas regiones de España, agrupados en "packs" temáticos 
                por región.
              </p>
              <p>
                El acceso y uso del Sitio Web, así como la compra de los productos ofrecidos en el mismo, 
                atribuye la condición de usuario (en adelante, el "Usuario") e implica la aceptación de 
                todas las Condiciones Generales.
              </p>
            </div>
          </section>

          <section id="usuario">
            <h2 className="text-2xl font-bold mb-4 text-[#8B7355]">2. Usuario y registro</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Para realizar compras en la Plataforma, el Usuario deberá registrarse creando una cuenta 
                personal. Durante el proceso de registro, el Usuario deberá proporcionar información 
                veraz, exacta y actualizada.
              </p>
              <p>
                El Usuario es responsable de mantener la confidencialidad de su contraseña y de todas 
                las actividades que se realicen bajo su cuenta. El Usuario se compromete a notificar 
                inmediatamente a ORIGEN cualquier uso no autorizado de su cuenta.
              </p>
              <p>
                ORIGEN se reserva el derecho de rechazar cualquier solicitud de registro o de cancelar 
                un registro previamente aceptado, sin que esté obligado a comunicar o exponer las razones 
                de su decisión y sin que ello genere algún derecho a indemnización o resarcimiento.
              </p>
            </div>
          </section>

          <section id="productos">
            <h2 className="text-2xl font-bold mb-4 text-[#8B7355]">3. Productos y servicios</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Los productos ofrecidos en la Plataforma son aquellos que aparecen en el catálogo online 
                en el momento en que el Usuario realiza su pedido. ORIGEN se compromete a mantener 
                actualizado el catálogo de productos disponibles.
              </p>
              <p>
                Cada pack incluye una descripción detallada de los productos que contiene, información 
                sobre los productores, origen de los productos, ingredientes, alérgenos y condiciones 
                de conservación.
              </p>
              <p>
                ORIGEN garantiza que todos los productos ofrecidos cumplen con la normativa vigente en 
                materia de seguridad alimentaria y están debidamente autorizados para su comercialización.
              </p>
              <p>
                Las imágenes de los productos son orientativas. Aunque nos esforzamos por que las 
                fotografías se correspondan fielmente con el producto real, pueden existir pequeñas 
                variaciones en color, tamaño o presentación.
              </p>
            </div>
          </section>

          <section id="precios">
            <h2 className="text-2xl font-bold mb-4 text-[#8B7355]">4. Precios y pagos</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Los precios mostrados en la Plataforma son finales e incluyen todos los impuestos 
                aplicables (IVA) y los gastos de envío. No existen costes adicionales ocultos.
              </p>
              <p>
                Los precios pueden ser modificados en cualquier momento por ORIGEN, pero los cambios 
                no afectarán a los pedidos respecto a los cuales el Usuario ya haya recibido una 
                confirmación de pedido.
              </p>
              <p>
                Los métodos de pago aceptados son: tarjeta de crédito/débito (Visa, Mastercard, 
                American Express), transferencia bancaria, Bizum y PayPal. Todos los pagos se procesan 
                a través de pasarelas de pago seguras y certificadas.
              </p>
              <p>
                El cargo se realizará en el momento de la confirmación del pedido. ORIGEN se reserva 
                el derecho de cancelar cualquier pedido en caso de que se detecte un problema con el 
                pago o se sospeche de fraude.
              </p>
            </div>
          </section>

          <section id="envios">
            <h2 className="text-2xl font-bold mb-4 text-[#8B7355]">5. Envíos y entregas</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Los envíos se realizan a toda la península ibérica. Los plazos de entrega estimados 
                son los siguientes:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Packs Raíz: 2-3 días laborables</li>
                <li>Packs Esencia: 3-5 días laborables</li>
                <li>Packs Gourmet: 5-7 días laborables</li>
              </ul>
              <p>
                Estos plazos son estimados y comienzan a contar desde la confirmación del pedido y pago. 
                ORIGEN hará todo lo posible por cumplir con estos plazos, pero no se hace responsable 
                de retrasos causados por la empresa de transporte o causas de fuerza mayor.
              </p>
              <p>
                Una vez realizado el envío, el Usuario recibirá un email con el número de seguimiento 
                para que pueda rastrear su pedido en todo momento.
              </p>
              <p>
                En el momento de la entrega, el Usuario debe verificar el estado del paquete. Si el 
                paquete presenta daños evidentes, el Usuario debe rechazarlo y contactar inmediatamente 
                con ORIGEN.
              </p>
            </div>
          </section>

          <section id="devolucion">
            <h2 className="text-2xl font-bold mb-4 text-[#8B7355]">6. Derecho de desistimiento</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                De conformidad con la legislación vigente en materia de protección de los consumidores, 
                el Usuario tiene derecho a desistir del contrato en un plazo de 14 días naturales sin 
                necesidad de justificación.
              </p>
              <p>
                El plazo de desistimiento expirará a los 14 días naturales del día que el Usuario o un 
                tercero indicado por el Usuario, distinto del transportista, adquirió la posesión material 
                de los bienes.
              </p>
              <p>
                <strong>Excepciones importantes:</strong> De acuerdo con el artículo 103 del Real Decreto 
                Legislativo 1/2007, no se aplicará el derecho de desistimiento a los productos perecederos 
                o que puedan deteriorarse o caducar con rapidez. Por tanto, los productos alimenticios 
                frescos incluidos en los packs no admiten devolución por este motivo, salvo que presenten 
                defectos o no correspondan con lo solicitado.
              </p>
              <p>
                Para ejercer el derecho de desistimiento, el Usuario deberá notificar su decisión a 
                ORIGEN mediante una declaración inequívoca (por ejemplo, un correo electrónico enviado 
                a devoluciones@origen.es).
              </p>
            </div>
          </section>

          <section id="garantias">
            <h2 className="text-2xl font-bold mb-4 text-[#8B7355]">7. Garantías</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                ORIGEN garantiza que todos los productos comercializados son conformes con el contrato 
                de compraventa y cumplen con la normativa vigente aplicable.
              </p>
              <p>
                Si un producto presenta alguna falta de conformidad, el Usuario podrá optar entre exigir 
                la reparación o sustitución del producto, salvo que una de estas opciones resulte 
                imposible o desproporcionada.
              </p>
              <p>
                El Usuario debe informar a ORIGEN de cualquier falta de conformidad en un plazo de 2 
                meses desde que tuvo conocimiento de la misma. Las garantías legales tienen una duración 
                de 2 años desde la entrega del producto.
              </p>
            </div>
          </section>

          <section id="propiedad">
            <h2 className="text-2xl font-bold mb-4 text-[#8B7355]">8. Propiedad intelectual</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Todos los contenidos del Sitio Web, incluyendo textos, gráficos, logotipos, iconos, 
                imágenes, clips de audio y vídeo, descargas digitales y compilaciones de datos, son 
                propiedad de ORIGEN o de sus proveedores de contenidos y están protegidos por las leyes 
                de propiedad intelectual e industrial.
              </p>
              <p>
                El Usuario se compromete a no reproducir, copiar, distribuir, poner a disposición o 
                comunicar públicamente, transformar o modificar los contenidos del Sitio Web sin la 
                autorización expresa de ORIGEN.
              </p>
            </div>
          </section>

          <section id="responsabilidad">
            <h2 className="text-2xl font-bold mb-4 text-[#8B7355]">9. Limitación de responsabilidad</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                ORIGEN no será responsable de los daños o perjuicios causados por el uso inadecuado 
                de la Plataforma o de los productos adquiridos, ni de aquellos derivados de casos de 
                fuerza mayor.
              </p>
              <p>
                ORIGEN no garantiza la disponibilidad y continuidad del funcionamiento del Sitio Web 
                ni se hace responsable de los daños causados por interrupciones del servicio, errores 
                en el acceso o virus informáticos.
              </p>
              <p>
                El Usuario es responsable del uso que haga de los productos adquiridos, especialmente 
                en lo relativo a su correcta conservación y consumo dentro de las fechas indicadas.
              </p>
            </div>
          </section>

          <section id="modificacion">
            <h2 className="text-2xl font-bold mb-4 text-[#8B7355]">10. Modificación de los términos</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                ORIGEN se reserva el derecho de modificar las presentes Condiciones Generales en cualquier 
                momento. Las modificaciones serán aplicables desde su publicación en el Sitio Web.
              </p>
              <p>
                Se recomienda al Usuario que revise periódicamente las Condiciones Generales para estar 
                informado de cualquier cambio. El uso continuado del Sitio Web tras la publicación de 
                las modificaciones implicará la aceptación de las mismas.
              </p>
            </div>
          </section>

          <section id="ley">
            <h2 className="text-2xl font-bold mb-4 text-[#8B7355]">11. Ley aplicable y jurisdicción</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Las presentes Condiciones Generales se rigen por la legislación española.
              </p>
              <p>
                Para la resolución de cualquier controversia derivada de la interpretación o aplicación 
                de las presentes Condiciones Generales, las partes se someten expresamente a los Juzgados 
                y Tribunales del domicilio del Usuario consumidor.
              </p>
              <p>
                Si el Usuario es un profesional o empresario, las partes se someten a los Juzgados y 
                Tribunales de Madrid capital.
              </p>
            </div>
          </section>

          {/* Contacto */}
          <section className="bg-[#FAF6F0] p-6 rounded-lg mt-8">
            <h3 className="text-lg font-bold mb-3 text-[#8B7355]">Datos de contacto</h3>
            <div className="text-muted-foreground space-y-2">
              <p><strong>Nombre comercial:</strong> ORIGEN</p>
              <p><strong>Email:</strong> legal@origen.es</p>
              <p><strong>Teléfono:</strong> +34 900 123 456</p>
              <p><strong>Dirección:</strong> Calle Ejemplo, 123, 28001 Madrid, España</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TerminosCondiciones;
