import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Cookie } from "lucide-react";

const PoliticaCookies = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0]">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#8B7355] to-[#A0826D] text-white py-12">
        <div className="container mx-auto px-6 max-w-4xl">
          <Cookie className="w-12 h-12 mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Política de Cookies
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
              <li><a href="#que-son" className="hover:text-[#8B7355]">1. ¿Qué son las cookies?</a></li>
              <li><a href="#tipos" className="hover:text-[#8B7355]">2. Tipos de cookies que utilizamos</a></li>
              <li><a href="#cookies-especificas" className="hover:text-[#8B7355]">3. Cookies específicas que utilizamos</a></li>
              <li><a href="#finalidad" className="hover:text-[#8B7355]">4. Finalidad de las cookies</a></li>
              <li><a href="#terceros" className="hover:text-[#8B7355]">5. Cookies de terceros</a></li>
              <li><a href="#gestion" className="hover:text-[#8B7355]">6. Cómo gestionar las cookies</a></li>
              <li><a href="#desactivar" className="hover:text-[#8B7355]">7. Cómo desactivar las cookies</a></li>
              <li><a href="#actualizaciones" className="hover:text-[#8B7355]">8. Actualizaciones de esta política</a></li>
            </ol>
          </nav>

          {/* Introducción */}
          <section>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                En ORIGEN utilizamos cookies y tecnologías similares para mejorar tu experiencia en 
                nuestra plataforma, analizar el tráfico y personalizar el contenido. Esta Política 
                de Cookies explica qué son las cookies, qué tipos utilizamos y cómo puedes gestionarlas.
              </p>
            </div>
          </section>

          <section id="que-son">
            <h2 className="text-2xl font-bold mb-4 text-[#8B7355]">1. ¿Qué son las cookies?</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo (ordenador, 
                tablet o smartphone) cuando visitas un sitio web. Las cookies permiten que el sitio 
                web recuerde tus acciones y preferencias durante un período de tiempo, por lo que no 
                tienes que volver a configurarlas cada vez que regresas al sitio o navegas de una página 
                a otra.
              </p>
            </div>
          </section>

          <section id="tipos">
            <h2 className="text-2xl font-bold mb-4 text-[#8B7355]">2. Tipos de cookies que utilizamos</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>Clasificamos las cookies según diferentes criterios:</p>
              
              <h3 className="text-lg font-semibold text-[#8B7355] mt-6">Según su duración</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Cookies de sesión:</strong> Son cookies temporales que permanecen en el 
                  archivo de cookies de tu navegador hasta que abandonas el sitio web. No almacenan 
                  información de forma permanente.
                </li>
                <li>
                  <strong>Cookies persistentes:</strong> Son cookies que permanecen en tu dispositivo 
                  durante un período de tiempo determinado o hasta que las elimines manualmente. 
                  Ayudan a reconocerte cuando regresas a nuestro sitio web.
                </li>
              </ul>

              <h3 className="text-lg font-semibold text-[#8B7355] mt-6">Según su origen</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Cookies propias:</strong> Son cookies establecidas por nuestro sitio web 
                  (origen.es) y solo pueden ser leídas por él.
                </li>
                <li>
                  <strong>Cookies de terceros:</strong> Son cookies establecidas por otros sitios web 
                  o servicios que ejecutan contenido en la página que estás visitando (por ejemplo, 
                  servicios de análisis o redes sociales).
                </li>
              </ul>

              <h3 className="text-lg font-semibold text-[#8B7355] mt-6">Según su finalidad</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Cookies técnicas o necesarias:</strong> Son esenciales para que puedas 
                  navegar por el sitio web y utilizar sus funciones. Sin estas cookies, servicios 
                  como el carrito de compra o la facturación electrónica no podrían funcionar.
                </li>
                <li>
                  <strong>Cookies de rendimiento o analíticas:</strong> Recopilan información sobre 
                  cómo utilizas el sitio web (por ejemplo, qué páginas visitas más). Esta información 
                  se utiliza para mejorar el funcionamiento del sitio web.
                </li>
                <li>
                  <strong>Cookies de funcionalidad:</strong> Permiten que el sitio web recuerde las 
                  elecciones que haces (como tu nombre de usuario, idioma o región) y proporcionan 
                  funciones mejoradas y más personales.
                </li>
                <li>
                  <strong>Cookies de publicidad o marketing:</strong> Se utilizan para mostrarte 
                  anuncios relevantes para ti y tus intereses. También se utilizan para limitar el 
                  número de veces que ves un anuncio y para medir la efectividad de las campañas 
                  publicitarias.
                </li>
              </ul>
            </div>
          </section>

          <section id="cookies-especificas">
            <h2 className="text-2xl font-bold mb-4 text-[#8B7355]">3. Cookies específicas que utilizamos</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>A continuación, detallamos las cookies específicas que utiliza ORIGEN:</p>
              
              <div className="overflow-x-auto mt-4">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#FAF6F0]">
                      <th className="border border-muted p-3 text-left">Cookie</th>
                      <th className="border border-muted p-3 text-left">Tipo</th>
                      <th className="border border-muted p-3 text-left">Duración</th>
                      <th className="border border-muted p-3 text-left">Finalidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-muted p-3">session_id</td>
                      <td className="border border-muted p-3">Técnica (propia)</td>
                      <td className="border border-muted p-3">Sesión</td>
                      <td className="border border-muted p-3">Identificar tu sesión de usuario</td>
                    </tr>
                    <tr>
                      <td className="border border-muted p-3">auth_token</td>
                      <td className="border border-muted p-3">Técnica (propia)</td>
                      <td className="border border-muted p-3">30 días</td>
                      <td className="border border-muted p-3">Mantener tu sesión activa</td>
                    </tr>
                    <tr>
                      <td className="border border-muted p-3">cart_items</td>
                      <td className="border border-muted p-3">Técnica (propia)</td>
                      <td className="border border-muted p-3">7 días</td>
                      <td className="border border-muted p-3">Recordar productos en tu carrito</td>
                    </tr>
                    <tr>
                      <td className="border border-muted p-3">language_pref</td>
                      <td className="border border-muted p-3">Funcionalidad (propia)</td>
                      <td className="border border-muted p-3">1 año</td>
                      <td className="border border-muted p-3">Recordar tu preferencia de idioma</td>
                    </tr>
                    <tr>
                      <td className="border border-muted p-3">cookie_consent</td>
                      <td className="border border-muted p-3">Técnica (propia)</td>
                      <td className="border border-muted p-3">1 año</td>
                      <td className="border border-muted p-3">Recordar tus preferencias de cookies</td>
                    </tr>
                    <tr>
                      <td className="border border-muted p-3">_ga</td>
                      <td className="border border-muted p-3">Analítica (terceros - Google)</td>
                      <td className="border border-muted p-3">2 años</td>
                      <td className="border border-muted p-3">Distinguir usuarios para Google Analytics</td>
                    </tr>
                    <tr>
                      <td className="border border-muted p-3">_gid</td>
                      <td className="border border-muted p-3">Analítica (terceros - Google)</td>
                      <td className="border border-muted p-3">24 horas</td>
                      <td className="border border-muted p-3">Distinguir usuarios para Google Analytics</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section id="finalidad">
            <h2 className="text-2xl font-bold mb-4 text-[#8B7355]">4. Finalidad de las cookies</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>Utilizamos cookies para los siguientes propósitos:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Funcionamiento esencial:</strong> Permitir que funcionen características 
                  básicas como la autenticación de usuario, el carrito de compras y el proceso de pago.
                </li>
                <li>
                  <strong>Mejora del rendimiento:</strong> Entender cómo interactúas con nuestro 
                  sitio web para poder mejorarlo continuamente.
                </li>
                <li>
                  <strong>Personalización:</strong> Recordar tus preferencias (como región, idioma) 
                  y ofrecerte contenido relevante.
                </li>
                <li>
                  <strong>Análisis:</strong> Recopilar información estadística sobre el uso del sitio 
                  web (páginas más visitadas, tiempo de navegación, etc.).
                </li>
                <li>
                  <strong>Seguridad:</strong> Detectar y prevenir actividades fraudulentas o no 
                  autorizadas.
                </li>
              </ul>
            </div>
          </section>

          <section id="terceros">
            <h2 className="text-2xl font-bold mb-4 text-[#8B7355]">5. Cookies de terceros</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Además de nuestras propias cookies, utilizamos cookies de terceros para proporcionar 
                determinados servicios:
              </p>
              
              <h3 className="text-lg font-semibold text-[#8B7355] mt-6">Google Analytics</h3>
              <p>
                Utilizamos Google Analytics para analizar el uso de nuestro sitio web. Google Analytics 
                genera información estadística mediante cookies que se almacenan en tu dispositivo. 
                La información generada sobre tu uso del sitio web (incluyendo tu dirección IP) se 
                transmite y almacena en servidores de Google.
              </p>
              <p>
                Para más información sobre las cookies de Google Analytics, consulta: 
                <a href="https://developers.google.com/analytics/devguides/collection/analyticsjs/cookie-usage" target="_blank" rel="noopener noreferrer" className="text-[#8B7355] hover:underline ml-1">
                  Google Analytics Cookie Usage
                </a>
              </p>

              <h3 className="text-lg font-semibold text-[#8B7355] mt-6">Pasarelas de pago</h3>
              <p>
                Nuestros proveedores de servicios de pago (como Stripe o PayPal) pueden establecer 
                sus propias cookies para procesar pagos de forma segura. Estas cookies son necesarias 
                para completar la transacción.
              </p>
            </div>
          </section>

          <section id="gestion">
            <h2 className="text-2xl font-bold mb-4 text-[#8B7355]">6. Cómo gestionar las cookies</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Puedes gestionar tus preferencias de cookies en cualquier momento. Al visitar nuestro 
                sitio web por primera vez, verás un banner de cookies que te permite:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Aceptar todas las cookies</li>
                <li>Rechazar cookies no esenciales</li>
                <li>Personalizar tus preferencias de cookies por categoría</li>
              </ul>
              <p>
                Puedes cambiar tus preferencias en cualquier momento haciendo clic en el enlace 
                "Configuración de cookies" en el pie de página.
              </p>
            </div>
          </section>

          <section id="desactivar">
            <h2 className="text-2xl font-bold mb-4 text-[#8B7355]">7. Cómo desactivar las cookies</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                La mayoría de los navegadores web permiten controlar las cookies a través de sus 
                ajustes de configuración. A continuación, te proporcionamos enlaces a las instrucciones 
                de los navegadores más comunes:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-[#8B7355] hover:underline">
                    Google Chrome
                  </a>
                </li>
                <li>
                  <a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer" className="text-[#8B7355] hover:underline">
                    Mozilla Firefox
                  </a>
                </li>
                <li>
                  <a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-[#8B7355] hover:underline">
                    Safari
                  </a>
                </li>
                <li>
                  <a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-[#8B7355] hover:underline">
                    Microsoft Edge
                  </a>
                </li>
              </ul>
              <p className="mt-4">
                <strong>Importante:</strong> Si desactivas todas las cookies, es posible que algunas 
                funciones de nuestro sitio web no funcionen correctamente. En particular, no podrás:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Añadir productos al carrito de compra</li>
                <li>Completar el proceso de pago</li>
                <li>Acceder a áreas personalizadas del sitio</li>
              </ul>
            </div>
          </section>

          <section id="actualizaciones">
            <h2 className="text-2xl font-bold mb-4 text-[#8B7355]">8. Actualizaciones de esta política</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Podemos actualizar nuestra Política de Cookies periódicamente para reflejar cambios 
                en las cookies que utilizamos o por otras razones operativas, legales o reglamentarias.
              </p>
              <p>
                Te recomendamos que revises esta página de forma periódica para estar informado sobre 
                nuestro uso de cookies. La fecha de la última actualización se indica al principio de 
                esta política.
              </p>
              <p className="mt-4">
                <strong>Nota importante:</strong> ORIGEN utiliza cookies únicamente para mejorar la 
                experiencia de navegación y facilitar la conexión entre productores y consumidores. 
                No están relacionadas con procesos logísticos ni de envío.
              </p>
            </div>
          </section>

          {/* Contacto */}
          <section className="bg-[#FAF6F0] p-6 rounded-lg mt-8">
            <h3 className="text-lg font-bold mb-3 text-[#8B7355]">Contacto</h3>
            <div className="text-muted-foreground space-y-2">
              <p>
                Si tienes alguna pregunta sobre nuestra Política de Cookies, puedes contactarnos en:
              </p>
              <p><strong>Email:</strong> privacidad@origen.es</p>
              <p><strong>Teléfono:</strong> +34 900 123 456</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PoliticaCookies;
