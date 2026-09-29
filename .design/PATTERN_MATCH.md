# PATTERN_MATCH

- Producto: CRM / customer operations + SaaS operational dashboard.
- Objeto principal: contacto, conversación, viaje, reserva, pago, tarea.
- Recetas: `crm-customer-ops.md` + `saas-dashboard.md`.
- Patrones seleccionados:
  1. `app-shell/shadcn-dashboard-shell` — shell estable, navegación, header y densidad operativa.
  2. `crm/customer-list-detail` — lista + detalle + siguiente acción.
  3. `data-table/faceted-filter-table` — búsqueda/filtros/tablas densas sin estética de landing.
- No se seleccionan patrones de landing, glassmorphism ni hero marketing.
- Adaptación: conservar Next/Supabase y rutas existentes; unificar el lenguaje visual y mantener acciones operativas.
