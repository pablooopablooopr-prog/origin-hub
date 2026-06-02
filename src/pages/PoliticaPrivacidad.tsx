import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield } from "lucide-react";

const PoliticaPrivacidad = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0]">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#8B7355] to-[#A0826D] text-white py-12">
        <div className="container mx-auto px-6 max-w-4xl">
          <Shield className="w-12 h-12 mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Política de Privacidad
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
              <li><a href="#responsable" className="hover:text-[#8B7355]">1. Responsable del tratamiento</a></li>
              <li><a href="#datos" className="hover:text-[#8B7355]">2. Datos personales que recabamos</a></li>
              <li><a href="#finalidad" className="hover:text-[#8B7355]">3. Finalidad del tratamiento</a></li>
              <li><a href="#base" className="hover:text-[#8B7355]">4. Base legal</a></li>
              <li><a href="#plazo" className="hover:text-[#8B7355]">5. Plazo de conservación</a></li>
              <li><a href="#destinatarios" className="hover:text-[#8B7355]">6. Destinatarios de los datos</a></li>
              <li><a href="#derechos" className="hover:text-[#8B7355]">7. Derechos del usuario</a></li>
              <li><a href="#cookies" className="hover:text-[#8B7355]">8. Cookies y tecnologías similares</a></li>
              <li><a href="#seguridad" className="hover:text-[#8B7355]">9. Seguridad de los datos</a></li>
              <li><a href="#menores" className="hover:text-[#8B7355]">10. Menores de edad</a></li>
              <li><a href="#modificaciones" className="hover:text-[#8B7355]">11. Modificaciones de la política</a></li>
            </ol>
          </nav>

          {/* Introducción */}
          <section>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                En ORIGEN respetamos tu privacidad y nos comprometemos a proteger tus datos personales. 
                Esta Política de Privacidad te informa sobre cómo recabamos, utilizamos, compartimos y 
                protegemos tu información personal cuando utilizas nuestra plataforma.
              </p>
              <p>
                <strong>ORIGEN es una plataforma digital y solo actúa como intermediario tecnológico.</strong> 
                ORIGEN no manipula, no almacena, no empaca y no gestiona envíos. El productor es siempre 
                el responsable del envío y la preparación del pedido.
              </p>
              <p>
                Al utilizar nuestros servicios, aceptas las prácticas descritas en esta política. 
                Te recomendamos que leas detenidamente este documento.
              </p>
            </div>
          </section>

          <section id="responsable">
            <h2 className="text-2xl font-bold mb-4 text-[#8B7355]">1. Responsable del tratamiento</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>El responsable del tratamiento de tus datos personales es:</p>
              <div className="bg-[#FAF6F0] p-4 rounded-lg">
                <p><strong>Identidad:</strong> ORIGEN S.L.</p>
                <p><strong>NIF:</strong> B-12345678</p>
                <p><strong>Dirección:</strong> Calle Ejemplo, 123, 28001 Madrid, España</p>
                <p><strong>Email:</strong> ritmorigen@gmail.com</p>
                <p><strong>Teléfono:</strong> +34 900 123 456</p>
              </div>
            </div>
          </section>

          <section id="datos">
            <h2 className="text-2xl font-bold mb-4 text-[#8B7355]">2. Datos personales que recabamos</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>Recabamos y tratamos las siguientes categorías de datos personales:</p>
              
              <h3 className="text-lg font-semibold text-[#8B7355] mt-6">Datos de identificación y contacto</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Nombre y apellidos</li>
                <li>Dirección de correo electrónico</li>
                <li>Número de teléfono</li>
                <li>Dirección postal</li>
              </ul>

              <h3 className="text-lg font-semibold text-[#8B7355] mt-6">Datos de compra y pago</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Historial de pedidos</li>
                <li>Información de facturación</li>
                <li>Datos bancarios (tratados por el proveedor de pago, no almacenados por ORIGEN)</li>
              </ul>

              <h3 className="text-lg font-semibold text-[#8B7355] mt-6">Datos de navegación</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Dirección IP</li>
                <li>Tipo de navegador</li>
                <li>Páginas visitadas</li>
                <li>Tiempo de navegación</li>
                <li>Cookies y tecnologías similares</li>
              </ul>

              <h3 className="text-lg font-semibold text-[#8B7355] mt-6">Datos derivados de tu uso de la plataforma</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Preferencias de productos</li>
                <li>Favoritos y listas de deseos</li>
                <li>Valoraciones y reseñas</li>
                <li>Rutas creadas y guardadas</li>
              </ul>
            </div>
          </section>

          <section id="finalidad">
            <h2 className="text-2xl font-bold mb-4 text-[#8B7355]">3. Finalidad del tratamiento</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>Tratamos tus datos personales para las siguientes finalidades:</p>
              
              <h3 className="text-lg font-semibold text-[#8B7355] mt-6">Gestión de la cuenta de usuario</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Crear y gestionar tu cuenta de usuario</li>
                <li>Permitirte acceder a funcionalidades personalizadas</li>
                <li>Gestionar tus preferencias y configuración</li>
              </ul>

              <h3 className="text-lg font-semibold text-[#8B7355] mt-6">Procesamiento de pedidos</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Gestionar y procesar tus pedidos</li>
                <li>Gestionar pagos y facturación</li>
                <li>Organizar el envío y entrega de productos</li>
                <li>Gestionar devoluciones y reclamaciones</li>
              </ul>

              <h3 className="text-lg font-semibold text-[#8B7355] mt-6">Comunicaciones</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Enviarte confirmaciones de pedido y actualizaciones de envío</li>
                <li>Responder a tus consultas y solicitudes</li>
                <li>Enviarte información sobre nuestros productos y servicios (con tu consentimiento)</li>
                <li>Enviarte encuestas de satisfacción</li>
              </ul>

              <h3 className="text-lg font-semibold text-[#8B7355] mt-6">Mejora del servicio</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Analizar el uso de la plataforma</li>
                <li>Mejorar nuestros productos y servicios</li>
                <li>Personalizar tu experiencia</li>
                <li>Detectar y prevenir fraudes</li>
              </ul>
            </div>
          </section>

          <section id="base">
            <h2 className="text-2xl font-bold mb-4 text-[#8B7355]">4. Base legal</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                El tratamiento de tus datos personales se basa en las siguientes bases legales según 
                el Reglamento General de Protección de Datos (RGPD):
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Ejecución de un contrato:</strong> Para gestionar tus pedidos y prestarte 
                  nuestros servicios.
                </li>
                <li>
                  <strong>Consentimiento:</strong> Para enviarte comunicaciones comerciales y newsletter 
                  (solo si has dado tu consentimiento explícito).
                </li>
                <li>
                  <strong>Interés legítimo:</strong> Para mejorar nuestros servicios, prevenir fraudes 
                  y garantizar la seguridad de la plataforma.
                </li>
                <li>
                  <strong>Obligación legal:</strong> Para cumplir con obligaciones fiscales, contables 
                  y de protección de consumidores.
                </li>
              </ul>
            </div>
          </section>

          <section id="plazo">
            <h2 className="text-2xl font-bold mb-4 text-[#8B7355]">5. Plazo de conservación</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>Conservamos tus datos personales durante los siguientes plazos:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Datos de usuario activo:</strong> Mientras mantengas tu cuenta activa.
                </li>
                <li>
                  <strong>Datos de pedidos:</strong> Durante 6 años desde la realización del pedido 
                  (obligación fiscal y contable).
                </li>
                <li>
                  <strong>Datos de marketing:</strong> Hasta que retires tu consentimiento o solicites 
                  la supresión.
                </li>
                <li>
                  <strong>Datos de navegación:</strong> Máximo 2 años desde su recogida.
                </li>
              </ul>
              <p>
                Una vez transcurridos estos plazos, procederemos a la supresión segura de tus datos 
                personales.
              </p>
            </div>
          </section>

          <section id="destinatarios">
            <h2 className="text-2xl font-bold mb-4 text-[#8B7355]">6. Destinatarios de los datos</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Tus datos personales pueden ser compartidos con terceros en los siguientes casos:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Proveedores de servicios:</strong> Empresas de hosting, pasarelas de pago, 
                  empresas de mensajería, servicios de email marketing, etc. Todos nuestros proveedores 
                  están obligados contractualmente a proteger tus datos.
                </li>
                <li>
                  <strong>Productores:</strong> Compartimos tu dirección de envío con los productores 
                  para que puedan preparar y enviar tu pedido.
                </li>
                <li>
                  <strong>Autoridades públicas:</strong> Cuando sea requerido por ley o para proteger 
                  nuestros derechos legales.
                </li>
              </ul>
              <p>
                No vendemos ni alquilamos tus datos personales a terceros para fines comerciales.
              </p>
            </div>
          </section>

          <section id="derechos">
            <h2 className="text-2xl font-bold mb-4 text-[#8B7355]">7. Derechos del usuario</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Tienes derecho a ejercitar los siguientes derechos en relación con tus datos personales:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Derecho de acceso:</strong> Conocer qué datos personales tenemos sobre ti.
                </li>
                <li>
                  <strong>Derecho de rectificación:</strong> Corregir datos inexactos o incompletos.
                </li>
                <li>
                  <strong>Derecho de supresión:</strong> Solicitar la eliminación de tus datos (derecho 
                  al olvido).
                </li>
                <li>
                  <strong>Derecho a la limitación del tratamiento:</strong> Solicitar que limitemos 
                  el uso de tus datos.
                </li>
                <li>
                  <strong>Derecho a la portabilidad:</strong> Recibir tus datos en un formato estructurado 
                  y de uso común.
                </li>
                <li>
                  <strong>Derecho de oposición:</strong> Oponerte al tratamiento de tus datos.
                </li>
                <li>
                  <strong>Derecho a no ser objeto de decisiones automatizadas:</strong> No ser objeto 
                  de decisiones basadas únicamente en tratamiento automatizado.
                </li>
              </ul>
              <p>
                Para ejercitar tus derechos, puedes contactarnos en: <strong>ritmorigen@gmail.com</strong>
              </p>
              <p>
                También tienes derecho a presentar una reclamación ante la Agencia Española de Protección 
                de Datos (AEPD) si consideras que el tratamiento de tus datos personales vulnera la 
                normativa aplicable.
              </p>
            </div>
          </section>

          <section id="cookies">
            <h2 className="text-2xl font-bold mb-4 text-[#8B7355]">8. Cookies y tecnologías similares</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Utilizamos cookies y tecnologías similares para mejorar tu experiencia en nuestra 
                plataforma. Para más información sobre qué cookies utilizamos y cómo puedes gestionarlas, 
                consulta nuestra <a href="/politica-cookies" className="text-[#8B7355] hover:underline font-medium">Política de Cookies</a>.
              </p>
            </div>
          </section>

          <section id="seguridad">
            <h2 className="text-2xl font-bold mb-4 text-[#8B7355]">9. Seguridad de los datos</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Implementamos medidas técnicas y organizativas apropiadas para proteger tus datos 
                personales contra el acceso no autorizado, la pérdida, la destrucción o la alteración.
              </p>
              <p>
                Estas medidas incluyen:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Cifrado SSL/TLS para todas las comunicaciones</li>
                <li>Almacenamiento seguro de contraseñas mediante hash</li>
                <li>Acceso restringido a datos personales solo para personal autorizado</li>
                <li>Auditorías regulares de seguridad</li>
                <li>Copias de seguridad periódicas</li>
              </ul>
              <p>
                Sin embargo, ningún sistema de seguridad es infalible. Te recomendamos que mantengas 
                la confidencialidad de tu contraseña y que no la compartas con terceros.
              </p>
            </div>
          </section>

          <section id="menores">
            <h2 className="text-2xl font-bold mb-4 text-[#8B7355]">10. Menores de edad</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Nuestros servicios no están dirigidos a menores de 18 años. No recabamos intencionadamente 
                datos personales de menores de edad. Si eres padre o tutor legal y tienes conocimiento 
                de que tu hijo nos ha proporcionado datos personales, contacta con nosotros para que 
                podamos eliminar dicha información.
              </p>
            </div>
          </section>

          <section id="modificaciones">
            <h2 className="text-2xl font-bold mb-4 text-[#8B7355]">11. Modificaciones de la política</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Nos reservamos el derecho de modificar esta Política de Privacidad en cualquier momento. 
                Cualquier cambio será publicado en esta página y, si los cambios son significativos, 
                te lo notificaremos por email o mediante un aviso destacado en la plataforma.
              </p>
              <p>
                Te recomendamos que revises periódicamente esta política para estar informado sobre 
                cómo protegemos tu información.
              </p>
            </div>
          </section>

          {/* Contacto */}
          <section className="bg-[#FAF6F0] p-6 rounded-lg mt-8">
            <h3 className="text-lg font-bold mb-3 text-[#8B7355]">Contacto para cuestiones de privacidad</h3>
            <div className="text-muted-foreground space-y-2">
              <p>
                Si tienes alguna pregunta o inquietud sobre nuestra Política de Privacidad o sobre 
                el tratamiento de tus datos personales, puedes contactarnos en:
              </p>
              <p><strong>Email:</strong> ritmorigen@gmail.com</p>
              <p><strong>Teléfono:</strong> +34 900 123 456</p>
              <p><strong>Dirección postal:</strong> Calle Ejemplo, 123, 28001 Madrid, España</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PoliticaPrivacidad;
