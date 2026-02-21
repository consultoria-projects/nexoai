# Flujo de Onboarding B2B (Demo Gratuita Basis) 

*Este documento diseña la experiencia post-conversión. Cuando un cliente solicita una Demostración o Evaluación Técnica, el objetivo del producto no es dejarlo en una pantalla de confirmación genérica ("Gracias, te llamaremos"), sino activar su cuenta parcialmente para que el equipo comercial tenga datos hiper-cualificados y el cliente viva su primer "Aha Moment" antes incluso de la reunión.*

---

## 1. El "Aha Moment" (Activación Temprana)

**Definición del Aha Moment:** 
El instante exacto en que el usuario entiende emocionalmente que Basis le va a ahorrar dinero y tiempo. 
Para Basis, es: **Convertir las horas trabajadas de sus empleados a pie de obra en una Certificación/Factura automáticamente.**

Al solicitar la demo, en vez de un mensaje final, se le redirige al Dashboard con un **Modo Trial Restringido:**
- Ven una obra ficticia (o basada en datos que pre-cargaron en el Wizard libre).
- Tienen un botón brillante: `"Generar Certificación de Febrero"`.
- Al hacer clic, ven la animación cruzando las horas trackeadas de los peones vs el presupuesto, generando el PDF final de la certificación en 2 segundos.
- *Efecto:* Sienten el alivio de no tener que recopilar partes de trabajo en papel nunca más.

---

## 2. Onboarding Interactivo (Pre-Demo Profiling)

*Objetivo: El tiempo de nuestro equipo técnico es oro. Necesitamos perfilar a la empresa (volumen de facturación, stack actual) pero si lo preguntamos en un formulario clásico de 7 campos en la landing page, la conversión cae. Lo preguntamos post-conversión, dentro del producto.*

### Flujo de Profiling (Estilo Typeform integrado)
Tras agendar la demo (Calendly), la URL de redirección los lleva a: `app.basis.com/welcome-setup`

**Pantalla 1 (Bienvenida al Sandbox):**
"Hola, Carlos. Tu evaluación técnica está confirmada para el [Fecha/Hora]. Para que nuestros ingenieros preparen el entorno con tus casos reales y la demo dure 15 minutos en lugar de 1 hora, ¿podrías ayudarnos a afinar el motor de IA?"

**Interacción Modal (1 Pregunta por Pantalla):**
1. **El mayor dolor:** "¿Qué proceso te roba más tiempo a la semana actualmente?"
   - ( ) Presupuestar y buscar precios.
   - ( ) Control de desviaciones (Saber si mi margen está en números rojos).
   - ( ) Cuadrar horas del personal y certificaciones.
2. **El tamaño de la herida:** "¿Cuántas obras gestionáis simultáneamente de media?"
   - ( ) 1 - 3 (Autónomos / Startups) -> *El Agente IA orientará la demo a agilidad comercial.*
   - ( ) 4 - 10 (Pymes) -> *El Agente IA orientará la demo al control de caos e integraciones.*
   - ( ) +10 (Constructoras Consolidadas) -> *Orientación a ERP full-scale y rentabilidad logísitica.*
3. **El obstáculo Legacy:** "¿Desde qué entorno vienes para migrar tus datos actuales?"
   - ( ) Uso hojas de Excel / Word principalmente.
   - ( ) Uso Presto / Arquímedes.
   - ( ) Otro ERP (Procore, Odoo, Holded...).
4. **Subida de Archivo (Micro-Compromiso):** "OPCIONAL: Sube aquí un PDF con tu catálogo de almacén o base de precios. Nuestro modelo IA lo ingerirá antes de la reunión y te haremos la videollamada presupuestando con TUS precios reales."
   - `[Zona Dropzone para Archivos PDF / Excel]`

*(Con esta información, el técnico que da la Demo hace una venta consultiva quirúrgica ("Challenger Sale"), yendo directo a la herida abierta de ese lead).*

---

## 3. Empty States y Tooltips (La experiencia dentro del Sandbox)

Si el usuario decide "curiosear" por la plataforma antes de su reunión, no puede ver pantallas vacías tipo "No hay obras". Debe ver valor.

### Empty State: Sección de Obras
- **Visual:** Un gráfico sombreado o un "blueprint" (plano de arquitectura) difuminado.
- **Copy Headline:** El cuartel general de tu rentabilidad.
- **Copy Body:** Aquí es donde cruzarás los presupuestos contra las facturas reales. Verás en tiempo real (con indicadores semafóricos) qué obra está devorando tu margen y cuál es altamente rentable.
- **Botón Deshabilitado/Con candado:** 🔒 Cargar mi primera Obra Real 
  - *Tooltip al hacer hover:* "Esta función se desbloquea tras tu Evaluación Técnica de Onboarding con nuestro equipo."

### Empty State: Asistente Twilio (Agent AI)
- **Visual:** Un icono 3D de un micrófono / Bot IA atendiendo una llamada telefónica retro.
- **Copy Headline:** Deja que la IA conteste las solicitudes basura por ti.
- **Copy Body:** Imagina un agente que filtra telefónicamente al cliente que solo quiere "precio por curiosear" y agenda en tu calendario solo a los clientes cualificados. Ahorra 10 horas de atención al cliente a la semana.
- **Micro-CTA:** Reproducir llamada de prueba `[Play Audio 0:45s]` *(Una demo de Twilio pregrabada actuando como recepcionista técnico).*

### Tooltip Estratégico ("El Gancho en Menú"):
En el menú lateral izquierdo, la pestaña "Módulo de Certificaciones" debe tener un "Glow" (brillo azul suave animado).
- **Tooltip al pasar el ratón:** "El favorito de las constructoras. Ahorra 1 tarde entera de papeleo cada fin de mes elaborando facturas. Te lo enseñamos en la Demo."

---

## 4. Secuencia Email Anti-No-Show (Recordatorios de Demo)

*En B2B (y más en la construcción de campo), la inasistencia a demos (No-Show rate) suele ser altísima porque "estaban apagando fuegos en una obra". El recordatorio no puede ser aburrido, debe generar anticipación (FOMO).*

### Email 1: Confirmación Inmediata (Tras agendar)
**Asunto:** 📅 Confirmada - Evaluación Técnica Basis
**Cuerpo:**
Hola {{first_name}},
Tu sesión estratégica por videollamada con nuestro equipo de ingenieros está agendada para el {{event_date}} a las {{event_time}}.

Tienes el evento de calendario en este email. Acéptalo para no perder la reserva (y avísanos con tiempo si tienes una emergencia en obra). 

**¿Qué haremos ese día?**
No vamos a ponerte 40 diapositivas aburridas de PowerPoint. Directamente en los primeros 15 minutos:
1. Volcaremos tus catálogos a la Inteligencia Artificial.
2. Cruzaremos presupuestos reales contra horas de tus empleados.
3. Te enseñaremos de dónde puedes sacar al mes hasta un +12% extra de margen evitando el 'caos administrativo'.

Nos vemos pronto,
[Nombre del Agente de Ventas/Ingeniero], Basis.

---

### Email 2: El "Teaser" (24 Horas Antes)
**Asunto:** Mañana te enseñamos a tapar tus fugas de rentabilidad 💸
**Cuerpo:**
Hola {{first_name}},

Mañana nos vemos a las {{event_time}} para tu evaluación de Basis. 

Quería pasarte algo útil antes de reunirnos. Hemos configurado el entorno de pruebas basándonos en tu respuesta de que [Variable "Pain" del formulario, ej: Pierdes mucho tiempo haciendo certificaciones con Excel].

Mañana quiero enseñarte específicamente **ésta pantalla** (adjunto captura borrosa / gif). Es tu panel de mando: si una partida gasta más horas o materiales de los que presupuestaste, se iluminará en rojo de inmediato el día 1, y no cuando ya es invierno y la obra está entregada.

Entraremos directo a solucionar ese cuello de botella. Te dejo el link de la reunión abajo (Zoom/Meet).

¡Un saludo!

---

### Email 3: Última Milla (1 Hora Antes - vía SMS + Email corto)
*Para la gente en la obra, un recordatorio "en el bolsillo" es necesario.*

**SMS / WhatsApp de Twilio (Recomendado):**
"Hola Carlos, empezamos tu sesión técnica de Basis en 1 hora! Te mostraré cómo calcular presupuestos un 80% más rápido. 🚀 Tienes el link del Meet en tu correo. ¡Nos vemos!"

**Email (1 Hora antes):**
**Asunto:** Empezamos en 1 hora [Enlace Dentro] ⏱️
**Cuerpo:**
Hola {{first_name}}, preparamos motores. En 60 minutos iniciamos la evaluación técnica en la videollamada. 

**Enlace de acceso a la sala:** [URL de la Reunión]

Ten a mano las dudas más difíciles que nos quieras lanzar sobre migrar tus catálogos o tus históricos de obra. A la IA le encantan los retos. Elevamos tu rentabilidad en un rato. Nos vemos dentro.
