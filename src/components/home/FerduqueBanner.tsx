import { useNavigate } from "react-router-dom";

/**
 * Banner FERDUQUE — persistente en TODAS las páginas.
 * Sin logo RITMORIGEN, sin botón de cierre.
 * Lleva al formulario en /ferduque.
 */
const FerduqueBanner = () => {
  const navigate = useNavigate();

  return (
    <div
      className="w-full sticky top-0 z-[60]"
      style={{
        background: "linear-gradient(90deg, #2A3D14 0%, #3a5a1a 60%, #4F5D2A 100%)",
      }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-2.5 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-5 text-center">
        <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.92)" }}>
          ¿Vienes de la Feria FERDUQUE?{" "}
          <span style={{ color: "#BFD96A", fontWeight: 700 }}>
            Únete GRATIS como empresa fundadora.
          </span>
        </p>
        <button
          onClick={() => navigate("/ferduque")}
          className="shrink-0 rounded-full px-4 py-1.5 text-xs font-bold transition-all hover:scale-105 active:scale-95"
          style={{
            backgroundColor: "#BFD96A",
            color: "#1B3A0A",
            boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
            whiteSpace: "nowrap",
          }}
        >
          Ver formulario →
        </button>
      </div>
    </div>
  );
};

export default FerduqueBanner;
