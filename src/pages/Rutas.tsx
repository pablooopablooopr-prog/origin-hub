import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RoutesExplorer from "@/components/RoutesExplorer";
import { Button } from "@/components/ui/button";
import { RouteDetail } from "@/data/routes";
import oliveOilBottle from "@/assets/olive-oil-bottle.png";
import cheeseWheel from "@/assets/cheese-wheel.png";
import seafoodDisplay from "@/assets/seafood-display.png";

// Extended routes array specifically for /rutas page
const extendedRoutesData: RouteDetail[] = [
  {
    id: "bodegas-y-vinedos",
    title: "Bodegas y Viñedos Secretos",
    description: "Descubre bodegas familiares ocultas en La Rioja",
    duration: "1 día",
    businesses: 4,
    rating: "Una experiencia única e irrepetible",
    participants: 42,
    image: oliveOilBottle,
    difficulty: "Fácil",
    narrative: "Sumérgete en los secretos mejor guardados de La Rioja...",
    stops: [],
    dailyRecommendations: [],
    practicalInfo: {
      level: "Fácil",
      duration: "Día completo (8-10 horas)",
      recommendedPeople: "2-8 personas",
      localTips: []
    }
  },
  {
    id: "panaderia-dulce-tradicion",
    title: "Panadería y Dulce Tradición",
    description: "Hornos centenarios y dulces artesanos de Castilla",
    duration: "Medio día",
    businesses: 3,
    rating: "El sabor auténtico de nuestros ancestros",
    participants: 28,
    image: cheeseWheel,
    difficulty: "Fácil",
    narrative: "Despierta todos tus sentidos en una ruta...",
    stops: [],
    dailyRecommendations: [],
    practicalInfo: {
      level: "Fácil",
      duration: "Medio día (4-5 horas)",
      recommendedPeople: "2-6 personas",
      localTips: []
    }
  },
  {
    id: "mercados-temporada",
    title: "Mercados de Temporada",
    description: "Productos frescos y de proximidad en mercados tradicionales",
    duration: "Mañana",
    businesses: 5,
    rating: "La frescura y calidad que buscaba",
    participants: 65,
    image: seafoodDisplay,
    difficulty: "Fácil",
    narrative: "Descubre la autenticidad de los mercados tradicionales...",
    stops: [],
    dailyRecommendations: [],
    practicalInfo: {
      level: "Fácil", 
      duration: "Media jornada (3-4 horas)",
      recommendedPeople: "2-4 personas",
      localTips: []
    }
  },
  {
    id: "ruta-artesanos-castilla",
    title: "Artesanos de Castilla",
    description: "Descubre oficios tradicionales y artesanía única",
    duration: "1 día",
    businesses: 4,
    rating: "Una conexión única con nuestras tradiciones",
    participants: 35,
    image: oliveOilBottle,
    difficulty: "Fácil",
    narrative: "Sumérgete en el mundo de los oficios tradicionales...",
    stops: [],
    dailyRecommendations: [],
    practicalInfo: {
      level: "Fácil",
      duration: "Día completo (6-8 horas)",
      recommendedPeople: "2-6 personas",
      localTips: []
    }
  },
  {
    id: "costa-marisqueo",
    title: "Costa y Marisqueo Tradicional",
    description: "Marisqueo artesanal y pescado fresco del Cantábrico",
    duration: "1 día",
    businesses: 5,
    rating: "El mar en estado puro",
    participants: 42,
    image: seafoodDisplay,
    difficulty: "Moderado",
    narrative: "Conecta con la tradición marinera más auténtica...",
    stops: [],
    dailyRecommendations: [],
    practicalInfo: {
      level: "Moderado",
      duration: "Día completo (8-10 horas)",
      recommendedPeople: "2-8 personas",
      localTips: []
    }
  },
  {
    id: "montes-ganaderia",
    title: "Montes y Ganadería Tradicional",
    description: "Ganadería extensiva y productos lácteos de montaña",
    duration: "1 día",
    businesses: 4,
    rating: "La vida en armonía con la naturaleza",
    participants: 28,
    image: cheeseWheel,
    difficulty: "Moderado",
    narrative: "Descubre la ganadería tradicional de montaña...",
    stops: [],
    dailyRecommendations: [],
    practicalInfo: {
      level: "Moderado",
      duration: "Día completo (10-12 horas)",
      recommendedPeople: "3-6 personas",
      localTips: []
    }
  }
];

const Rutas = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-1">
        <div className="container mx-auto px-6 py-1">
          <div className="text-center mb-3">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3 flex items-center justify-center">
              <span>Rutas </span>
              <img 
                src="/lovable-uploads/clean-enso-symbol.png" 
                alt="Ensō"
                className="w-8 h-8 md:w-10 md:h-10 object-contain mx-1"
              />
              <span>RIGEN</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Marca y comparte rutas visitando negocios locales. Sube valoraciones y reseñas de cada lugar que descubras en tu camino.
            </p>
          </div>
        </div>
        <RoutesExplorer showTitle={false} showCTA={false} customRoutes={extendedRoutesData} />
        
        {/* Ver más button */}
        <div className="container mx-auto px-6 pb-8 text-center">
          <Button 
            variant="default" 
            size="lg" 
            className="bg-[hsl(var(--primary))] text-primary-foreground hover:brightness-110 shadow-lg"
          >
            Ver más
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Rutas;