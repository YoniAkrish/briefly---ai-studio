# Briefly - Meeting Summarizer

Briefly is an intelligent web application designed to transform audio and video meeting recordings into concise, actionable summaries. Powered by Google's Gemini 3 models, it runs entirely in the browser to analyze content and extract key insights.

## 🏗 Architecture

Briefly follows a **Client-Side Serverless Architecture**. It leverages the capabilities of modern browsers and the direct-to-API capabilities of the Google GenAI SDK.

### High-Level Data Flow

1.  **Input**: User selects an audio or video file via the `FileUpload` component.
2.  **Preprocessing**: The browser's `FileReader` API converts the binary media into a Base64 string.
3.  **AI Processing**: The `geminiService` sends the Base64 data + a system prompt to the Google Gemini API (`gemini-3-flash-preview`).
    *   *Note*: We use the Flash model for its large context window and multimodal capabilities, essential for processing long meeting recordings.
4.  **Structured Output**: Gemini returns a JSON object enforcing a strict schema (Summary, Action Items, Decisions, Sentiment).
5.  **Rendering**: The React frontend parses the JSON and renders the `AnalysisResult` component.

### Tech Stack

*   **Frontend Framework**: React 19 (Hooks, Functional Components)
*   **Styling**: Tailwind CSS (Utility-first, Responsive)
*   **AI Integration**: `@google/genai` SDK
*   **Icons**: Custom SVG components (Lucide-style)
*   **Build/Runtime**: ES Modules directly via `importmap` (No heavy bundler required for this specific setup).

### Directory Structure

```text
/
├── index.html              # Entry point & Import Maps
├── index.tsx               # React Root
├── App.tsx                 # Main Application State & Layout
├── types.ts                # TypeScript Interfaces (Data Models)
├── services/
│   └── geminiService.ts    # AI Logic & API Configuration
└── components/
    ├── FileUpload.tsx      # Drag-and-drop Logic
    ├── AnalysisResult.tsx  # Data Visualization
    └── Icons.tsx           # SVG Assets
```

---

## 🗺 Roadmap

### Phase 1: MVP (Completed) ✅
*   **Core Functionality**: Audio/Video file upload support.
*   **AI Integration**: Full meeting summarization using `gemini-3-flash-preview`.
*   **Structured Data**: Extraction of Action Items, Decisions, and Sentiment.
*   **UI/UX**: Clean, responsive interface with loading states and error handling.
*   **Export**: One-click "Copy to Clipboard" functionality.

### Phase 2: Enhanced User Experience (Next Steps) 🚧
*   **Large File Support**: Implement chunking or presigned URL uploads to handle files larger than ~20MB (browser memory limit).
*   **Transcription View**: Display the raw text transcript alongside the summary using Gemini's transcription capabilities.
*   **Editable Results**: Allow users to edit the summary or action items before copying.
*   **Audio Playback**: Integrated audio player to listen to specific parts of the meeting while reading the summary.

### Phase 3: Persistence & Collaboration 🔮
*   **History**: Use LocalStorage or IndexedDB to save previous analyses.
*   **Backend Integration**: Integrate a lightweight backend (Firebase/Supabase) to store summaries in the cloud.
*   **PDF Export**: Generate professional PDF reports of the meeting notes.

### Phase 4: Advanced AI Features 🧠
*   **Chat with Meeting**: Add a chat interface to ask specific questions about the meeting (e.g., "What did John say about the budget?").
*   **Speaker Diarization**: improved identification of who said what (requires advanced audio processing).
*   **Calendar Integration**: Automatically create calendar invites or tasks (Jira/Asana) from Action Items.

## 🚀 Getting Started

1.  Ensure you have a valid **Google Gemini API Key**.
2.  Set the `API_KEY` in your environment (or hardcode for testing purposes in `geminiService.ts` **only if running locally and securely**).
3.  Serve the root directory using a simple HTTP server (e.g., `npx serve`, Python `http.server`, or VS Code Live Server).
