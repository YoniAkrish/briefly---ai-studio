# Roadmap

## Phase 1: MVP (Completed) ✅
*   **Core Functionality**: Audio/Video file upload support.
*   **AI Integration**: Full meeting summarization using `gemini-3-flash-preview`.
*   **Structured Data**: Extraction of Action Items, Decisions, and Sentiment.
*   **UI/UX**: Clean, responsive interface with loading states and error handling.
*   **Export**: One-click "Copy to Clipboard" functionality.

## Phase 2: Enhanced User Experience (Current) 🚧
*   **Large File Support**: Implement chunking or presigned URL uploads to handle files larger than ~20MB (Completed via Gemini Files API).
*   **Transcription View**: Display the raw text transcript alongside the summary using Gemini's transcription capabilities.
*   **Editable Results**: Allow users to edit the summary or action items before copying.
*   **Audio Playback**: Integrated audio player to listen to specific parts of the meeting while reading the summary.

## Phase 3: Persistence & Collaboration 🔮
*   **History**: Use LocalStorage or IndexedDB to save previous analyses.
*   **Backend Integration**: Integrate a lightweight backend (Firebase/Supabase) to store summaries in the cloud.
*   **PDF Export**: Generate professional PDF reports of the meeting notes.

## Phase 4: Advanced AI Features 🧠
*   **Chat with Meeting**: Add a chat interface to ask specific questions about the meeting (e.g., "What did John say about the budget?").
*   **Speaker Diarization**: improved identification of who said what (requires advanced audio processing).
*   **Calendar Integration**: Automatically create calendar invites or tasks (Jira/Asana) from Action Items.
