#  Collabo: Autonomous Content Factory

Collabo is an AI-powered content generation platform that uses a multi-agent system to transform raw source material (or a URL) into a polished, multi-channel marketing campaign. 

Instead of relying on a single LLM prompt, Collabo orchestrates a team of specialized AI agents—a **Researcher**, a **Copywriter**, and an **Editor**—to ensure the final output is factually accurate, perfectly formatted, and perfectly aligned with your brand voice.

##  Key Features

* **Multi-Agent Architecture:** Powered by CrewAI, tasks are divided logically. The Researcher extracts facts, the Copywriter crafts the narrative, and the Editor fact-checks against hallucinations.
* **Web Scraping Capabilities:** Paste a URL as your source material, and the AI will scrape the site to extract the core value propositions automatically.
* **Real-Time SSE Streaming:** Watch the agents collaborate in real-time with live status updates streaming to the UI.
* **Dynamic Brand Voice:** Enforce your company's specific tone, target audience, and custom rules across all generated assets.
* **Granular Control:** Adjust model creativity, enforce target keywords, and inject Call-to-Action (CTA) URLs via Advanced Settings.
* **Targeted Regeneration:** Need a different Twitter thread but like the Blog post? Regenerate specific channels on the fly.
* **Supabase Integration:** Secure user authentication and persistent campaign history.

##  Tech Stack

**Frontend**
* [Next.js](https://nextjs.org/) (React framework)
* [Tailwind CSS](https://tailwindcss.com/)
* [Supabase](https://supabase.com/) (Auth & Postgres DB)
* [React Markdown](https://github.com/remarkjs/react-markdown)

**Backend**
* [FastAPI](https://fastapi.tiangolo.com/) (Python web framework)
* [CrewAI](https://crewai.com/) (Multi-agent orchestration)
* [Groq](https://groq.com/) (Fast LLM inference using Llama 3.1)
* [SSE-Starlette](https://github.com/sysid/sse-starlette) (Server-Sent Events)

##  Getting Started

### Prerequisites
* Node.js (v18+)
* Python (3.10+)
* A [Groq](https://console.groq.com/) API Key
* A [Supabase](https://supabase.com/) Project

