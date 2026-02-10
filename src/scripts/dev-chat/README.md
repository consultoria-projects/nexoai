# Dev Chat CLI

Interactive terminal tool for testing the Budget Wizard AI agent.

## Prerequisites

The dev server must be running:
```bash
npm run dev
```

## Usage

In a **separate terminal**:
```bash
npx tsx src/scripts/dev-chat/cli.ts
```

## Commands

| Command | Description |
|---------|-------------|
| `/status` | Show current extracted requirements |
| `/generate` | Generate budget from current requirements |
| `/reset` | Clear conversation and start over |
| `/exit` | Exit the CLI |

## Example Session

```
👤 You: Hola, quiero reformar mi cocina de 15m2
🤖 Conserje: ¡Hola! Entendido, una reforma de cocina de 15m². ¿Qué tipo de reforma?

👤 You: Integral, quiero cambiar todo
🤖 Conserje: Perfecto. ¿Qué calidad de materiales? ¿Básica, media o premium?

👤 You: Media
🤖 Conserje: Anotado. ¿Presupuesto objetivo?

👤 You: 15000 euros
✅ Requirements complete! Type /generate to create budget.

👤 You: /generate
🚀 Generating budget...
   Total Estimated: €14,532.50
```

## Notes

- Calls the `/api/dev-chat` endpoint (dev-only).
- Useful for testing agent behavior and prompt changes.
