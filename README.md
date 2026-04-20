# Enterprise AI Support Assistant

A professional, industry-grade AI Chatbot dashboard built with **React 19**, **TypeScript**, and **Tailwind CSS 4.0**.

## 🚀 Features

- **Subtle & Sophisticated UI**: A muted Zinc & Slate color palette designed for focused, enterprise environments.
- **Advanced Dashboard Layout**: Includes workspace switching, navigation sidebar, and secure session management.
- **Rich Message Support**: Fully supports Markdown rendering with professional code syntax highlighting (via Prism/Syntax Highlighter).
- **Session Persistence**: Chat history is automatically persisted to `localStorage` for seamless resumption.
- **Modern Interactions**: Smooth transitions and micro-animations powered by **Framer Motion**.
- **Responsive Workspace**: Designed for productivity across mobile and desktop environments.

## 🛠️ Tech Stack

- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS 4.0
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Markdown**: React Markdown + Remark GFM
- **Code Highlighting**: React Syntax Highlighter (vscDarkPlus theme)

## 📁 Project Structure

```text
src/
├── components/   # Reusable UI components (ChatMessage, ChatInput, etc.)
├── hooks/        # Custom React hooks (useChat for business logic)
├── lib/          # Utilities and helper functions
├── data/         # Mock data and FAQ knowledge base
├── types/        # TypeScript interfaces and types
└── index.css     # Global styles and Tailwind 4 configuration
```

## 🚥 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

## 🔒 Security & Best Practices

- **Clean Commit History**: No default template artifacts or unused assets.
- **Environment Isolation**: Configured `.gitignore` to protect `.env` secrets.
- **Standardized Code**: ESLint and TypeScript pre-configured for enterprise standards.

---
Built with excellence by **Antigravity AI**.
