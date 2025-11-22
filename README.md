ChatMate 🤖
A real-time chatbot application inspired by ChatGPT, powered by Grok's advanced AI model with web search capabilities and temporary memory storage.

ChatMate is a minimal yet powerful AI chatbot built with Node.js and vanilla JavaScript — no heavy frameworks. It integrates Grok LLM, Tavily search, and NodeCache to enable contextual, realtime, and web-referenced conversations for 24 hours — perfect for learning, experimenting, or deploying your own AI assistant.

✨ Features
-> Real-time Conversations: Instant responses using Grok's llama-3.3-70b-versatile model
-> Web Search Integration: Powered by Tavily for up-to-date information
-> Temporary Memory: 24-hour conversation memory using NodeCache
-> Modern UI: Clean, responsive interface built with Tailwind CSS
-> Lightweight: Pure HTML, CSS, and JavaScript - no heavy frameworks


🛠️Tech Stack
-> Frontend: HTML5, Tailwind CSS, Vanilla JavaScript
-> Backend: Node.js with Express
-> AI Model: Grok SDK with llama-3.3-70b-versatile
-> Web Search: Tavily API
-> Memory: NodeCache (24-hour TTL)
-> Real-time Updates: Server-Sent Events (SSE)


💡 Usage
-> Start a Conversation: Type your message in the input field
-> Real-time Responses: Watch as the AI generates responses in real-time
-> Web Search: The chatbot automatically searches the web when needed
-> Context Memory: The bot remembers your conversation for 24 hours


⚡ How It Works
-> User enters a message in UI
-> Frontend sends request to backend
-> Backend checks memory in NodeCache
-> If needed, Tavily fetches realtime web data
-> Grok model (llama-3.3-70b-versatile) generates response
-> Response streams back to UI in realtime
-> Memory stored for 24 hours → better conversations


🔒 Privacy & Security
-> Conversations are stored temporarily (24 hours) in memory only
-> No persistent database storage
-> All data is cleared automatically after 24 hours
-> API keys are stored securely in environment variables

🤝 Contributing
-> PRs, issues & feature requests are welcome!


✨ Author
Tanvy Verma
Feel free to connect & collaborate!
