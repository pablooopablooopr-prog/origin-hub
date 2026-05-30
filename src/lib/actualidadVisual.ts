export const actualidadColors = {
  olive: "#5C6B2E",
  cream: "#F5F0E8",
  paper: "#F3EADB",
  card: "#FFFAF1",
  beige: "#C8B89A",
  brown: "#3D2B1F",
  brownSoft: "#6F4E37",
  gold: "#B8860B",
  inkMuted: "#7B6A55",
};

export const actualidadArticleImages: Record<string, string> = {
  "efecto-mercosur-futuro-campo-espanol":
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=88",
  "pesticidas-glifosato-rastro-invisible-tu-cuerpo":
    "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=88",
  "del-campo-al-supermercado-pagas-mas-agricultor-cobra-menos":
    "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=88",
};

export const fallbackArticleImage =
  "https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?auto=format&fit=crop&w=1200&q=88";

export const getActualidadArticleImage = (slug: string) =>
  actualidadArticleImages[slug] ?? fallbackArticleImage;

export const formatActualidadDate = (date: string) =>
  date.replace(" de ", " ").replace(" de ", " ");

