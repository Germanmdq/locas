# Locas por la Aventura — CRM Maestro

## Objetivo
Convertir Locas por la Aventura en un sistema comercial y operativo capaz de identificar de dónde viene cada persona, qué le interesa, qué acciones realiza, en qué etapa comercial está, cuánto vale la oportunidad, qué debe hacer el equipo después y qué resultado económico genera cada canal, campaña y viaje.

El CRM no debe ser una agenda de contactos. Debe funcionar como el centro de inteligencia comercial, atribución, seguimiento, reservas, pagos, documentación, comunidad, postventa y recompra.

---

# 1. Estado actual ya creado

## Backend Supabase
Proyecto conectado a Supabase/Postgres.

Tablas creadas:
- `contacts`
- `lead_sources`
- `campaigns`
- `crm_users`
- `tags`
- `contact_tags`
- `trips`
- `departures`
- `opportunities`
- `interactions`
- `web_events`
- `tasks`
- `reservations`
- `payments`
- `contact_documents`
- `consents`
- `automation_events`

También existen vistas agregadas para:
- ficha 360° del contacto;
- rendimiento por canal/origen.

## Frontend conectado
La ruta `/crm` ya lee datos desde Supabase.

Ruta actual:
`https://locas-seven.vercel.app/crm`

## Datos de demo cargados
Ya existen ejemplos con:
- Instagram
- Facebook
- WhatsApp
- Google
- Web orgánica
- Referidos
- campañas
- contactos
- responsables
- oportunidades
- reservas
- pagos
- tareas
- interacciones

---

# 2. Qué datos necesitamos capturar

## 2.1 Identidad del contacto
Por cada persona:
- nombre
- apellido
- email
- teléfono
- WhatsApp
- país
- provincia/estado
- ciudad
- idioma
- zona horaria
- fecha de nacimiento
- edad
- Instagram
- Facebook
- canal preferido de contacto
- responsable comercial
- fecha de alta
- fecha de último contacto
- fecha de última actividad
- estado del contacto
- notas internas

## 2.2 Consentimientos
- acepta email marketing
- acepta WhatsApp
- acepta SMS si se usa
- acepta términos
- acepta política de privacidad
- fecha/hora del consentimiento
- origen del consentimiento
- versión del formulario/política

## 2.3 Origen y atribución
Necesitamos guardar tres niveles:

### First touch
De dónde llegó por primera vez.

### Lead creation touch
Qué canal/campaña creó efectivamente el lead.

### Conversion touch
Qué canal/campaña intervino antes de reservar o pagar.

Datos:
- source
- medium
- campaign
- content
- term
- referrer
- landing page
- current URL
- UTM source
- UTM medium
- UTM campaign
- UTM content
- UTM term
- Meta click id
- Google click id
- sesión
- dispositivo
- navegador
- campaña
- anuncio
- creatividad
- reel/post/story cuando pueda identificarse
- formulario origen

## 2.4 Intereses
- destinos vistos
- destinos guardados
- destinos favoritos
- blogs leídos
- viajes comparados
- fecha preferida
- mes preferido
- duración preferida
- presupuesto estimado
- moneda
- destino nacional/internacional
- intereses: nieve, playa, montaña, gastronomía, cultura, aventura, shopping, naturaleza, lujo, relax
- cantidad de acompañantes
- si ya viajó con Locas
- cuántas veces viajó con Locas
- destinos anteriores
- si quiere repetir con amigas
- destinos deseados
- lista de espera

## 2.5 Comportamiento web
Cada evento debe guardar:
- contacto si está identificado
- anonymous/session id si todavía no sabemos quién es
- timestamp
- página
- evento
- viaje
- salida
- metadata

Eventos a capturar:
- page_view
- trip_view
- trip_view_30s
- trip_view_60s
- itinerary_view
- price_view
- availability_view
- blog_view
- blog_scroll_50
- blog_complete
- favorite_add
- favorite_remove
- compare_trip
- lead_form_start
- lead_form_submit
- whatsapp_click
- email_click
- share_click
- waitlist_join
- alert_create
- checkout_start
- checkout_step
- reservation_start
- reservation_complete
- payment_start
- payment_complete
- payment_failed
- login
- mi_loca_view
- mi_viaje_view
- document_upload

## 2.6 Conversaciones e interacciones
Guardar toda interacción comercial:
- WhatsApp entrante
- WhatsApp saliente
- Instagram DM
- Facebook Messenger
- email
- llamada
- formulario
- nota interna
- reunión
- videollamada
- propuesta enviada
- propuesta abierta
- respuesta comercial
- automatización

Cada interacción:
- canal
- dirección inbound/outbound
- fecha/hora
- responsable
- asunto
- resumen
- texto/mensaje cuando corresponda
- resultado
- próxima acción
- sentimiento/intención si se clasifica con IA

---

# 3. Pipeline comercial

Etapas sugeridas:
1. Nuevo lead
2. Sin contactar
3. Contactado
4. Calificado
5. Interesado
6. Propuesta enviada
7. Esperando respuesta
8. Reserva iniciada
9. Esperando seña
10. Seña pagada
11. Saldo pendiente
12. Confirmado
13. Documentación pendiente
14. Listo para viajar
15. Viajando
16. Viaje completado
17. Postventa
18. Recompra
19. Perdido

Por oportunidad guardar:
- contacto
- viaje
- salida
- etapa
- score
- monto estimado
- moneda
- probabilidad interna si se usa
- responsable
- fecha creación
- última actividad
- próxima acción
- motivo de pérdida
- motivo de ganancia

---

# 4. Lead scoring

Ejemplo inicial:
- +5 visita viaje
- +5 vuelve al mismo viaje
- +10 permanece más de 60 segundos
- +10 abre precio
- +10 revisa disponibilidad
- +10 lee blog del destino
- +15 guarda favorito
- +15 se anota en alerta
- +20 completa formulario
- +20 hace clic en WhatsApp
- +20 consulta fechas
- +25 consulta precio
- +25 consulta financiación
- +30 inicia reserva
- +40 inicia pago
- +50 paga seña

Clasificación:
- 0–29 frío
- 30–59 interesado
- 60–79 caliente
- 80–100+ prioridad alta

El score debe recalcularse automáticamente.

---

# 5. Viajes y salidas

Por viaje:
- título
- slug
- destino
- país
- categoría
- duración
- descripción
- precio base
- moneda
- estado
- portada
- galería
- blog asociado
- itinerario
- incluye
- no incluye
- documentación
- hotel
- coordinadora
- preguntas frecuentes
- testimonios

Por salida:
- fecha inicio
- fecha fin
- cupo total
- lugares reservados
- lugares pagos
- lugares libres
- lista de espera
- precio
- seña
- saldo
- fecha límite de pago
- responsable
- estado

---

# 6. Reservas

Guardar:
- contacto
- salida
- cantidad de pasajeras
- habitación
- tarifa
- moneda
- precio total
- seña requerida
- seña pagada
- saldo
- fecha de vencimiento
- estado de reserva
- observaciones
- origen de la reserva
- campaña atribuida

Estados:
- iniciada
- pendiente de seña
- seña pagada
- confirmada
- cancelada
- lista de espera
- completada

---

# 7. Pagos

Integraciones posibles:
- Mercado Pago
- Stripe
- PayPal
- transferencia
- efectivo/manual

Guardar:
- reserva
- contacto
- proveedor
- transaction id
- importe
- moneda
- tipo: seña/cuota/saldo/reembolso
- estado
- fecha
- vencimiento
- comprobante
- método
- metadata

Métricas:
- cobrado hoy
- cobrado semana
- cobrado mes
- pendiente
- vencido
- pagos por canal
- pagos por viaje
- pagos por responsable

---

# 8. Documentación

Por pasajera:
- DNI
- pasaporte
- fecha vencimiento
- visa
- seguro
- contacto de emergencia
- ficha médica si corresponde y legalmente procede
- archivos cargados
- documentos aprobados
- documentos rechazados
- documentos pendientes

Alertas:
- documento faltante
- documento por vencer
- documento rechazado
- seguro faltante

---

# 9. Tareas y seguimiento

Tipos:
- responder lead
- llamar
- enviar propuesta
- enviar fechas
- enviar financiación
- recordar seña
- cobrar saldo
- pedir documentación
- revisar documento
- avisar cupo
- contactar lista de espera
- seguimiento postventa
- pedir testimonio
- recomendar próximo viaje

Cada tarea:
- contacto
- oportunidad
- responsable
- prioridad
- fecha/hora
- estado
- resultado
- notas

---

# 10. Atribución comercial completa

Queremos poder responder:
- ¿De dónde vienen los leads?
- ¿De dónde vienen las reservas?
- ¿De dónde viene la facturación?
- ¿Qué campaña produce leads de mayor calidad?
- ¿Qué campaña produce seña?
- ¿Qué anuncio convierte mejor?
- ¿Qué canal tarda menos en convertir?
- ¿Qué canal tiene mayor ticket?
- ¿Qué canal trae más clientas recurrentes?

Modelos de atribución posibles:
- first touch
- last touch
- lead creation
- linear
- assisted conversion

Para la demo podemos mostrar first touch + last touch + canal de conversión.

---

# 11. Rendimiento por canal

Por Instagram/Facebook/WhatsApp/Google/Web/Referidos:
- visitas
- leads
- leads calificados
- oportunidades
- propuestas
- reservas
- señas
- ventas
- facturación
- ticket promedio
- conversión lead → reserva
- conversión reserva → seña
- tiempo medio hasta reserva
- valor por lead

Si conectamos inversión publicitaria:
- gasto
- CPL
- CPA
- CAC
- ROAS

---

# 12. Rendimiento por campaña

Por campaña:
- canal
- campaña
- anuncio
- creatividad
- fecha
- gasto
- impresiones
- clics
- CTR
- CPC
- leads
- CPL
- reservas
- señas
- ventas
- facturación
- ROAS
- destinos vendidos

---

# 13. Rendimiento por destino

Por viaje:
- visitas
- visitantes únicos
- favoritos
- blog reads
- consultas
- leads
- propuestas
- reservas
- señas
- ventas
- ocupación
- lista de espera
- conversión
- abandono
- facturación
- ticket promedio
- origen de los compradores

Podemos detectar:
- mucho tráfico + pocas reservas = problema comercial
- muchos favoritos + pocas fechas = demanda latente
- muchas listas de espera = abrir nueva salida
- alta conversión + cupo bajo = aumentar oferta

---

# 14. Perfil 360° de cada pasajera

Una ficha debe mostrar:
- datos personales
- origen
- campaña
- primer touch
- último touch
- intereses
- viajes vistos
- blogs leídos
- favoritos
- formularios
- WhatsApp
- emails
- llamadas
- tareas
- oportunidades
- reservas
- pagos
- documentación
- viajes realizados
- grupo de cada viaje
- testimonios
- referidos
- valor histórico de cliente
- siguiente viaje sugerido

---

# 15. Comunidad

Datos útiles:
- con quién viajó
- salida/grupo
- cuántos viajes hizo
- destinos realizados
- amigas referidas
- compañeras recurrentes
- participación postviaje
- próximo viaje compartido

Podemos crear clusters:
- nuevas
- recurrentes
- embajadoras
- referidoras
- alta frecuencia
- alto ticket

---

# 16. Postventa y fidelización

Después del viaje:
- encuesta
- NPS
- rating
- comentario
- testimonio
- fotos
- permiso UGC
- referido
- próximo destino
- recompra

Métricas:
- NPS por viaje
- satisfacción por coordinadora
- recompra
- referidos
- valor de vida del cliente

---

# 17. Automatizaciones

Triggers posibles:

## Interés
- vio mismo viaje 3 veces
- leyó artículo completo
- guardó favorito
- pidió alerta

## Comercial
- nuevo lead
- sin respuesta en X horas
- propuesta enviada sin respuesta
- reserva abandonada
- seña pendiente

## Cupos
- quedan 5
- quedan 3
- último lugar
- salida agotada
- lugar liberado
- nueva salida

## Pagos
- seña vence
- saldo vence
- pago rechazado
- pago recibido

## Documentación
- falta documento
- documento vence
- documento rechazado

## Postventa
- viaje terminó
- pedir testimonio
- pedir referido
- sugerir próximo viaje

Cada automatización debe guardar un registro en `automation_events`.

---

# 18. Alertas de negocio

El sistema puede avisar:
- leads calientes sin contacto
- oportunidades sin actividad
- propuestas sin seguimiento
- reservas sin seña
- pagos vencidos
- documentos faltantes
- salida próxima con baja ocupación
- salida casi completa
- aumento anormal de demanda
- campaña con alto costo
- campaña con alta conversión
- destino con lista de espera elevada

---

# 19. Dashboard de dirección

KPIs principales:
- ventas del mes
- facturación
- señas cobradas
- saldo pendiente
- leads
- oportunidades
- reservas
- conversión
- ticket promedio
- ocupación
- CAC
- ROAS
- recompra
- NPS

Paneles:
- por canal
- por campaña
- por viaje
- por responsable
- por país
- por mes
- comparativo período anterior

---

# 20. Consultas que debería responder el agente

- ¿Cuántos leads tengo hoy?
- ¿Cuántos vinieron por Instagram?
- ¿Qué campaña generó más reservas?
- ¿Qué viaje tiene más interés?
- ¿Qué salida está por llenarse?
- ¿Quién necesita seguimiento hoy?
- ¿Quién inició reserva y no pagó?
- ¿Cuánto falta cobrar esta semana?
- ¿Quién debe documentación?
- ¿Quiénes vieron Ushuaia más de dos veces?
- ¿Quiénes leyeron el blog y no consultaron?
- ¿Quiénes viajaron antes y podrían comprar Puerto Rico?
- ¿Qué contactos están en lista de espera?
- ¿Qué viaje conviene promocionar?
- ¿Qué canal tiene mejor conversión?
- ¿Qué canal tiene mayor ticket?
- ¿Cuánto facturó Instagram?
- ¿Cuánto facturó WhatsApp?
- ¿Qué campaña tiene peor ROAS?

---

# 21. Cómo vamos a capturar cada tipo de dato

## Web Next.js
Implementar un tracker propio.

Cada visita genera:
- anonymous id
- session id
- URL
- referrer
- UTM
- dispositivo
- evento
- timestamp

Cuando la persona completa un formulario, inicia sesión, reserva o deja teléfono/email:
- vinculamos anonymous/session id con `contact_id`
- todo el historial previo pasa a formar parte de su ficha.

## Formularios
Cada formulario inserta/actualiza:
- contact
- source
- campaign
- opportunity
- interaction
- task si corresponde

## Instagram/Facebook
Meta Lead Ads:
- webhook/API
- contacto
- campaña
- adset
- ad
- formulario
- fecha

DMs/Instagram si la integración disponible lo permite:
- interacción
- conversación
- contacto

## WhatsApp Business
Webhook:
- teléfono
- mensaje
- timestamp
- inbound/outbound
- conversation id
- template
- status

Se vincula por teléfono al contacto.

## Google
- UTMs
- gclid
- Google Ads conversion data si se conecta
- Search/Ads source

## Email
Proveedor de email:
- enviado
- entregado
- abierto
- clic
- respuesta
- unsubscribe

## Pagos
Webhooks Mercado Pago / Stripe / PayPal:
- payment id
- status
- amount
- currency
- contact/reservation

## Operación manual
El equipo puede cargar:
- llamadas
- notas
- reuniones
- transferencias
- pagos externos
- documentación
- tareas

---

# 22. Resolución de identidad

Problema: una misma persona puede llegar primero anónima, luego por formulario y después por WhatsApp.

Reglas:
1. cookie/local storage crea `anonymous_id`.
2. cada sesión crea `session_id`.
3. si aparece email, buscar contacto por email.
4. si aparece teléfono, buscar por teléfono normalizado.
5. si coincide, unir actividad.
6. si no coincide, crear contacto.
7. conservar first touch original.
8. actualizar last touch en cada nueva visita/campaña.

Evitar duplicados con:
- email normalizado
- teléfono E.164
- merge manual cuando haga falta

---

# 23. Esquema de eventos web sugerido

`web_events`

Campos principales:
- id
- contact_id nullable
- anonymous_id
- session_id
- event_name
- page_url
- page_path
- referrer
- trip_id nullable
- departure_id nullable
- source_id nullable
- campaign_id nullable
- utm_source
- utm_medium
- utm_campaign
- utm_content
- utm_term
- device_type
- browser
- country
- city
- metadata jsonb
- created_at

---

# 24. Datos derivados que no se capturan directamente

El sistema debe calcular:
- lead score
- days_to_conversion
- customer lifetime value
- number_of_trips
- first_touch_source
- last_touch_source
- conversion_source
- total_revenue
- pending_balance
- overdue_balance
- engagement score
- repeat probability
- next best trip

Estos valores se calculan a partir de eventos y transacciones.

---

# 25. Roadmap de implementación

## Fase 1 — Base y CRM usable
- Supabase schema
- CRM conectado
- contactos
- fuentes
- campañas
- oportunidades
- tareas
- interacciones
- filtros
- ficha 360

## Fase 2 — Tracking web
- anonymous id
- session id
- UTMs
- page view
- trip view
- blog view
- favoritos
- formularios
- WhatsApp click
- checkout

## Fase 3 — Reservas y pagos
- reservas
- cupos
- seña
- saldo
- pagos
- vencimientos

## Fase 4 — WhatsApp / Meta / Email
- webhooks
- ingestión automática
- campañas
- conversaciones

## Fase 5 — Automatizaciones
- lead routing
- tareas automáticas
- alertas
- abandonos
- cupos
- pagos
- documentación

## Fase 6 — Dirección e IA
- dashboards
- reporting
- consultas en lenguaje natural
- recomendaciones
- predicción/segmentación cuando haya datos suficientes

---

# 26. Regla principal

Todo evento comercial relevante debe terminar en Supabase con una identidad, una fuente, un timestamp y contexto suficiente para reconstruir el recorrido completo de cada pasajera.

El objetivo final es poder responder:

> Quién es, de dónde vino, qué le interesa, qué hizo, qué necesita ahora, cuánto puede comprar, quién la está atendiendo, cuánto terminó pagando y qué viaje ofrecerle después.

