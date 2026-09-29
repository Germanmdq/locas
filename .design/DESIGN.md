# DESIGN

## Estructura
- Sidebar global 240–248px.
- Topbar 60–64px.
- Page header compacto: título + subtítulo + acciones.
- Contenido por prioridad: alertas/KPIs -> filtros -> lista/tabla -> detalle/acciones.

## Patrones
- `shadcn-dashboard-shell`: AdminShell para todos los módulos operativos.
- `customer-list-detail`: CRM lista + panel 360 resumido.
- `faceted-filter-table`: búsqueda y filtros como controles, no como decoración.

## Desktop
- contenido máximo utilizable sin hero.
- tablas 44–52px por fila.
- detail panel CRM 340–400px.
- cards con radius 8–10px y sombra mínima.

## Mobile
- sidebar drawer.
- CRM detalle debajo/lista primero.
- cards 1–2 columnas.
- sin overflow horizontal de toolbars/filtros.

## Estados
- empty/error/loading visibles por módulo.
- selected/active claramente identificados.
