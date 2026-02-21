# Secuencia de Activación: Leads del "Wizard Generador de Presupuestos"

## ⚙️ INSTRUCCIONES TÉCNICAS (Para el Agente de Desarrollo / dev-agent)

**IMPORTANTE:** Esta secuencia no funcionará a través de un CRM tradicional (como Mailchimp o ActiveCampaign). Todo el flujo de envío automatizado debe programarse en **Firebase Cloud Functions (Trigger Email)**.
- El diseño de los emails recae en las plantillas HTML (Handlebars) dentro del propio código.
- Los estilos (CSS) deben ir *inline* (o en una etiqueta `<style>` inyectada en el Head de la plantilla) para que no se rompan en los clientes de Gmail/Outlook.
- Cada disparador de envío (cronjob o delay) debe programarse en la base de datos (Firestore) controlando el `createdAt` del Lead y disparando la función en los días [0, 2, 4, 7, 10, 14, 21].

---

## 📅 Estructura de la Secuencia (Lead Nurture)

**Sequence Name:** Nurture Wizard -> Basis Core Demo
**Trigger:** Envío de formulario en paso "Gated" del Free Tool Wizard.
**Goal:** Demostrar autoridad, escalar dolor y conseguir Booking para Demo Consultiva.
**Exit Conditions:** El usuario agenda una demo de Basis (cambia de Tag o se elimina de la cola de envíos).

---

### Email 1: Inmediato (El "Aha Moment")
**Propósito:** Cumplir lo prometido rápido e invitar a descubrir el "motor" real detrás de la magia.

**Subject:** Aquí tienes tu presupuesto técnico 📑
**Preview:** Este documento se hizo en 30 segundos usando IA...

**Body:**
Hola {{first_name}},

Lo prometido es deuda. Aquí tienes adjunto el Presupuesto Técnico que acabamos de generar para ti usando inteligencia artificial:

[🔗 Descargar Presupuesto en PDF]

Si te fijas, la IA ha estructurado las partidas como si llevara 10 años en la obra. Ha inferido los desescombros, los materiales necesarios y los tiempos de oficial y peón. Y todo, en base a precios medios del mercado actual.

Imagina este proceso... pero en vez de "precios medios", usando TUS catálogos de almacén y TUS márgenes reales guardados en memoria.

Eso es exactamente lo que hace el software de Basis Core por las grandes constructoras: presupuestar obras enteras a ciegas no es su estilo, pero presupuestarlas en 15 minutos sin errores de Excel sí lo es.

Puedes conocer Basis y cómo se adaptaría a tu forma de trabajar con un solo clic.

**CTA:** [Ver qué más puede hacer Basis por mi empresa] *(Enlace a la Landing Page)*

Un saludo,
El Equipo de Basis

---

### Email 2: Día 2 (Autoridad y Social Proof)
**Propósito:** Bajar las defensas demostrando que "esto sirve para gente como yo".

**Subject:** Cómo Carlos multiplicó x3 sus obras aceptadas
**Preview:** Presupuestar desde la furgoneta cambió las reglas del juego...

**Body:**
Hola {{first_name}},

Hace unos meses, Carlos, un contratista del norte de España y cliente nuestro, estaba a punto de tirar la toalla de la burocracia.

Después de todo el día de obra en obra y coordinando material, llegaba a casa a las 20:30h para... sentarse delante del ordenador y pasar apuntes de la libreta a un excel gigante. Resultado: sus presupuestos llegaban a los clientes 3 días tarde y la mitad ya habían firmado con otro.

Hoy, Carlos usa el motor que probaste el otro día (Basis Core), integrado a la medida de su empresa. 
¿Lo mejor? Terminada su visita, se mete en su furgoneta y le habla a la aplicación como lo hiciste en el simulador. Al arrancar el coche de vuelta a casa, el cliente ya tiene en su email el presupuesto detallado.

**El que presupuesta antes, se lleva la obra.** Es una regla matemática en este sector.

Responder a clientes al instante no exige magia, exige tu propio software a medida.

**CTA:** [Analizar gratuitamente los cuellos de botella de mi negocio] *(Enlace a Calendly)*

Seguimos en contacto.

---

### Email 3: Día 4 (Agitación del Problema)
**Propósito:** Que cuantifiquen el dinero que están perdiendo diariamente (El Coste Oculto).

**Subject:** El error que te cuesta tu margen neto
**Preview:** Trabajar mucho no siempre significa ganar dinero...

**Body:**
Hola {{first_name}},

Quiero hacerte una pregunta un tanto incómoda: 
**De la última obra que cerraste... ¿sabes exactamente, céntimo a céntimo, qué margen de beneficio neto te dejó?**

La mayoría de constructoras contestan "creo que gané X, pero aún tengo que cruzar los albaranes del almacén". Esa es la ceguera de los números. Es el mayor responsable del quiebre de empresas del sector.

Ese desfase de costes ocurre cuando:
1. Las horas del viernes del peón no se apuntan bien.
2. Compras acopios de urgencia que no estaban presupuestados.
3. Lo gestionas todo cruzando apps comerciales inconexas y facturando tarde (o de menos).

La inteligencia artificial de Basis no solo redacta presupuestos. En Basis construimos tu plataforma desde cero para que el "control de costes" cruce cada factura automáticamente contra el proyecto. Si en el día 15 de obra el material pisa por accidente tu beneficio... el panel enciende una alarma roja.

Gestionar obras no debería ser pilotar un avión a ciegas. 

**CTA:** [Quiero tapar mis fugas de dinero con Basis] *(Enlace a Landing Page / Calendly)*

---

### Email 4: Día 7 (Destrucción de Alternativas)
**Propósito:** Una comparativa limpia de por qué su competencia tecnológica SaaS o su Excel actual nunca va a escalar.

**Subject:** ¿Excel, ERP genérico o Software a Medida?
**Preview:** La verdad de por qué "Presto" puede estar frenándote.

**Body:**
Hola {{first_name}},

Es probable que tras ver nuestro Generador IA gratuito, hayas buscado alternativas de mercado "baratas" o estés pensando: "con mis Excels ya voy tirando".

Hoy quiero darte algo de contexto sobre las tres vías reales para digitalizar tu constructora (y sus costes hundidos):

➖ **La Vía del Excel / PDF:** Es gratis, claro... hasta que borras una celda sin querer enviándole un presupuesto inflado 2.000€ al cliente. Además, sigues haciéndolo tú, robándole horas a tu familia. No escala.
➖ **La Vía del SaaS "Enlatado" (ERP rígidos):** Pagas de $500 a $2,000 mensuales por un software enorme y pesado de una marca famosa de la época del 2010. Prometen el cielo, pero obligan a todos tus empleados a cambiar su forma de trabajar (y terminan no usándolo).
✅ **La Vía Basis (A Medida con IA):** Es un software diseñado *solo* para tu forma de trabajar, que además, como parte de una arquitectura base que llamamos "Core" (con la IA ya ensamblada). El coste final, repartido a medio plazo, es hasta un 80% más barato en implantación que contratar a una gran consultora (Deloitte o PWC). Nadie tiene que aprender a usar un monstruo nuevo. Simplemente, vuestros procesos... hechos software al instante.

¿No crees que ha llegado el momento de que el software se adapte a tu constructora y no al revés?

**CTA:** [Agendar Sesión Evaluativa Gratuita] *(Enlace a Calendly)*

---

### Email 5: Día 10 (Funcionalidad "Big Picture")
**Propósito:** Mostrar los pilares para que entiendan la magnitud del ERP.

**Subject:** No somos solo un generador bonito 🤖
**Preview:** Basis centraliza desde un lead hasta tu facturación...

**Body:**
Hola {{first_name}},

Tardaste unos pocos segundos en crear de la nada ese presupuesto gratis la semana pasada. Eso tan rápido fue tan solo la fase de *Venta* de nuestro software en acción. 

Pero Basis, una vez ensamblado a las necesidades únicas de tu negocio, abarca los 180 grados de tu gestión:

🏗️ **Asistente de Voz Integrado:** ¿Un agente de IA "Twilio" que atiende el teléfono, escucha a tu cliente, reserva su fecha de visita en el calendario si califica, y le rechaza dándole tus motivos si su obra no es interesante? Lo tienes.
📑 **Certificaciones a un clic:** Se acabó ir calculando sumatorios extraños para facturar el avance parcial del mes. Botón, porcentaje, envío, todo cruzado con el proyecto raíz.
🛡️ **Firma Legal Automatizada:** Nuestro Wizard no solo autocompleta con IA contratos aburridos en base a obras, sino que coordina directamente las subcontratas. 

Todo en un solo ecosistema y a tu medida.

**CTA:** [Saber más en una llamada sin compromiso] *(Enlace a Calendly)*

---

### Email 6: Día 14 (Urgencia & Oferta Exclusiva)
**Propósito:** Romper la inacción de quien nos lleva leyendo desde hace dos semanas y está en el "lo miraré más adelante".

**Subject:** Un detalle exclusivo de 20% para ti 🎁
**Preview:** ¿Te animas a evaluar tu proyecto antes del viernes?

**Body:**
Hola {{first_name}},

Has estado leyendo nuestros correos sobre Basis, sobre IA y cómo dejar atrás la "edad de piedra" en la construcción durante los últimos 14 días. ⏱️

Sabemos que si no habéis dado el paso de agendar la Evaluación es porque el día a día pesa. La obra te ahoga.
Y precisamente para detener eso existe un desarrollo **A Medida** del motor de Basis.

Queremos daros un motivo real para mover ficha rápido antes de que se pase otro mes perdiendo la oportunidad. 
**A todas las empresas constructoras que agenden nuestro Análisis Gratuito antes del viernes y validen ser candidatos de integración para Basis, les aplicaremos un -20% de descuento automático en su primer coste anual o de setup (dependiendo de la envergadura del proyecto evaluado), de cara a su digitalización.**

Respirar y recuperar el tiempo de los domingos está a 30 minutos de vídeo-llamada.

**CTA:** [Reservar llamada de Análisis (-20% First Year)] *(Enlace a URL especial oculta / Calendly Etiquetado)*

El equipo.

---

### Email 7: Día 21 (Check in final + Testimonial de Cierre)
**Propósito:** El ultimátum amable. Si no agendan aquí, se les pasa a una lista de retención/newsletter, dejando de hacerles seguimiento comercial en caliente.

**Subject:** ¿Cerramos el tema, {{first_name}}?
**Preview:** Esto es lo que se siente al tener el control real..

**Body:**
Hola {{first_name}},

Te escribo porque no queremos ser pesados asaltando tu bandeja de entrada en medio de tu horario de obra. Hemos insistido tanto en que veas el Core de **Basis** por una razón que resume este gran contratista:

> *"Antes perdía al menos 3 horas cruzando precios desde 6 pestañas de pdf del proveedor. Además, sentía la angustia constante de 'seguro que me he dejado cosas y por lo tanto dinero por el camino'. Ahora solo alimento Basis con la información final, la IA lee la lista y me escupe la cotización íntegra calculando sola su margen de ganancia en 15 minutos."* — **(Nombre de tester aquí)**

Si de verdad necesitas dejar de picar piedra en la burocracia, automatizar los presupuestos (en serio), y erradicar las fugas en costes de obra... me alegrará enormemente verte al otro lado de nuestra pantalla evaluando vuestro futuro sistema a medida. 

**CTA Final:** [Hablar con el equipo técnico y agendar valoración inicial] *(Enlace a Calendly)*

Si prefieres seguir como ahora o en verdad las urgencias no te dejan pensar en escalabilidad, no te enviaremos más correos directos hasta que tú des el paso. 🚧 Nos vemos en la obra.

Un gran saludo.

Equipo Basis.
