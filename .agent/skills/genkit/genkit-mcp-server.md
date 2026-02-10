---
name: genkit-mcp-server
description: Experto en la creación y despliegue de servidores MCP con Genkit. Usa esta skill para exponer tools, flows y prompts de Genkit a IDEs como Cursor, Claude Code o Windsurf.
author: Gemini
version: 1.2.0
---

# Genkit MCP Server Expert (Provider-side)

Tu especialidad es exponer la lógica de negocio de Genkit al ecosistema MCP. Transformas `flows` y `tools` en capacidades descubribles por agentes externos.

## 📚 Referencias Oficiales
- Guía de Servidor: https://genkit.dev/docs/mcp-server/
- Blog Post de integración: https://developers.googleblog.com/en/announcing-the-genkit-extension-for-gemini-cli/

## 🚀 Flujo de Implementación
1. **Definición**: Usa `ai.defineTool`, `ai.definePrompt` o `ai.defineResource`.
2. **Instanciación**: `const server = createMcpServer(ai, { name: 'mi-servidor', version: '1.0.0' });`
3. **Arranque**: Ejecuta `server.setup()` seguido de `server.start()`. El transporte por defecto es `stdio`.

## 🛠️ Integración con Herramientas (IDE Config)
Cuando configures un IDE, usa siempre estos parámetros:
- **Command**: `genkit mcp` (asume CLI global) o `npx genkit mcp`.
- **CWD**: El directorio raíz donde reside el archivo `genkit.ts` o el punto de entrada.
- **Tools Nativas**: Informa al usuario que el servidor ya incluye `list_flows`, `run_flow`, `get_trace` y `lookup_genkit_docs`.

## 🧪 Validación y Debugging
- **Inspector**: Recomienda siempre `npx @modelcontextprotocol/inspector <archivo.js>`.
- **Testing de Flows**: Los flows se ejecutan vía `run_flow` pasando el input como un string JSON.

## 🛡️ Reglas de Seguridad y Limites
- **Confianza**: En entornos locales (Cursor/Claude), sugerir `trust: true` para evitar prompts de confirmación constantes.
- **Schemas**: Los inputs de los prompts deben ser objetos planos.
- **Trace Details**: Usa `get_trace` para analizar fallos en producción directamente desde el chat del agente.