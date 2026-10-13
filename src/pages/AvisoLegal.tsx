import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Scale } from "lucide-react";

const AvisoLegal = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0]">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#8B7355] to-[#A0826D] text-white py-12">
        <div className="container mx-auto px-6 max-w-4xl">
          <Scale className="w-12 h-12 mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Aviso Legal
          </h1>
        </div>
      </section>

      {/* Content */}
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12 space-y-8">

          {/* Índice */}
          <nav className="bg-[#FAF6F0] p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-[#8B7355]">Índice</h2>
            <ol className="space-y-2 text-muted-foreground">
              <li><a href="#titular" className="hover:text-[#8B7355]">1. Identificación del titular</a></li>
              <li><a href="#objeto" className="hover:text-[#8B7355]">2. Objeto del sitio web</a></li>
              <li><a href="#condiciones" className="hover:text-[#8B7355]">3. Condiciones generales de utilización</a></li>
              <li><a href="#propiedad" className="hover:text-[#8B7355]">4. Propiedad intelectual e industrial</a></li>
              <li><a href="#responsabilidad" className="hover:text-[#8B7355]">5. Responsabilidad por los contenidos</a></li>
              <li><a href="#enlaces" className="hover:text-[#8B7355]">6. Enlaces a terceros</a></li>
              <li><a href="#legislacion" className="hover:text-[#8B7355]">7. Legislación aplicable y jurisdicción</a></li>
            </ol>
          </nav>

          <section id="titular">
            <h2 className="text-2xl font-bold mb-4 text-[#8B7355]">1. Identificación del titular</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                En cumplimiento del deber de información general previsto en la Ley 34/2002, de 11 de julio, de
                servicios de la sociedad de la información y de comercio electrónico, se facilitan los siguientes datos
                del titular de este sitio web:
              </p>
              <div className="bg-[#FAF6F0] p-4 rounded-lg space-y-1">
                <p><strong>Titular:</strong> PABLO RODRIGUEZ GOMEZ</p>
                <p><strong>Nombre comercial:</strong> RitmOrigen</p>
                <p><strong>Condición:</strong> Empresario individual / trabajador autónomo.</p>
                <p><strong>Domicilio profesional:</strong> Calle Orestes Gómez 7, 13120 Porzuna, Ciudad Real, España.</p>
                <p><strong>Correo electrónico:</strong> <a href="mailto:ritmorigen@gmail.com" className="text-[#8B7355] hover:underline">ritmorigen@gmail.com</a></p>
                <p><strong>Sitio web:</strong> <a href="https://ritmorigen.com" className="text-[#8B7355] hover:underline">https://ritmorigen.com</a></p>
              </div>
              <p>
                RitmOrigen es el nombre comercial bajo el que PABLO RODRIGUEZ GOMEZ desarrolla su actividad
                profesional como empresario individual.
              </p>
            </div>
          </section>

          <section id="objeto">
            <h2 className="text-2xl font-bold mb-4 text-[#8B7355]">2. Objeto del sitio web</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Este sitio web es una plataforma digital que da a conocer productores, empresas, productos,
                experiencias y rutas artesanas vinculadas al calendario agrícola y a la gastronomía de Castilla-La
                Mancha, y que permite a los usuarios y a las empresas interactuar con esos contenidos.
              </p>
              <p>
                El acceso a los contenidos informativos del sitio web es libre y gratuito. Determinadas
                funcionalidades pueden requerir el registro del usuario y se rigen, además, por los{" "}
                <a href="/terminos-condiciones" className="text-[#8B7355] hover:underline font-medium">Términos y Condiciones</a>.
              </p>
            </div>
          </section>

          <section id="condiciones">
            <h2 className="text-2xl font-bold mb-4 text-[#8B7355]">3. Condiciones generales de utilización</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                El acceso y la navegación por este sitio web atribuyen la condición de usuario e implican la
                aceptación de este Aviso Legal. El usuario se compromete a hacer un uso adecuado de los contenidos y
                servicios, conforme a la ley, la buena fe, el orden público y los derechos de terceros.
              </p>
              <p>Queda prohibido, en particular:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Utilizar el sitio web con fines ilícitos o lesivos para derechos o intereses de terceros.</li>
                <li>Introducir o difundir contenidos falsos, ofensivos o que vulneren derechos de terceros.</li>
                <li>Intentar acceder a áreas restringidas, o dañar, inutilizar o sobrecargar el sitio web o sus sistemas.</li>
                <li>Suplantar la identidad de otras personas o empresas.</li>
              </ul>
              <p>
                El tratamiento de datos personales se describe en la{" "}
                <a href="/politica-privacidad" className="text-[#8B7355] hover:underline font-medium">Política de Privacidad</a>{" "}
                y el uso de cookies en la{" "}
                <a href="/politica-cookies" className="text-[#8B7355] hover:underline font-medium">Política de Cookies</a>.
              </p>
            </div>
          </section>

          <section id="propiedad">
            <h2 className="text-2xl font-bold mb-4 text-[#8B7355]">4. Propiedad intelectual e industrial</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Los contenidos de este sitio web (textos, diseño, estructura, logotipos, imágenes y demás elementos)
                y el nombre comercial RitmOrigen están protegidos por la normativa de propiedad intelectual e
                industrial. Quedan reservados todos los derechos, salvo los que correspondan a terceros sobre
                contenidos que estos hayan facilitado.
              </p>
              <p>
                No se permite la reproducción, distribución, comunicación pública o transformación de los
                contenidos sin autorización previa del titular, salvo en los casos permitidos por la ley. Quien
                considere que algún contenido vulnera sus derechos puede comunicarlo a{" "}
                <a href="mailto:ritmorigen@gmail.com" className="text-[#8B7355] hover:underline">ritmorigen@gmail.com</a>.
              </p>
            </div>
          </section>

          <section id="responsabilidad">
            <h2 className="text-2xl font-bold mb-4 text-[#8B7355]">5. Responsabilidad por los contenidos</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                El titular procura que la información publicada sea correcta y esté actualizada, pero no puede
                garantizar la ausencia total de errores ni la disponibilidad ininterrumpida del sitio web, que puede
                verse afectada por tareas de mantenimiento o por causas ajenas a su control.
              </p>
              <p>
                Parte de los contenidos, como las fichas de empresas, productos o experiencias, valoraciones y
                opiniones, son aportados por empresas o usuarios, que responden de su veracidad y licitud. El
                titular retirará los contenidos ilícitos de los que tenga conocimiento efectivo.
              </p>
            </div>
          </section>

          <section id="enlaces">
            <h2 className="text-2xl font-bold mb-4 text-[#8B7355]">6. Enlaces a terceros</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Este sitio web puede contener enlaces a páginas de terceros y utilizar servicios externos (por
                ejemplo, de mapas). El titular no controla ni se responsabiliza de sus contenidos, políticas o
                prácticas, y su inclusión no implica recomendación ni vinculación con esos terceros.
              </p>
            </div>
          </section>

          <section id="legislacion">
            <h2 className="text-2xl font-bold mb-4 text-[#8B7355]">7. Legislación aplicable y jurisdicción</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Este Aviso Legal se rige por la legislación española. Para cualquier controversia, serán
                competentes los juzgados y tribunales que correspondan conforme a la normativa aplicable; cuando el
                usuario tenga la condición de consumidor, los de su domicilio en los términos previstos por la ley.
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AvisoLegal;
