import { Clock, BookOpen, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface SeccionArticulo {
  titulo: string;
  tipo: "lista" | "lista-numerada" | "texto";
  contenido?: string;
  items: string[];
  nota?: string;
}

interface ArticuloPreviewProps {
  titulo: string;
  extracto: string;
  categoria: string;
  categoriaColor: string;
  fechaPublicacion: string;
  tiempoLectura: number;
  autor: string;
  parrafos: string[];
  secciones?: SeccionArticulo[];
  parrafosCierre?: string[];
  referencias?: string[];
}

export const ArticuloPreview = ({
  titulo,
  extracto,
  categoria,
  categoriaColor,
  fechaPublicacion,
  tiempoLectura,
  autor,
  parrafos,
  secciones,
  parrafosCierre,
  referencias,
}: ArticuloPreviewProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background border-l border-border">
      {/* Cabecera del artículo */}
      <section className="bg-gradient-to-br from-primary to-earth-medium text-white pt-8 pb-10">
        <div className="px-6 max-w-2xl">
          <div className="mb-4">
            <Badge className={`${categoriaColor} border-0 font-medium text-xs uppercase tracking-wide`}>
              {categoria}
            </Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight mb-4">
            {titulo || "Título del artículo"}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-white/75">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {tiempoLectura} min de lectura
            </span>
            <Separator orientation="vertical" className="h-3 bg-white/30" />
            <span>{fechaPublicacion || "dd de mes de yyyy"}</span>
            <Separator orientation="vertical" className="h-3 bg-white/30" />
            <span className="font-medium text-white">{autor}</span>
          </div>
        </div>
      </section>

      {/* Extracto destacado */}
      <div className="bg-muted/40 border-b border-border">
        <div className="px-6 py-5 max-w-2xl">
          <p className="text-base text-foreground font-medium leading-relaxed italic border-l-4 border-primary pl-4">
            {extracto || "Extracto del artículo..."}
          </p>
        </div>
      </div>

      {/* Cuerpo del artículo */}
      <main className="flex-1 px-6 py-8 max-w-2xl">
        <article>
          {/* Párrafos principales */}
          {parrafos.length > 0 ? (
            <div>
              {parrafos.map((parrafo, i) =>
                parrafo.startsWith("## ") ? (
                  <h2
                    key={i}
                    className="text-xl md:text-2xl font-bold text-foreground mt-8 mb-4 tracking-tight"
                  >
                    {parrafo.slice(3)}
                  </h2>
                ) : (
                  <p
                    key={i}
                    className="text-foreground/90 leading-[1.85] text-base mb-4 text-justify hyphens-auto"
                  >
                    {parrafo}
                  </p>
                )
              )}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm italic">
              Los párrafos aparecerán aquí...
            </p>
          )}

          {/* Secciones con listas */}
          {secciones && secciones.length > 0 && (
            <div className="mt-8 space-y-6">
              {secciones.map((seccion, i) => (
                <div key={i} className="bg-muted/30 rounded-lg border border-border p-5">
                  <h3 className="text-lg font-bold text-primary mb-3">
                    {seccion.titulo}
                  </h3>
                  {seccion.contenido && (
                    <p className="text-foreground/80 text-sm leading-relaxed mb-4">
                      {seccion.contenido}
                    </p>
                  )}
                  {seccion.tipo === "lista-numerada" ? (
                    <ol className="space-y-2 list-none">
                      {seccion.items.map((item, j) => (
                        <li key={j} className="flex gap-3 text-sm">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                            {j + 1}
                          </span>
                          <span className="text-foreground/85">{item}</span>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <ul className="space-y-2 list-none">
                      {seccion.items.map((item, j) => (
                        <li key={j} className="flex gap-3 text-sm">
                          <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                          <span className="text-foreground/85">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {seccion.nota && (
                    <p className="mt-3 text-xs text-muted-foreground italic border-t border-border pt-3">
                      {seccion.nota}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Párrafos de cierre */}
          {parrafosCierre && parrafosCierre.length > 0 && (
            <div className="mt-8 space-y-4">
              {parrafosCierre.map((parrafo, i) => (
                <p
                  key={i}
                  className="text-foreground/90 leading-[1.85] text-base text-justify hyphens-auto"
                >
                  {parrafo}
                </p>
              ))}
            </div>
          )}
        </article>

        {/* Referencias */}
        {referencias && referencias.length > 0 && (
          <div className="mt-10">
            <Separator className="mb-6" />
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Referencias bibliográficas
              </h2>
            </div>
            <ul className="space-y-2">
              {referencias.map((ref, i) => (
                <li
                  key={i}
                  className="text-xs text-muted-foreground leading-relaxed pl-3 border-l-2 border-muted"
                >
                  {ref}
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
};
