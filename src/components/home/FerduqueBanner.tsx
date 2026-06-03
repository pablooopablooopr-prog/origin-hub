import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { Logo } from "@/components/Logo";

/**
 * Banner FERDUQUE — se muestra en la home encima de todo.
 * El usuario puede cerrarlo. Se guarda en sessionStorage para no
 * volver a mostrarlo si navega entre páginas en la misma visita.
 */

const SESSION_KEY = "ferduque_banner_dismissed";

const FerduqueBanner = () => {
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === "1"
  );
  const navigate = useNavigate();

  if (dismissed) return null;

  const dismiss = () => {
    sessionStorage.setItem(SESSION_KEY, "1");
    setDismissed(true);
  };

  return (
    <div
      className="w-full relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #2A3D14 0%, #3a5a1a 50%, #4F5D2A 100%)",
      }}
    >
      {/* Textura sutil */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "url('/textures/dark-wood.jpg')",
          backgroundSize: "cover",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 py-5 md:py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Logos */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            {/* RitmOrigen logo en blanco */}
            <div style={{ filter: "brightness(0) invert(1)", opacity: 0.95 }}>
              <Logo size={20} showText={true} />
            </div>

            <span
              className="hidden sm:block h-8 w-px"
              style={{ backgroundColor: "rgba(255,255,255,0.25)" }}
              aria-hidden="true"
            />

            {/* Logo FERDUQUE */}
            <img
              src="/lovable-uploads/ferduque-logo.jpg"
              alt="FERDUQUE Porzuna 2026"
              style={{
                height: "44px",
                width: "auto",
                objectFit: "contain",
                filter: "brightness(0) invert(1)",
                opacity: 0.95,
              }}
            />
          </div>

          {/* Texto + CTA */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 text-center sm:text-left">
            <p
              className="text-sm md:text-base font-medium leading-snug"
              style={{ color: "rgba(255,255,255,0.92)" }}
            >
              ¿Vienes de la Feria FERDUQUE?{" "}
              <span style={{ color: "#BFD96A", fontWeight: 700 }}>
                Únete gratis como empresa fundadora.
              </span>
            </p>

            <button
              onClick={() => navigate("/ferduque")}
              className="shrink-0 rounded-full px-5 py-2 text-sm font-bold transition-all hover:scale-105 active:scale-95"
              style={{
                backgroundColor: "#BFD96A",
                color: "#1B3A0A",
                boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
                whiteSpace: "nowrap",
              }}
            >
              Ver formulario →
            </button>
          </div>

          {/* Cerrar */}
          <button
            onClick={dismiss}
            aria-label="Cerrar banner FERDUQUE"
            className="absolute top-3 right-3 md:relative md:top-auto md:right-auto rounded-full p-1.5 transition-colors"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FerduqueBanner;
