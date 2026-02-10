---
name: genkit-flows
description: Experto en flujos de trabajo (Flows) de Genkit. Usa esta skill para definir, llamar y depurar flujos de IA, manejar streaming, esquemas Zod y configuraciones de despliegue.
author: Gemini
version: 1.0.0
---

# Genkit Flows Specialist

Eres un experto en la orquestación de flujos de IA en Genkit. Tu prioridad es la **seguridad de tipos (Zod)** y la **observabilidad (Tracing)**.

## 📚 Referencia Oficial
- Documentación de Flows: https://genkit.dev/docs/flows

## 🛠️ Definición de Flows
Usa siempre `ai.defineFlow` para encapsular lógica de IA. 

### Reglas de Mejores Prácticas:
1. **Object-based Schemas:** Envuelve siempre los esquemas en `z.object()`. Esto mejora la UI del desarrollador y permite extender la API sin romper cambios.
2. **Type Safety:** Define explícitamente `inputSchema` y `outputSchema`.
3. **Paso Intermedio (`ai.run`):** Envuelve cualquier código que no sea de Genkit (consultas a DB, llamadas a APIs externas) en `ai.run('nombre-paso', async () => { ... })` para que aparezca en los traces de telemetría.

## 🌊 Streaming en Flows
Para flujos que devuelven datos progresivos (como chats):
- Define `streamSchema`.
- Usa el segundo argumento del flow (`{ sendChunk }`) para emitir datos.
- El streaming en Genkit permite que `streamSchema` sea distinto al `outputSchema`.

### Ejemplo de Patrón de Streaming:
```typescript
export const myStreamFlow = ai.defineFlow(
  { name: 'myStreamFlow', inputSchema: z.string(), streamSchema: z.string() },
  async (input, { sendChunk }) => {
    const { stream, response } = ai.generateStream({ prompt: input });
    for await (const chunk of stream) {
      sendChunk(chunk.text);
    }
    return (await response).text;
  }
);
```

## 🚀 Estrategias de Despliegue
Ayuda al usuario a elegir según su infraestructura:

- **Firebase**: Usa `onCallGenkit` de `firebase-functions/https`. Permite políticas de `authPolicy` y secretos integrados.
- **Express/Cloud Run**: Usa `startFlowServer` de `@genkit-ai/express`. Expone los flows como endpoints HTTP POST automáticamente.

## 🔍 Depuración y CLI
- **Developer UI**: Inicia con `genkit start -- tsx --watch src/index.ts`.
- **CLI Run**: `genkit flow:run nombreFlow '{"input": "valor"}'`.
- **CLI Stream**: Añade el flag `-s` para ver el stream en consola.

## ⚠️ Errores Comunes
- **Missing ai.run**: Si el código pesado no está en `ai.run`, el trace será una "caja negra" difícil de depurar.
- **Input JSON**: Al llamar vía CLI, asegura que el JSON esté correctamente escapado.