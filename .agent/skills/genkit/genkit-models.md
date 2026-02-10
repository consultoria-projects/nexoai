---
name: genkit-models
description: Experto en generación de contenido con Genkit. Maneja `ai.generate`, `ai.generateStream`, salida estructurada con Zod, prompts multimodales (imágenes/audio) y middleware (retry/fallback).
author: Gemini
version: 1.0.0
---

# Genkit Model & Generation Specialist

Eres un experto en la interfaz unificada de modelos de Genkit. Tu objetivo es maximizar la calidad de las respuestas mediante el uso correcto de parámetros, esquemas y resiliencia.

## 📚 Referencia Oficial
- Documentación de Modelos: https://genkit.dev/docs/models

## 🛠️ El Método `generate()`
Es la interfaz principal. Siempre prefiere el uso de referencias de modelo tipadas:

```typescript
const response = await ai.generate({
  model: googleAI.model('gemini-2.5-flash'),
  prompt: 'Texto del prompt',
  system: 'Instrucciones de rol/tono', // Opcional
});
```

### Parámetros Críticos de Configuración (config)
- **temperature**: (0.0 - 2.0) Controla la creatividad. 0.0 es determinista.
- **maxOutputTokens**: Límite de tokens de salida.
- **stopSequences**: Secuencias que detienen la generación.

## 💎 Salida Estructurada (Zod)
Es obligatorio usar Zod para aplicaciones programáticas. Genkit se encarga de inyectar las instrucciones de formato y parsear el JSON.

```typescript
const Schema = z.object({ item: z.string(), precio: z.number() });
const { output } = await ai.generate({
  prompt: '...',
  output: { schema: Schema },
});
// output está tipado automáticamente como z.infer<typeof Schema>
```
**Tip**: Usa `z.coerce` en los esquemas para mitigar errores cuando el modelo devuelve números como strings.

## 🌊 Streaming Avanzado
- **Texto**: Itera con `for await (const chunk of stream)`.
- **Estructurado**: Cada `chunk.output` es el objeto acumulado y actualizado. El último chunk contiene el objeto completo.

## 🖼️ Multimodalidad (Media)
Para modelos compatibles (Gemini 1.5+), envía arrays de partes:

```typescript
prompt: [
  { media: { url: 'https://...', contentType: 'image/jpeg' } },
  { text: 'Describe esta imagen' }
]
```
Soporta URLs HTTPS, Google Cloud Storage (`gs://`) y Data URLs (base64).

## 🛡️ Resiliencia con Middleware
Usa el parámetro `use: [...]` para añadir capas de robustez:
- **`retry()`**: Reintenta fallos de red o cuotas agotadas.
- **`fallback()`**: Si el modelo principal falla (ej. RESOURCE_EXHAUSTED), cambia automáticamente a otro (ej. de Pro a Flash).
- **Custom**: Puedes crear loggers o validadores de seguridad personalizados.

## ⚠️ Errores y Limitaciones
- **Output Null**: Si el modelo no cumple el esquema Zod, `output` será `null`. Siempre valida o usa reintentos.
- **System Roles**: En MCP prompts o ciertos modelos, verifica si el rol `system` está permitido.