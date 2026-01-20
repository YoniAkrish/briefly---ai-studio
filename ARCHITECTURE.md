# Architecture

Briefly follows a **Client-Side Serverless Architecture**. It leverages the capabilities of modern browsers and the direct-to-API capabilities of the Google GenAI SDK.

## High-Level Data Flow

1.  **Input**: User selects an audio or video file via the `FileUpload` component.
2.  **Preprocessing**: 
    *   **Small Files (< 10MB)**: The browser's `FileReader` API converts the binary media into a Base64 string (inline data).
    *   **Large Files (> 10MB)**: The app uses the **Gemini Files API** (resumable upload) to upload the raw binary to Google's servers, obtaining a `fileUri`.
3.  **AI Processing**: The `geminiService` sends the data (Base64 or `fileUri`) + a system prompt to the Google Gemini API (`gemini-3-flash-preview`).
    *   *Note*: We use the Flash model for its large context window and multimodal capabilities, essential for processing long meeting recordings.
4.  **Structured Output**: Gemini returns a JSON object enforcing a strict schema (Summary, Action Items, Decisions, Sentiment).
5.  **Rendering**: The React frontend parses the JSON and renders the `AnalysisResult` component.

## Tech Stack

*   **Frontend Framework**: React 19 (Hooks, Functional Components)
*   **Styling**: Tailwind CSS (Utility-first, Responsive)
*   **AI Integration**: `@google/genai` SDK
*   **Icons**: Custom SVG components (Lucide-style)
*   **Build/Runtime**: ES Modules directly via `importmap` (No heavy bundler required for this specific setup).

## Directory Structure

```text
/
├── index.html              # Entry point & Import Maps
├── index.tsx               # React Root
├── App.tsx                 # Main Application State & Layout
├── types.ts                # TypeScript Interfaces (Data Models)
├── services/
│   └── geminiService.ts    # AI Logic, API Configuration & File Upload Strategy
└── components/
    ├── FileUpload.tsx      # Drag-and-drop Logic
    ├── AnalysisResult.tsx  # Data Visualization
    └── Icons.tsx           # SVG Assets
```
