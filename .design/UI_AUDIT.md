# UI_AUDIT

## Usuario y tarea
Equipo administrativo/comercial que trabaja varias horas por día. Necesita detectar pendientes, abrir registros, responder, actualizar y volver a la cola sin perder contexto.

## Problemas encontrados
- CRM usaba shell visual distinto y estructura de landing.
- títulos/headers con contraste inconsistente.
- radios y espacios demasiado grandes para una herramienta operativa.
- filtros/controles podían producir overflow horizontal.
- navegación y densidad variaban entre módulos.
- fecha y badges con apariencia de demo/hardcode.
- Configuración demasiado vacía para una suite operativa.

## Riesgos móviles
- tablas anchas, toolbars y filtros.
- panel detalle CRM fijo junto a lista.
- sidebar debe colapsar sin perder acción principal.

## Criterio
No horizontal scroll fuera de contenedores de tabla controlados. Títulos 20–24px. Cards 6–10px radius. Spacing 8/12/16/24. Acciones primarias únicas y visibles.
