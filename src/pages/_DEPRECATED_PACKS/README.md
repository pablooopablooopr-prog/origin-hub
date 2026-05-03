# Packs System (Deprecated)

> **Estado:** Código preservado por compatibilidad con la base de datos.
> **Versión:** Removido del UI público en v2.0 (FASE 3 del rediseño 2026-04-24).
> **Reemplazado por:** sistema de Rutas estacionales (`/rutas` filtrado por `season`).

---

## ¿Por qué existe esta carpeta?

El sistema de packs era extenso (17+ archivos, 4 tipos de pack, tablas
dedicadas en Supabase, hooks de analytics/favoritos/reviews, datos de
fallback con +40 packs). Eliminarlo por completo implicaría:

- Romper imports cruzados de hooks que también usan otros componentes
- Borrar packs ya creados por empresas reales (datos en BD)
- Perder la posibilidad de reactivarlo si el negocio lo requiere

**Decisión:** preservar todos los archivos, quitar enlaces y rutas
públicas, y documentar aquí cómo reactivar.

---

## Archivos del sistema (ubicación actual)

Los archivos NO han sido movidos físicamente para no romper sus imports
internos. Siguen en `src/pages/`, `src/components/`, etc. Esta carpeta
sólo existe como marker + documentación.

| Tipo | Archivos |
|---|---|
| Pages | `src/pages/Packs.tsx`, `PacksBuscar.tsx`, `PackDetail.tsx`, `PackBuilder.tsx`, `EditarPack.tsx` |
| Components | `src/components/PackTypeCards.tsx`, `PackSearchFilters.tsx`, `PackPracticalInfo.tsx`, `PackPreview.tsx`, `PackRouteMap.tsx`, `PackBuilderSidebar.tsx`, `RegionalPacks.tsx` |
| Data | `src/data/companyPacks.ts`, `src/data/packs.ts` |
| Hooks | `src/hooks/usePackAnalytics.ts`, `usePackFavorites.ts`, `usePackReviews.ts` |
| BD | Tablas `company_packs`, `pack_templates`, `pack_elements`, `pack_products`, `pack_analytics` (intactas) |

---

## Cómo reactivar el sistema de packs

1. **App.tsx** — descomentar imports y rutas:
   ```ts
   const Packs = lazy(() => import("./pages/Packs"));
   const PacksBuscar = lazy(() => import("./pages/PacksBuscar"));
   const PackDetail = lazy(() => import("./pages/PackDetail"));
   const EditarPack = lazy(() => import("./pages/EditarPack"));
   const PackBuilder = lazy(() => import("./pages/PackBuilder"));

   <Route path="/packs" element={<Packs />} />
   <Route path="/packs/buscar" element={<PacksBuscar />} />
   <Route path="/packs/:id" element={<PackDetail />} />
   <Route path="/editar-pack" element={<EditarPack />} />
   <Route path="/editar-pack/:packId" element={<EditarPack />} />
   <Route path="/pack-builder" element={<PackBuilder />} />
   <Route path="/pack-builder/:packId" element={<PackBuilder />} />
   ```

2. **Header.tsx** — restaurar enlaces "Selecciones" en nav desktop y mobile:
   ```tsx
   <Link to="/packs" className="...">Selecciones</Link>
   ```

3. **CompanyDashboard.tsx** — restaurar pestaña "Mis Packs" (si fue removida en FASE 4).

4. **Index.tsx** — opcional: restaurar la sección "Selecciones del territorio"
   con `<PackTypeCards />` antes del `<RoutesExplorer />`.

5. Verificar que las tablas de Supabase siguen intactas (no han sido alteradas).

---

## Razones de negocio

ORIGEN pivota a un modelo estacional B2B+B2C:
- 4 temporadas de 3 meses (queso, miel, caza, vino)
- Productos protagonistas según temporada
- Empresas suscritas con plan Básico/Standard/Destacado
- Consumidores con suscripción trimestral/anual

Los packs (combos curados de productos para envío) no encajan en el
nuevo modelo de "rutas + spotlight + B2B". Se mantienen por si en el
futuro se reintroducen como producto secundario.
