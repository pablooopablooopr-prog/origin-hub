import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, GripVertical } from "lucide-react";

interface ParrafosEditorProps {
  parrafos: string[];
  onChange: (parrafos: string[]) => void;
}

export const ParrafosEditor = ({ parrafos, onChange }: ParrafosEditorProps) => {
  const addParrafo = () => {
    onChange([...parrafos, ""]);
  };

  const removeParrafo = (index: number) => {
    onChange(parrafos.filter((_, i) => i !== index));
  };

  const updateParrafo = (index: number, value: string) => {
    const newParrafos = [...parrafos];
    newParrafos[index] = value;
    onChange(newParrafos);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-foreground">
          Párrafos (usa ## para subtítulos)
        </label>
        <Button
          type="button"
          onClick={addParrafo}
          size="sm"
          variant="outline"
          className="gap-1"
        >
          <Plus className="w-4 h-4" /> Añadir
        </Button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {parrafos.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">
            Añade párrafos haciendo clic en "Añadir"
          </p>
        ) : (
          parrafos.map((parrafo, index) => (
            <div key={index} className="flex gap-2 items-start">
              <div className="flex-shrink-0 pt-2 cursor-grab active:cursor-grabbing">
                <GripVertical className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <Textarea
                  value={parrafo}
                  onChange={(e) => updateParrafo(index, e.target.value)}
                  placeholder={
                    index === 0
                      ? "Primer párrafo o ## Subtítulo"
                      : "Continúa con más párrafos..."
                  }
                  className="min-h-20 text-sm"
                />
                {parrafo.startsWith("## ") && (
                  <p className="text-xs text-primary mt-1">
                    → Se renderiza como subtítulo
                  </p>
                )}
              </div>
              <Button
                type="button"
                onClick={() => removeParrafo(index)}
                size="sm"
                variant="ghost"
                className="text-destructive hover:bg-destructive/10 mt-1"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        💡 Empieza una línea con ## para crear un subtítulo (ej: "## Mi subtítulo")
      </p>
    </div>
  );
};
