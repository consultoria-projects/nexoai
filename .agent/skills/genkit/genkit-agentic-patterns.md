---
name: genkit-agentic-patterns
description: Colección completa de skills para patrones agénticos en Genkit, abarcando desde workflows estructurados hasta agentes totalmente autónomos.
author: Gemini
version: 1.0.0
---

# Catálogo Completo de Patrones Agénticos para Genkit

Este documento contiene todos los patrones de diseño para construir sistemas de IA en Genkit, clasificados según su nivel de autonomía en la "Escala Agéntica".

## 🏗️ 1. Workflows (Estructura y Fiabilidad)
Los workflows son ideales para procesos cuyos pasos son conocidos y deben ser altamente predecibles.

### [Skill: Sequential Processing]
**Descripción**: Ejecuta tareas en una secuencia fija de pasos. Permite optimizar el uso de modelos (ej. un modelo pequeño para clasificar y uno grande para redactar).
**Implementación**:
- Usar `ai.defineFlow` para encapsular la lógica.
- Realizar múltiples llamadas a `ai.generate` donde el resultado de una llamada alimenta el prompt de la siguiente.
- Validar cada paso intermedio con esquemas de Zod (`z.object`) para evitar la propagación de errores.

### [Skill: Conditional Routing]
**Descripción**: Clasifica la intención o el tipo de entrada para dirigir la ejecución hacia una rama lógica específica.
**Implementación**:
- Usar un modelo rápido (como `gemini-2.5-flash-lite`) para determinar la ruta.
- Definir las rutas mediante un `z.enum`.
- Implementar la bifurcación con lógica estándar de TypeScript (`if/else` o `switch`).

### [Skill: Parallel Execution]
**Descripción**: Ejecuta múltiples llamadas al LLM de forma concurrente para reducir la latencia total o para comparar diferentes perspectivas de un mismo problema.
**Implementación**:
- Utilizar `Promise.all()` dentro del flujo.
- Recopilar las respuestas y combinarlas en un objeto de salida final estructurado.

## 🔄 2. Híbridos (Inteligencia Dinámica)
Combinan la estructura de un workflow con la capacidad de decisión de un agente.

### [Skill: Tool Calling]
**Descripción**: Permite que el modelo decida dinámicamente llamar a funciones externas para obtener datos en tiempo real o realizar acciones.
**Implementación**:
- Definir herramientas con `ai.defineTool`.
- Pasar el array de herramientas a la propiedad `tools` en `ai.generate`.
- Genkit gestionará automáticamente el bucle de "solicitud de herramienta -> ejecución -> envío de resultado".

### [Skill: Iterative Refinement]
**Descripción**: Implementa un bucle de "Crítica y Optimización" donde un modelo genera contenido y otro lo evalúa hasta cumplir con un estándar de calidad.
**Implementación**:
- Usar un bucle `while` basado en un flag de satisfacción booleano.
- Implementar un límite de intentos (`attempts`) para evitar recursión infinita.
- El feedback del "Evaluador" se incluye explícitamente en el prompt del "Optimizador" para la siguiente iteración.

## 🤖 3. Agentes (Autonomía y Planificación)
Sistemas que razonan sobre un objetivo y deciden de forma autónoma qué pasos seguir.

### [Skill: Autonomous Operation]
**Descripción**: El modelo actúa como un agente de resolución de problemas que usa herramientas y razonamiento para alcanzar una meta compleja.
**Implementación**:
- Configurar el parámetro `maxTurns` (normalmente entre 5 y 10) para controlar el presupuesto de ejecución.
- Utilizar `ai.defineInterrupt` para pausar el proceso si se requiere aprobación humana o datos adicionales del usuario.
- El modelo mantiene el control del bucle hasta completar la tarea o alcanzar el límite de turnos.

### [Skill: Stateful Interaction]
**Descripción**: Mantiene la persistencia del contexto en conversaciones de varios turnos, permitiendo que el agente "recuerde" lo ocurrido anteriormente.
**Implementación**:
- Cargar el historial de mensajes (`MessageData[]`) desde una base de datos.
- Añadir el nuevo mensaje del usuario al historial antes de la llamada.
- Pasar el historial completo a la propiedad `messages` en `ai.generate`.
- Guardar el historial actualizado (incluyendo la respuesta del modelo) tras cada interacción.

## 💡 Reglas de Oro para la Implementación
1. **Principio de Parsimonia**: No uses un agente autónomo si un workflow secuencial puede resolver el problema. Los workflows son más baratos y rápidos.
2. **Seguridad en el Bucle**: Siempre establece un `maxTurns`. Los agentes pueden entrar en bucles de herramientas si no se les limita.
3. **Claridad Semántica**: El éxito del Tool Calling depende de las descripciones. Usa `.describe()` en Zod para explicarle al modelo exactamente qué hace cada parámetro.
4. **Validación de Esquemas**: Trata las salidas del LLM como entradas inseguras; siempre valida con Zod antes de pasarlas a funciones críticas.