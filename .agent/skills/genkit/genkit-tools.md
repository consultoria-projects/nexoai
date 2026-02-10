---
name: genkit-tools
description: Experto en Tool Calling (Function Calling) con Genkit. Define herramientas, gestiona el bucle de ejecución automática, controla iteraciones con `maxTurns` y maneja herramientas dinámicas.
author: Gemini
version: 1.0.0
---

# Genkit Tool Calling Specialist

Eres un experto en dotar de capacidades de ejecución y acceso a datos en tiempo real a los modelos de IA mediante herramientas (tools).

## 📚 Referencia Oficial
- Documentación de Tools: https://genkit.dev/docs/tool-calling

## 🛠️ Definición de Herramientas (`defineTool`)
La definición debe ser clara, ya que el modelo usa el `name` y la `description` para decidir cuándo usarla.

```typescript
const getWeather = ai.defineTool(
  {
    name: 'getWeather',
    description: 'Obtiene el clima actual para una ubicación.',
    inputSchema: z.object({
      location: z.string().describe('La ciudad o región'),
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    // Lógica: llamada a API, DB, etc.
    return `Clima en ${input.location}: 22°C, Soleado.`;
  }
);
```

### El Bucle de Interacción (Tool Loop)
Genkit realiza este proceso de forma transparente en `ai.generate()` siempre que se pasen las herramientas en el array `tools`.

## 🔄 Control de Ejecución
- **maxTurns**: Crucial para evitar bucles infinitos o gastos excesivos. Por defecto es 5. Auméntalo para agentes de investigación complejos.
- **Streaming**: En un stream, las herramientas aparecen como partes de contenido tipo `toolRequest` y `toolResponse`.

## ⚡ Herramientas Dinámicas y Avanzadas
### `tool()` vs `defineTool()`
- **`ai.defineTool`**: Se registra globalmente. Visible en Genkit Dev UI. Recomendado para la mayoría de casos.
- **`tool()`**: Definición en tiempo de ejecución (dentro de un Flow). Útil para herramientas que dependen del contexto del usuario. No se registran en la UI de desarrollo.

### Pausar la Ejecución (Interrupts)
Si una herramienta no tiene función de implementación, Genkit detendrá el bucle, permitiendo intervención humana o aprobación manual.

## 🔗 Integración con MCP
Las herramientas de servidores MCP externos se integran directamente:
```typescript
tools: await mcpHost.getActiveTools(ai);
```

## ⚠️ Reglas Pro de Arquitectura
1. **Descripciones Semánticas**: Usa `.describe()` en Zod. El modelo "lee" estas descripciones para entender los parámetros.
2. **Determinismo**: Usa herramientas para cálculos matemáticos o reglas de negocio rígidas donde el LLM suele fallar.
3. **Manejo de Errores**: Si una herramienta falla, el modelo recibirá el error y podrá intentar corregir el input o informar al usuario.