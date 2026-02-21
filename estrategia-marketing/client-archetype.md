# Arquetipo de Cliente — Basis

*Define los campos de profiling que recogemos post-OTP para cualificar al lead antes de agendar demo o usar la herramienta.*

## Flujo: OTP → Profiling (Required) → Acción (Agendar / Usar)

## Pantallas del Wizard (Typeform-style, 1-2 preguntas por pantalla)

### Pantalla 1: El Mayor Dolor
**"¿Qué proceso te quita más tiempo a la semana?"**

| Opción | Valor | Icono | Demo Orientation |
|--------|-------|-------|------------------|
| Presupuestar y buscar precios | `budgeting` | 📋 | Agilidad comercial + AI search |
| Control de desviaciones y márgenes | `cost-control` | 📊 | Dashboard analítico |
| Cuadrar horas y certificaciones | `certifications` | 🏗️ | Certificaciones automáticas |

### Pantalla 2: Escala + Rol
**"¿Cuántas obras gestionáis a la vez?"**

| Opción | Valor | Segmento |
|--------|-------|----------|
| 1 – 3 obras | `1-3` | Autónomo / Micro |
| 4 – 10 obras | `4-10` | Pyme |
| +10 obras | `10+` | Constructora consolidada |

**"¿Cuál es tu rol?"**
- Propietario / Gerente → `owner`
- Director de Obra → `project-manager`
- Administración → `admin`
- Aparejador → `surveyor`

### Pantalla 3: Coste Operativo
**"¿Cuánto gastas al año en aparejadores o gestión técnica?"**

| Opción | Valor |
|--------|-------|
| Menos de 10.000 € | `<10k` |
| 10.000 – 30.000 € | `10-30k` |
| 30.000 – 60.000 € | `30-60k` |
| Más de 60.000 € | `60k+` |

**"¿Cuántas horas semanales dedicas a trabajo manual (Excel, papel, WhatsApp)?"**

| Opción | Valor |
|--------|-------|
| Menos de 5 horas | `<5h` |
| 5 – 15 horas | `5-15h` |
| 15 – 30 horas | `15-30h` |
| Más de 30 horas | `30h+` |

### Pantalla 4: Empresa + Stack
**"¿Cómo se llama tu empresa?"** *(único campo de texto libre)*

**"¿Desde qué herramientas planeas migrar?"**
- Excel / Word → `excel`
- Presto / Arquímedes → `presto`
- Otro ERP (Procore, Odoo, Holded...) → `other-erp`

## Valor para Ventas (Challenger Sale)

Cada campo permite personalizar la demo quirúrgicamente:
- `biggestPain` → Agenda del primer bloque de la demo
- `simultaneousProjects` → Complejidad del ejemplo precargado
- `annualSurveyorSpend` → ROI calculable para el pitch
- `weeklyManualHours` → Cuantificación del ahorro en la propuesta
- `currentStack` → Plan de migración de datos
