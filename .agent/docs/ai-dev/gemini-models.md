# Gemini Models Guide (Genkit)

This document lists the available Google AI models and their recommended use cases within our Genkit architecture.

## 🚀 Available Models (Real-time List)
*Generated via `list-models.ts` output.*

| Model Name | Version | Capabilities | Recommended Use |
| :--- | :--- | :--- | :--- |
| **gemini-2.0-flash-lite** | `2.0` | Fast, Lower Cost | **Router / Classifier**: Use for initial intent detection or simple boolean logic. |
| **gemini-2.0-flash** | `2.0` | Balanced Speed/Quality | **Public Agent ("Concierge")**: Ideal for conversational flows, entity extraction, and maintaining fast response times. |
| **gemini-2.5-flash** | `001` | Enhanced Flash | **Structure Extraction**: Use for converting unstructured text/audio transcripts into `BudgetRequirement` JSON objects. |
| **gemini-2.5-pro** | `2.5` | Reasoning & Vision | **Admin Agent ("Estimator")**: Use for complex reasoning, `analyzePlan` (Vision), and detailed line-item generation. |
| **gemini-embedding-001** | `001` | Vectors | **Semantic Search**: Specifically for `vectorize-price-book` and `semantic-search` use cases. |

### Specialized Models
- **`gemini-2.5-flash-native-audio-preview-12-2025`**: Experimental model with native audio understanding.
    - *Usage*: Use in the **Public Agent** for direct processing of voice notes without a separate STT (Speech-to-Text) step if Genkit supports the multimedia input directly.

## 🏗 Architecture Mapping

### 1. Public Agent ("The Concierge")
- **Primary Model**: `gemini-2.0-flash`
- **Why**: Needs to be snappy for the chat interface. Flash 2.0 is significantly faster and smarter than 1.5.
- **Task**: Conversation state management, simple questions.

### 2. Admin Agent ("The Estimator")
- **Primary Model**: `gemini-2.5-pro`
- **Why**: Deep reasoning required to infer "demolition" from "new floor installation".
- **Task**: Complex tool calling (`searchPriceBook`, `analyzePlan`).

### 3. Plan Analyzer (Vision)
- **Primary Model**: `gemini-2.5-pro`
- **Why**: Best-in-class vision capabilities for reading blueprints and sketches.

## ⚠️ Implementation Notes
- **Model Names**: When initializing in Genkit, use the exact string (e.g., `googleAI.model('gemini-2.0-flash')`).
- **Safety Settings**: For "Construction" context, we can generally use loose safety settings, but filter for hate/harassment.
- **Multimodal**: Ensure `BudgetWizardChat` supports sending `application/pdf` or `image/*` as base64 or public URLs for the Vision models to work.
