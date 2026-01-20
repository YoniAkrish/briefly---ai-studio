# Briefly - Meeting Summarizer

Briefly is an intelligent web application designed to transform audio and video meeting recordings into concise, actionable summaries. Powered by Google's Gemini 3 models, it runs entirely in the browser to analyze content and extract key insights.

## 📚 Documentation

*   **[Architecture](./ARCHITECTURE.md)**: detailed breakdown of the client-side serverless design, tech stack, and data flow.
*   **[Roadmap](./ROADMAP.md)**: Future plans, upcoming features, and development phases.

## 🚀 Getting Started

### Prerequisites
*   A valid **Google Gemini API Key**.
*   A modern web browser (Chrome, Edge, Firefox, Safari).

### Installation & Running
1.  **Clone the repository** (or download the files).
2.  **Set the API Key**:
    *   Create a `.env` file or export `API_KEY` in your environment.
    *   *Note*: For local testing without a build step, you may need to temporarily hardcode the key in `services/geminiService.ts` (Ensure you **never** commit this key).
3.  **Serve the application**:
    *   Run a local HTTP server in the root directory.
    *   Examples:
        *   `npx serve`
        *   `python3 -m http.server`
        *   VS Code "Live Server" extension.

## License

MIT License - feel free to use this in your own projects.
