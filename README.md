# Briefly - Meeting Summarizer

Briefly is an intelligent web application designed to transform audio and video meeting recordings into concise, actionable summaries. Powered by Google's Gemini 3 models, it runs entirely in the browser to analyze content and extract key insights.

## 📚 Documentation

*   **[Architecture](./ARCHITECTURE.md)**: detailed breakdown of the client-side serverless design, tech stack, and data flow.
*   **[Roadmap](./ROADMAP.md)**: Future plans, upcoming features, and development phases.

## 🚀 Getting Started

### Prerequisites
*   Node.js installed (v16 or higher).
*   A valid **Google Gemini API Key**.

### Installation
1.  **Clone the repository**.
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Set the API Key**:
    *   Create a `.env` file in the root directory.
    *   Add: `VITE_API_KEY=your_api_key_here` (Note: In production, ensure your key is secured or use a backend proxy if strict security is required).
    *   *Note*: The current codebase expects `process.env.API_KEY`, which Vite defines for you if configured in `define` or via `.env` prefixed with `VITE_`.

### Running Locally
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### Deployment (GitHub Pages)
1.  Ensure `vite.config.ts` has the correct `base` path set to your repository name (currently `/briefly---ai-studio/`).
2.  Build the project:
    ```bash
    npm run build
    ```
3.  Upload the contents of the `dist` folder to your GitHub repository or use GitHub Actions to deploy.

## License

MIT License - feel free to use this in your own projects.
