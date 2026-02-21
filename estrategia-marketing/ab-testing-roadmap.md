# Roadmap de Tests A/B para Basis (Próximos 3 Meses)

Este roadmap estructura la optimización del funnel completo (Homepage -> Free Tool -> Onboarding/Demos). Basándonos en la persistencia de datos propia, evitamos parpadeos (flicker) en el frontend, inyectando la variante desde el servidor al renderizar y asignando una cookie persistente de variante (`variant_id`).

—

## 🗓️ MES 1: Cimientos y Homepage (High Traffic)
*Objetivo: Optimizar la conversión inicial desde tráfico frío en la Homepage.*

### Test 1.1: El Ángulo del Headline Principal (A/B)
- **Hipótesis:** *"Dado que el sector construcción desconfía de la 'IA mística' y busca ahorro de tiempo, creemos que enfocar el H1 en el dolor temporal (Variante B) frente a la tecnología (Control A) incrementará la retención en página."*
  - **A (Control):** "El primer software a medida con IA para construcción."
  - **B (Time-Pain):** "Reduce tus horas de presupuesto a 15 minutos exactos."
- **Métrica Principal:** Click-Through Rate (CTR) hacia el Wizard inicial (botón principal).
- **Métrica Secundaria (Contexto):** Tasa de rebote (Bounce Rate) en primeros 10s.
- **Tamaño de muestra necesario:** ~3.000 Visitantes Únicos por variante (Para detectar un incremento del 20% sobre un CTR base estimado del 5%, con confianza del 95%).
- **Criterio de Decisión:** Si B supera a A en significancia estadística (>95%), se consolida B. Si hay empate, mantener B porque ataca un *pain point* monetizable, facilitando el copy posterior.

### Test 1.2: El Momento de la Prueba Social (A/B)
- **Hipótesis:** *"Basados en heurísticas B2B, creemos que mostrar los logotipos de clientes inmediatamente debajo de la cabecera, antes de pedir que prueben el Wizard, reducirá la fricción e incrementará el uso de este."*
  - **A (Control):** Logos y testimonios al final de la landing page (Sección 6).
  - **B (Challenger):** "Faja" de logos insertada justo encima de la caja del Wizard.
- **Métrica Principal:** Tasa de inicio de uso del Wizard interactivo.
- **Métrica Guardarraíl (Floor):** Tasa de finalización (Scroll depth) de la web.
- **Tamaño de muestra necesario:** ~2.500 Visitantes Únicos por variante.
- **Criterio de Decisión:** Implementar la variante B si logra un aumento del 10% en el inicio de uso del Wizard sin destruir el scroll depth del resto de beneficios de la página.

—

## 🗓️ MES 2: Captación en el Wizard Gratuito (Partial Gating)
*Objetivo: Encontrar el equilibrio perfecto entre entregar valor gratuito (efecto WOW) y maximizar la captura de emails válidos.*

### Test 2.1: El Muro de Pago Emocional (A/B/n)
- **Hipótesis:** *"Creemos que pedir el email para descargar el PDF detallado generará resistencia. Testear el grado de transparencia de la pre-visualización optimizará la tasa de captura de emails."*
  - **A (Control - Ciego):** Presupuesto totalmente borroso excepto el precio final. "Déjanos tu email para verlo".
  - **B (Transparente Parcial):** Se leen las 3 primeras y las 3 últimas partidas perfectas. El tramo medio está borroso. "Envíanos el correo para desbloquear el desglose completo".
  - **C (Incentivado):** Como la variante A, pero añade: "Incluye una auditoría de tu margen de beneficio en el correo".
- **Métrica Principal:** Tasa de Conversión de Lead (Form submit email).
- **Métrica Secundaria:** Tasa de abandono (Bounce) en el paso del Lead Wall.
- **Tamaño de muestra necesario:** Al menos 1.200 impresiones del muro por cada una de las 3 variantes (requiere más tráfico sostenido porque se mide sobre los usuarios que *completan* el wizard, no los que visitan la web).
- **Criterio de Decisión:** La variante que entregue la Métrica Principal más alta consolidando coste por lead, asumiendo un riesgo bajo al estar en una fase de generación MQL.

### Test 2.2: El CTA Post-Lead (Upsell Inmediato vs Retardado)
- **Hipótesis:** *"Sabemos que empujar a una Demo consultiva inmediatamente (1 segundo) después de que nos dejen el correo puede abrumar. Ofrecer la demo dentro del correo (en vez de en la thank-you page) cualificará mejor a los leads."*
  - **A (Control):** Página de éxito (Thank You) ofrece descargar el PDF y un calendario enorme de Calendly para agendar la demo de Basis Core en el acto.
  - **B (Retardado):** Página de éxito minimalista ("PDF enviado a tu correo"). El enlace de agendar la demo va *exclusivamente* y en grande como CTA dentro del primer Email transaccional que reciben con su PDF.
- **Métrica Principal:** Tasa de Agenda (Booked Demos) vs Cancelaciones.
- **Métrica Secundaria:** Tasa de apertura de Email 1.
- **Tamaño de muestra necesario:** ~1.000 Leads capturados por variante.
- **Criterio de Decisión:** Si A consigue más demos pero altísima inasistencia (No-Show), B es declarado ganador operativo. Buscamos Calidad MQL (Intent), no sólo cantidad bruta.

—

## 🗓️ MES 3: Fricción en el Onboarding y Retención
*Objetivo: Mitigar los No-Shows (ausencias en las demos agendadas) y aumentar la tasa de "Wow" en las demos comerciales.*

### Test 3.1: Fricción del Onboarding Interactivo (A/B)
- **Hipótesis:** *"Creemos que pedir 4 preguntas (Typeform) después de agendar la demo reducirá drásticamente las reuniones en blanco, aunque aumente un poco la fricción post-reserva."*
  - **A (Drop/Fricción):** El usuario agenda en Calendly y listo. El comercial va "a ciegas" a la reunión.
  - **B (Profiling):** Flujo de 4 preguntas (Problema, Tamaño, Software Actual, Carga de Archivo) implementado en `demo-onboarding-flow.md`.
- **Métrica Principal:** Tasa de Cierre (Close Rate) de la Demostración Comercial a Contrato. (Métrica muy downstream/fondo de embudo).
- **Métrica de Diagnóstico:** % de usuarios que inician el Typeform vs los que lo completan (Drop-off Rate del cuestionario).
- **Tamaño de muestra necesario:** Entre 150 y 300 demos agendadas (testeo prolongado de baja N, ya que medimos conversión de ventas).
- **Criterio de Decisión:** Consolidar B (Profiling) de forma permanente si el ratio de cierre post-demo es al menos un 15% superior al control, demostrando que el comercial está utilizando los datos para vender mejor.

### Test 3.2: El "Teaser" Email anti No-Shows (A/B)
- **Hipótesis:** *"Dada la alta inasistencia natural del sector de la construcción B2B, creemos que sustituir un recordatorio estándar de 24h por un 'Teaser visual borroso' de la plataforma resolverá la falta de compromiso.*
  - **A (Control):** Email estándar "Recordatorio: Nos vemos mañana a las 10h".
  - **B (Teaser Emocional):** Email "Mañana tapamos tus fugas" con integración de imagen de su panel de rentabilidad difuminado (descrito en el onboarding flow).
- **Métrica Principal:** Tasa de Asistencia (Show-Up Rate) a la demostración agendada.
- **Tamaño de muestra necesario:** 450 demos agendadas por variante (requiere persistencia local de cohortes de usuario vinculadas al envío del Mailer Trigger).
- **Criterio de Decisión:** Ganancia estadística (P-Value < 0.05). Un salto del 60% al 75% de asistencia justifica implementar B definitivamente.
