import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Package, Route, Store, User, HelpCircle } from "lucide-react";

const FAQ = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0]">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#8B7355] to-[#A0826D] text-white py-16">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <HelpCircle className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Preguntas Frecuentes
          </h1>
          <p className="text-xl text-white/90">
            Encuentra respuestas a las dudas más comunes sobre ORIGEN
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="space-y-8">
          
          {/* Compras */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <ShoppingCart className="w-7 h-7 text-[#8B7355]" />
                Compras
              </CardTitle>
              <CardDescription>
                Todo sobre el proceso de compra y pagos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="payment-methods">
                  <AccordionTrigger className="text-left hover:text-[#8B7355]">
                    ¿Qué métodos de pago aceptáis?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express), 
                    transferencia bancaria, Bizum y PayPal. Todos los pagos se procesan de forma 
                    segura a través de pasarelas de pago certificadas.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="returns">
                  <AccordionTrigger className="text-left hover:text-[#8B7355]">
                    ¿Puedo devolver un producto?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Sí. Dispones de 14 días naturales desde la recepción del pedido para devolver 
                    productos no perecederos. Los productos alimenticios frescos no admiten devolución 
                    por motivos de salud e higiene, salvo que presenten defectos o no correspondan 
                    con lo solicitado. Para iniciar una devolución, contacta con nosotros a través 
                    del email de soporte.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="shipping-time">
                  <AccordionTrigger className="text-left hover:text-[#8B7355]">
                    ¿Cuánto tardaré en recibir mi pedido?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Los plazos de envío varían según el tipo de pack:
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li><strong>Packs Raíz:</strong> 2-3 días laborables</li>
                      <li><strong>Packs Esencia:</strong> 3-5 días laborables</li>
                      <li><strong>Packs Gourmet:</strong> 5-7 días laborables (productos de elaboración artesanal)</li>
                    </ul>
                    <p className="mt-2">
                      Recibirás un email con el número de seguimiento cuando tu pedido sea enviado.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="shipping-cost">
                  <AccordionTrigger className="text-left hover:text-[#8B7355]">
                    ¿Los gastos de envío están incluidos?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Sí, todos nuestros precios incluyen los gastos de envío. No hay costes adicionales 
                    ocultos. El precio que ves es el precio final que pagarás.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="invoice">
                  <AccordionTrigger className="text-left hover:text-[#8B7355]">
                    ¿Puedo solicitar una factura?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Sí. Todas las compras generan automáticamente una factura que puedes descargar 
                    desde tu área de cliente en la sección "Mis Compras". Si necesitas una factura 
                    con datos fiscales específicos, indícalo en las observaciones del pedido o 
                    contacta con nosotros.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Packs */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <Package className="w-7 h-7 text-[#8B7355]" />
                Packs
              </CardTitle>
              <CardDescription>
                Información sobre nuestros packs de productos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="pack-content">
                  <AccordionTrigger className="text-left hover:text-[#8B7355]">
                    ¿Qué incluye cada pack?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Cada pack incluye una selección curada de productos locales de la región indicada. 
                    En la página de cada pack encontrarás la lista completa de productos incluidos, 
                    con fotos, descripciones y información sobre el productor. Los packs incluyen 
                    entre 5 y 12 productos según la categoría (Raíz, Esencia o Gourmet).
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="origin-guarantee">
                  <AccordionTrigger className="text-left hover:text-[#8B7355]">
                    ¿Cómo garantizáis el origen de los productos?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Todos nuestros productores son verificados personalmente por nuestro equipo. 
                    Visitamos cada explotación, conocemos su historia y validamos sus certificaciones. 
                    Los packs con el sello "ORIGEN Verificado" garantizan que todos los productos 
                    proceden de la región indicada y cumplen nuestros estándares de calidad y 
                    autenticidad. Puedes leer la historia de cada productor en la ficha del pack.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="customization">
                  <AccordionTrigger className="text-left hover:text-[#8B7355]">
                    ¿Puedo personalizar el contenido de un pack?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Actualmente los packs vienen con un contenido fijo seleccionado por expertos 
                    para ofrecerte la mejor experiencia de la región. Si tienes alergias o intolerancias, 
                    indícalo en las observaciones del pedido y haremos lo posible por adaptarlo. 
                    Estamos trabajando en un sistema de personalización que estará disponible próximamente.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="preservation">
                  <AccordionTrigger className="text-left hover:text-[#8B7355]">
                    ¿Cómo se conservan los productos durante el envío?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Utilizamos embalajes sostenibles diseñados específicamente para productos 
                    alimentarios. Los productos refrigerados viajan en cajas isotérmicas con 
                    acumuladores de frío. Los productos de temperatura ambiente se embalan con 
                    separadores para evitar roturas. Todo el packaging es reciclable o compostable.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="expiry">
                  <AccordionTrigger className="text-left hover:text-[#8B7355]">
                    ¿Cuánto tiempo duran los productos?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Varía según el producto. Los productos frescos (quesos, embutidos) tienen una 
                    duración de 2-4 semanas. Los productos conservados (mermeladas, conservas, vinos) 
                    pueden durar meses o años. Todos los productos incluyen información sobre su 
                    fecha de consumo preferente o caducidad. Te recomendamos consumir los productos 
                    frescos en las primeras semanas tras recibirlos.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Rutas */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <Route className="w-7 h-7 text-[#8B7355]" />
                Rutas
              </CardTitle>
              <CardDescription>
                Preguntas sobre las rutas gastronómicas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="what-is-route">
                  <AccordionTrigger className="text-left hover:text-[#8B7355]">
                    ¿Qué es una ruta gastronómica?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Las rutas gastronómicas son itinerarios diseñados para descubrir los mejores 
                    productores y productos de una región. Incluyen visitas a explotaciones, 
                    degustaciones, recomendaciones de restaurantes locales y consejos prácticos 
                    para aprovechar al máximo tu experiencia. Puedes seguir nuestras rutas sugeridas 
                    o crear las tuyas propias.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="create-route">
                  <AccordionTrigger className="text-left hover:text-[#8B7355]">
                    ¿Cómo creo mi propia ruta?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Para crear tu ruta personalizada:
                    <ol className="list-decimal pl-5 mt-2 space-y-1">
                      <li>Accede a tu cuenta y ve a la sección "Crear Ruta"</li>
                      <li>Selecciona la región o provincia que quieres visitar</li>
                      <li>Añade las paradas que te interesen (productores, restaurantes, bodegas)</li>
                      <li>Organiza el orden de las visitas</li>
                      <li>Guarda tu ruta para consultarla cuando quieras</li>
                    </ol>
                    <p className="mt-2">
                      Puedes compartir tus rutas con otros usuarios de la comunidad ORIGEN.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="save-route">
                  <AccordionTrigger className="text-left hover:text-[#8B7355]">
                    ¿Puedo guardar rutas de otros usuarios?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Sí. En cada ruta pública encontrarás un botón "Guardar ruta" que te permitirá 
                    añadirla a tu colección personal. Luego podrás acceder a ella desde tu perfil 
                    en la sección "Mis Rutas - Rutas Guardadas". También puedes modificar las rutas 
                    guardadas para adaptarlas a tus preferencias.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="offline-routes">
                  <AccordionTrigger className="text-left hover:text-[#8B7355]">
                    ¿Puedo acceder a las rutas sin conexión?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Actualmente necesitas conexión para ver las rutas. Te recomendamos descargar 
                    o imprimir la información de tu ruta antes de emprender el viaje. Estamos 
                    trabajando en una funcionalidad de acceso offline que estará disponible próximamente 
                    en nuestra aplicación móvil.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="booking">
                  <AccordionTrigger className="text-left hover:text-[#8B7355]">
                    ¿Necesito reservar las visitas con antelación?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Sí, te recomendamos encarecidamente reservar con antelación, especialmente para 
                    bodegas, queserías y explotaciones que requieren visita guiada. En cada parada 
                    de la ruta encontrarás información de contacto y enlaces para hacer reservas. 
                    Algunos productores pequeños solo atienden con cita previa.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Empresas */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <Store className="w-7 h-7 text-[#8B7355]" />
                Empresas
              </CardTitle>
              <CardDescription>
                Información para productores y empresas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="join">
                  <AccordionTrigger className="text-left hover:text-[#8B7355]">
                    ¿Cómo puedo unirme a ORIGEN como productor?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Si eres productor local y quieres formar parte de ORIGEN:
                    <ol className="list-decimal pl-5 mt-2 space-y-1">
                      <li>Haz clic en "Soy Empresa" en el menú principal</li>
                      <li>Rellena el formulario con tus datos y la historia de tu negocio</li>
                      <li>Nuestro equipo revisará tu solicitud en un plazo de 5-7 días</li>
                      <li>Si cumples nuestros criterios, te contactaremos para una entrevista</li>
                      <li>Una vez aprobado, podrás crear y gestionar tus packs</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="requirements">
                  <AccordionTrigger className="text-left hover:text-[#8B7355]">
                    ¿Qué requisitos debo cumplir?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Para formar parte de ORIGEN debes cumplir estos requisitos:
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Ser productor local con productos de la región</li>
                      <li>Cumplir todas las normativas sanitarias y de seguridad alimentaria</li>
                      <li>Tener certificaciones de origen y calidad (según el producto)</li>
                      <li>Demostrar métodos de producción tradicionales o sostenibles</li>
                      <li>Comprometerte con nuestros valores de autenticidad y transparencia</li>
                    </ul>
                    <p className="mt-2">
                      No es necesario ser una gran empresa. Valoramos especialmente pequeños 
                      productores artesanales con historia familiar.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="commission">
                  <AccordionTrigger className="text-left hover:text-[#8B7355]">
                    ¿Qué comisión cobra ORIGEN?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    ORIGEN cobra una comisión del 15% sobre el precio de venta de cada pack. 
                    Esta comisión incluye: marketing y promoción de tus productos, gestión de pagos, 
                    atención al cliente, logística y embalaje, y acceso a nuestra plataforma. 
                    No hay cuotas mensuales ni costes ocultos. Solo pagas cuando vendes.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="payments">
                  <AccordionTrigger className="text-left hover:text-[#8B7355]">
                    ¿Cuándo recibo los pagos de mis ventas?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Los pagos se realizan quincenalmente mediante transferencia bancaria. Recibirás 
                    el importe de todas las ventas confirmadas en los 15 días anteriores, descontando 
                    la comisión de ORIGEN. Puedes consultar tus ventas y pagos en tiempo real desde 
                    tu panel de empresa.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="support">
                  <AccordionTrigger className="text-left hover:text-[#8B7355]">
                    ¿Qué apoyo ofrece ORIGEN a los productores?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Ofrecemos apoyo completo a nuestros productores:
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Asesoramiento para crear packs atractivos</li>
                      <li>Fotografía profesional de productos (opcional)</li>
                      <li>Promoción en redes sociales y newsletter</li>
                      <li>Análisis de ventas y feedback de clientes</li>
                      <li>Soporte técnico para usar la plataforma</li>
                      <li>Formación en marketing digital y storytelling</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Cuenta */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <User className="w-7 h-7 text-[#8B7355]" />
                Cuenta
              </CardTitle>
              <CardDescription>
                Gestión de tu cuenta y perfil
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="create-account">
                  <AccordionTrigger className="text-left hover:text-[#8B7355]">
                    ¿Necesito crear una cuenta para comprar?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Sí, necesitas crear una cuenta para realizar compras en ORIGEN. Esto nos permite 
                    ofrecerte un mejor servicio: historial de pedidos, seguimiento de envíos, 
                    guardar favoritos, crear rutas personalizadas y recibir recomendaciones adaptadas 
                    a tus gustos. El registro es gratuito y solo te llevará un minuto.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="reset-password">
                  <AccordionTrigger className="text-left hover:text-[#8B7355]">
                    He olvidado mi contraseña, ¿qué hago?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Para restablecer tu contraseña:
                    <ol className="list-decimal pl-5 mt-2 space-y-1">
                      <li>Ve a la página de inicio de sesión</li>
                      <li>Haz clic en "¿Has olvidado tu contraseña?"</li>
                      <li>Introduce tu email registrado</li>
                      <li>Recibirás un correo con instrucciones para crear una nueva contraseña</li>
                      <li>Sigue el enlace y establece tu nueva contraseña</li>
                    </ol>
                    <p className="mt-2">
                      Si no recibes el correo en 5 minutos, revisa tu carpeta de spam.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="change-email">
                  <AccordionTrigger className="text-left hover:text-[#8B7355]">
                    ¿Puedo cambiar mi dirección de email?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Por motivos de seguridad, el email asociado a tu cuenta no se puede modificar 
                    directamente. Si necesitas cambiar tu email de contacto, ponte en contacto con 
                    nuestro equipo de soporte indicando tu email actual y el nuevo email que deseas 
                    utilizar. Verificaremos tu identidad y realizaremos el cambio.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="notifications">
                  <AccordionTrigger className="text-left hover:text-[#8B7355]">
                    ¿Cómo gestiono las notificaciones que recibo?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Puedes gestionar todas tus preferencias de notificaciones desde tu perfil:
                    <ol className="list-decimal pl-5 mt-2 space-y-1">
                      <li>Accede a "Mi Cuenta"</li>
                      <li>Ve a la pestaña "Configuración"</li>
                      <li>En la sección "Notificaciones" puedes activar/desactivar:</li>
                    </ol>
                    <ul className="list-disc pl-10 mt-2 space-y-1">
                      <li>Notificaciones por email</li>
                      <li>Notificaciones por SMS</li>
                      <li>Ofertas y promociones</li>
                      <li>Newsletter mensual</li>
                    </ul>
                    <p className="mt-2">
                      Las notificaciones de pedidos y seguimiento no se pueden desactivar por 
                      motivos de servicio.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="delete-account">
                  <AccordionTrigger className="text-left hover:text-[#8B7355]">
                    ¿Cómo elimino mi cuenta?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Sentimos que quieras irte. Para eliminar tu cuenta:
                    <ol className="list-decimal pl-5 mt-2 space-y-1">
                      <li>Contacta con nuestro equipo de soporte</li>
                      <li>Solicita la eliminación de tu cuenta</li>
                      <li>Confirmaremos tu identidad</li>
                      <li>Procesaremos la eliminación en un plazo de 7 días</li>
                    </ol>
                    <p className="mt-2">
                      <strong>Importante:</strong> Esta acción es irreversible. Se eliminarán todos 
                      tus datos personales, historial de compras, rutas guardadas y favoritos. 
                      Los datos fiscales se conservarán el tiempo legalmente requerido.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Contacto adicional */}
          <Card className="shadow-lg border-[#8B7355]/20 bg-gradient-to-br from-white to-[#FAF6F0]">
            <CardHeader>
              <CardTitle className="text-2xl">¿No encuentras lo que buscas?</CardTitle>
              <CardDescription>
                Nuestro equipo está aquí para ayudarte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Si tu pregunta no está en esta lista, no dudes en contactarnos. Responderemos 
                en menos de 24 horas.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="/contacto">
                  <button className="w-full sm:w-auto px-6 py-3 bg-[#8B7355] hover:bg-[#7A6449] text-white rounded-lg font-medium transition-colors">
                    Ir a Contacto
                  </button>
                </a>
                <a href="mailto:info@origen.es">
                  <button className="w-full sm:w-auto px-6 py-3 border-2 border-[#8B7355] text-[#8B7355] hover:bg-[#8B7355] hover:text-white rounded-lg font-medium transition-colors">
                    info@origen.es
                  </button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
