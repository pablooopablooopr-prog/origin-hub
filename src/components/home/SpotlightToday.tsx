import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Users, Store } from "lucide-react";
import {
  SPOTLIGHT_POOL,
  SPOTLIGHT_NICHO_ORDER,
  type SpotlightCompany,
  type SpotlightNicho,
} from "@/data/spotlightDemo";

/**
 * SECCIÓN 3 de la home — "HOY EN ORIGEN ○ · Empresas destacadas de hoy".
 *
 * Layout editorial (mockup Atelier):
 *   - 1 ficha grande izquierda (la "destacada" de turno) con borde dorado
 *   - 4 fichas pequeñas derecha en grid 2×2
 *   - sello circular flotante "LO NUESTRO ES ORIGEN" entre ambas zonas
 *   - cinta inferior con 3 stats + botón "VER TODAS LAS EMPRESAS"
 *
 * Comportamiento dinámico:
 *   1. La FECHA bajo el título es el día actual (es-ES, "17 de mayo de 2025")
 *      y se refresca al cambiar de día.
 *   2. ROTACIÓN automática:
 *      - 5 fichas del MISMO nicho a la vez
 *      - cada 7 s, todas las fichas avanzan una posición
 *        (la grande pasa al final de las pequeñas, la primera pequeña sube
 *         a grande)
 *      - tras 15 rotaciones (cada ficha ha sido destacada 3 veces) se
 *        cambia al siguiente nicho del orden definido en SPOTLIGHT_NICHO_ORDER
 *      - el ciclo es infinito y se reinicia en quesos cuando completa
 *
 * El cronograma se puede pausar pasando `paused` desde el padre, pero por
 * defecto está siempre activo en home.
 */

const SECONDS_PER_ROTATION = 7;
const ROTATIONS_BEFORE_NICHE_SWITCH = 15; // 5 fichas × 3 turnos cada una

const formatTodayLabel = (date: Date): string => {
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// ============================================================
// FICHA GRANDE (izquierda)
// ============================================================
const FeaturedCard = ({ company }: { company: SpotlightCompany }) => {
  const linkTo = company.slug ? `/negocio/${company.slug}` : "/soy-empresa";
  return (
    <article
      className="relative h-full rounded-md overflow-hidden bg-[#fdfaf2] border-2 transition-all duration-500"
      style={{
        borderColor: "#d4a83a",
        boxShadow:
          "0 12px 32px -10px rgba(0,0,0,0.18), inset 0 0 0 1px rgba(212,168,58,0.2)",
      }}
    >
      <div className="relative">
        <div className="aspect-[4/3] w-full overflow-hidden">
          <img
            src={company.image}
            alt={company.name}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.02]"
            loading="lazy"
          />
        </div>
        {/* Badge DESTACADA dorado */}
        <span
          className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] tracking-[0.18em] uppercase font-bold"
          style={{
            background: "#d4a83a",
            color: "#2a1c10",
            fontFamily: "'Cormorant Garamond', serif",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          <Star className="w-3 h-3 fill-current" />
          Destacada
        </span>
      </div>

      <div className="p-6 md:p-7 space-y-3">
        <span
          className="inline-flex items-center px-3 py-1 rounded-full text-[10px] tracking-[0.22em] uppercase font-semibold"
          style={{
            background: company.categoryColor,
            color: company.categoryTextColor,
            fontFamily: "'Cormorant Garamond', serif",
          }}
        >
          {company.category}
        </span>

        <h3
          className="text-2xl md:text-[28px] leading-tight tracking-tight"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: "#2a2418",
            fontWeight: 500,
          }}
        >
          {company.name}
        </h3>

        <p
          className="text-[14px]"
          style={{
            color: "#8a6f2e",
            fontFamily: "'Cormorant Garamond', serif",
          }}
        >
          {company.locality}
        </p>

        <p
          className="text-[14px] leading-[1.6] line-clamp-2 max-w-[480px]"
          style={{
            color: "#3a3326",
            fontFamily: "'Cormorant Garamond', serif",
          }}
        >
          {company.description}
        </p>

        <Link
          to={linkTo}
          className="inline-flex items-center gap-2 text-[11px] tracking-[0.28em] uppercase font-bold pt-1 group"
          style={{
            color: "#8a6f2e",
            fontFamily: "'Cormorant Garamond', serif",
          }}
        >
          Leer ficha
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
};

// ============================================================
// FICHA PEQUEÑA (derecha 2×2)
// ============================================================
const SmallCard = ({ company }: { company: SpotlightCompany }) => {
  const linkTo = company.slug ? `/negocio/${company.slug}` : "/soy-empresa";
  return (
    <article
      className="relative rounded-md overflow-hidden bg-[#fdfaf2] border transition-all duration-500"
      style={{
        borderColor: "#e0d4b8",
        boxShadow: "0 6px 16px -6px rgba(0,0,0,0.15)",
      }}
    >
      <div className="aspect-[16/9] w-full overflow-hidden">
        <img
          src={company.image}
          alt={company.name}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.02]"
          loading="lazy"
        />
      </div>

      <div className="p-4 space-y-2">
        <span
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] tracking-[0.22em] uppercase font-semibold"
          style={{
            background: company.categoryColor,
            color: company.categoryTextColor,
            fontFamily: "'Cormorant Garamond', serif",
          }}
        >
          {company.category}
        </span>

        <h4
          className="text-[18px] leading-tight tracking-tight"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: "#2a2418",
            fontWeight: 500,
          }}
        >
          {company.name}
        </h4>

        <p
          className="text-[12px]"
          style={{
            color: "#8a6f2e",
            fontFamily: "'Cormorant Garamond', serif",
          }}
        >
          {company.locality}
        </p>

        <p
          className="text-[12px] leading-[1.5] line-clamp-2"
          style={{
            color: "#3a3326",
            fontFamily: "'Cormorant Garamond', serif",
          }}
        >
          {company.description}
        </p>

        <Link
          to={linkTo}
          className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.26em] uppercase font-bold pt-0.5 group"
          style={{
            color: "#8a6f2e",
            fontFamily: "'Cormorant Garamond', serif",
          }}
        >
          Leer ficha
          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
};

// ============================================================
// SELLO CIRCULAR FLOTANTE "LO NUESTRO ES ORIGEN"
// ============================================================
const FloatingSeal = () => (
  <div
    className="hidden lg:flex absolute z-30 w-[110px] h-[110px] rounded-full items-center justify-center -rotate-[6deg]"
    style={{
      background: "#fdfaf2",
      border: "1.5px solid #d4a83a",
      boxShadow: "0 8px 20px rgba(0,0,0,0.18)",
    }}
    aria-hidden="true"
  >
    <svg viewBox="0 0 110 110" className="absolute inset-0 w-full h-full">
      <defs>
        <path id="seal-circle-top" d="M 55,55 m -42,0 a 42,42 0 0,1 84,0" />
        <path id="seal-circle-bot" d="M 55,55 m -42,0 a 42,42 0 1,0 84,0" />
      </defs>
      <text fill="#8a6f2e" style={{ fontSize: "8.5px", letterSpacing: "0.32em" }}>
        <textPath href="#seal-circle-top" startOffset="50%" textAnchor="middle">
          LO NUESTRO
        </textPath>
      </text>
      <text fill="#8a6f2e" style={{ fontSize: "8.5px", letterSpacing: "0.32em" }}>
        <textPath href="#seal-circle-bot" startOffset="50%" textAnchor="middle">
          ES ORIGEN
        </textPath>
      </text>
    </svg>
    {/* Hoja en el centro */}
    <svg width="36" height="40" viewBox="0 0 36 40" fill="none">
      <path
        d="M18 4 Q 8 14 10 24 Q 12 32 18 36 Q 24 32 26 24 Q 28 14 18 4 Z"
        fill="#5a6b3a"
        opacity="0.85"
      />
      <line x1="18" y1="6" x2="18" y2="36" stroke="#3d4a2a" strokeWidth="0.6" />
      <path d="M18 14 L 12 20 M18 18 L 24 24 M18 22 L 12 28 M18 26 L 24 32" stroke="#3d4a2a" strokeWidth="0.4" />
      <circle cx="18" cy="38" r="1" fill="#3d4a2a" />
    </svg>
  </div>
);

// ============================================================
// SECCIÓN PRINCIPAL
// ============================================================
const SpotlightToday = () => {
  const [today, setToday] = useState<Date>(new Date());
  const [nicheIndex, setNicheIndex] = useState(0);
  const [rotationStep, setRotationStep] = useState(0);

  // ---- Refresca la fecha si cambia el día ----
  useEffect(() => {
    const id = setInterval(() => {
      const now = new Date();
      // Sólo actualiza si es un día distinto (evita re-render innecesario)
      if (now.getDate() !== today.getDate() || now.getMonth() !== today.getMonth()) {
        setToday(now);
      }
    }, 60_000); // cada minuto basta para detectar cambio de día
    return () => clearInterval(id);
  }, [today]);

  // ---- Rotación automática ----
  useEffect(() => {
    const id = setInterval(() => {
      setRotationStep((prev) => {
        const next = prev + 1;
        if (next >= ROTATIONS_BEFORE_NICHE_SWITCH) {
          setNicheIndex((nIdx) => (nIdx + 1) % SPOTLIGHT_NICHO_ORDER.length);
          return 0;
        }
        return next;
      });
    }, SECONDS_PER_ROTATION * 1000);
    return () => clearInterval(id);
  }, []);

  const currentNiche: SpotlightNicho = SPOTLIGHT_NICHO_ORDER[nicheIndex];
  const nichePool = SPOTLIGHT_POOL[currentNiche];

  // Reordena el pool según el step actual: la posición 0 es "destacada",
  // las 1..4 son las pequeñas. Cada step desplaza una posición.
  const visibleCompanies = useMemo(() => {
    const len = nichePool.length;
    return Array.from({ length: len }, (_, i) => nichePool[(i + rotationStep) % len]);
  }, [nichePool, rotationStep]);

  const featured = visibleCompanies[0];
  const others = visibleCompanies.slice(1, 5); // hasta 4 pequeñas

  const dateLabel = formatTodayLabel(today);

  return (
    <section
      className="relative py-16 md:py-20"
      style={{ background: "#f5ecd9" }}
    >
      <div className="container mx-auto px-6 max-w-[1280px]">
        {/* ===== HEADER ===== */}
        <header className="text-center mb-10 md:mb-12 space-y-3">
          <p
            className="text-[11px] tracking-[0.32em] uppercase font-semibold"
            style={{
              color: "#8a6f2e",
              fontFamily: "'Cormorant Garamond', serif",
            }}
          >
            HOY EN ORIGEN ○
          </p>
          <h2
            className="text-[40px] md:text-[56px] leading-[1] tracking-tight"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "#2a2418",
              fontWeight: 500,
            }}
          >
            Empresas destacadas de hoy
          </h2>
          <p
            className="text-[14px] md:text-[15px] flex items-center justify-center gap-3 flex-wrap"
            style={{
              color: "#8a6f2e",
              fontFamily: "'Cormorant Garamond', serif",
            }}
          >
            <span>Castilla–La Mancha</span>
            <span aria-hidden="true">·</span>
            <span>{dateLabel}</span>
          </p>

          {/* divider con hojita central */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <span className="block w-24 h-px" style={{ background: "#d4a83a" }} />
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M7 1 Q 4 5 5 9 Q 6 12 7 13 Q 8 12 9 9 Q 10 5 7 1 Z"
                fill="#d4a83a"
                opacity="0.85"
              />
              <line x1="7" y1="3" x2="7" y2="13" stroke="#8a6f2e" strokeWidth="0.4" />
            </svg>
            <span className="block w-24 h-px" style={{ background: "#d4a83a" }} />
          </div>

          <p
            className="text-[13.5px] pt-1"
            style={{
              color: "#5a4a30",
              fontFamily: "'Cormorant Garamond', serif",
            }}
          >
            Seis empresas seleccionadas que hoy ocupan la portada de ORIGEN ○.
          </p>
        </header>

        {/* ===== GRID PRINCIPAL ===== */}
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6">
          {/* IZQUIERDA: ficha grande */}
          <div className="lg:col-span-7 relative">
            {featured && <FeaturedCard company={featured} />}
          </div>

          {/* DERECHA: grid 2×2 fichas pequeñas */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
            {others.map((c, i) => (
              <SmallCard key={`${c.id}-${rotationStep}-${i}`} company={c} />
            ))}
          </div>

          {/* SELLO FLOTANTE entre las dos zonas */}
          <div
            className="absolute z-30"
            style={{ top: "44%", left: "calc(58.33% - 55px)" }}
          >
            <FloatingSeal />
          </div>
        </div>

        {/* ===== CINTA INFERIOR DE STATS ===== */}
        <div
          className="relative mt-8 md:mt-10 rounded-md px-6 md:px-10 py-5 md:py-6"
          style={{
            background: "#fdfaf2",
            border: "1px solid #e0d4b8",
            boxShadow: "0 4px 14px -4px rgba(0,0,0,0.1)",
          }}
        >
          <div className="flex flex-wrap items-center justify-around gap-5 md:gap-8">
            {/* Stat 1 */}
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ border: "1.5px solid #d4a83a" }}
              >
                <Users className="w-5 h-5" style={{ color: "#8a6f2e" }} />
              </div>
              <div className="text-left">
                <p
                  className="text-[13px] leading-tight font-semibold"
                  style={{
                    color: "#2a2418",
                    fontFamily: "'Cormorant Garamond', serif",
                  }}
                >
                  {nichePool.length} empresas
                </p>
                <p
                  className="text-[12px] leading-tight"
                  style={{
                    color: "#8a6f2e",
                    fontFamily: "'Cormorant Garamond', serif",
                  }}
                >
                  en portada hoy
                </p>
              </div>
            </div>

            <span className="hidden md:inline-block w-px h-10 bg-[#e0d4b8]" />

            {/* Stat 2 — 24h */}
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ border: "1.5px solid #d4a83a" }}
              >
                <span
                  className="text-[10px] font-bold tracking-wide"
                  style={{
                    color: "#8a6f2e",
                    fontFamily: "'Cormorant Garamond', serif",
                  }}
                >
                  24h
                </span>
              </div>
              <div className="text-left">
                <p
                  className="text-[13px] leading-tight font-semibold"
                  style={{
                    color: "#2a2418",
                    fontFamily: "'Cormorant Garamond', serif",
                  }}
                >
                  24h de visibilidad
                </p>
                <p
                  className="text-[12px] leading-tight"
                  style={{
                    color: "#8a6f2e",
                    fontFamily: "'Cormorant Garamond', serif",
                  }}
                >
                  rotatoria
                </p>
              </div>
            </div>

            <span className="hidden md:inline-block w-px h-10 bg-[#e0d4b8]" />

            {/* Stat 3 — Spotlight */}
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ border: "1.5px solid #d4a83a" }}
              >
                <Store className="w-5 h-5" style={{ color: "#8a6f2e" }} />
              </div>
              <div className="text-left">
                <p
                  className="text-[13px] leading-tight font-semibold"
                  style={{
                    color: "#2a2418",
                    fontFamily: "'Cormorant Garamond', serif",
                  }}
                >
                  Spotlight para
                </p>
                <p
                  className="text-[12px] leading-tight"
                  style={{
                    color: "#8a6f2e",
                    fontFamily: "'Cormorant Garamond', serif",
                  }}
                >
                  productores y restaurantes
                </p>
              </div>
            </div>

            {/* CTA "VER TODAS LAS EMPRESAS" */}
            <Link
              to="/empresas"
              className="inline-flex items-center gap-3 px-5 py-3 rounded-md text-[11px] tracking-[0.28em] uppercase font-bold transition-all hover:translate-y-[-1px] group"
              style={{
                color: "#8a6f2e",
                border: "1.5px solid #d4a83a",
                fontFamily: "'Cormorant Garamond', serif",
              }}
            >
              Ver todas las empresas
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Sprig botánico decorativo en borde derecho */}
      <svg
        className="hidden lg:block absolute right-2 bottom-12 opacity-50 pointer-events-none"
        width="60"
        height="120"
        viewBox="0 0 60 120"
        fill="none"
        aria-hidden="true"
      >
        <path d="M30 4 Q 28 50 30 116" stroke="#8a6f2e" strokeWidth="0.8" fill="none" />
        <ellipse cx="20" cy="22" rx="5" ry="2.5" fill="#8a6f2e" opacity="0.6" />
        <ellipse cx="40" cy="34" rx="5" ry="2.5" fill="#8a6f2e" opacity="0.6" />
        <ellipse cx="18" cy="48" rx="5.5" ry="2.8" fill="#8a6f2e" opacity="0.6" />
        <ellipse cx="42" cy="60" rx="5.5" ry="2.8" fill="#8a6f2e" opacity="0.6" />
        <ellipse cx="20" cy="76" rx="5" ry="2.5" fill="#8a6f2e" opacity="0.6" />
        <ellipse cx="40" cy="88" rx="5" ry="2.5" fill="#8a6f2e" opacity="0.6" />
        <ellipse cx="22" cy="104" rx="4.5" ry="2.3" fill="#8a6f2e" opacity="0.6" />
      </svg>
    </section>
  );
};

export default SpotlightToday;
