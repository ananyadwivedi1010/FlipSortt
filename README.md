# FlipSort 🛡️

**FlipSort** is an advanced AI-powered product analysis and integrity enforcement tool designed specifically for the Flipkart ecosystem. It helps users and brands detect fake reviews, identify counterfeit products, and analyze sentiment using state-of-the-art AI models.


## 📽️ Demo Video
[Click here to watch the demo](https://go.screenpal.com/watch/cOVT27n32fi)




## 🌟 Features

*   **Real-time Scraper**: Fetches live product data (pricing, ratings, reviews, specifications) from Flipkart URLs.
*   **AI Analysis Engine**: Uses **Groq (Llama 3.3 70B)** to analyze product reviews and descriptions.
*   **Fake Review Detection**: Identifies bot activity, repetitive phrasing, and suspicious patterns in user reviews.
*   **Counterfeit Detection**: Analyzes product details and seller information to flag potential counterfeits.
*   **Sentiment Analysis**: Breaks down user feedback into positive, neutral, and negative sentiment.
*   **Interactive Dashboard**: Visualizes data using dynamic charts and scores for Performance, Durability, and Pricing.
*   **AI Chat Assistant**: A built-in chatbot ("FlipSort AI") to answer questions about the analyzed product.

## 🛠️ Tech Stack

### Frontend
*   **Framework**: [React](https://react.dev/) (v19) with [Vite](https://vitejs.dev/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **State/API**: React Hooks, Axios
*   **Visualization**: [Recharts](https://recharts.org/)
*   **AI Integration**: Groq SDK for browser-side AI interactions

### Backend
*   **Runtime**: [Node.js](https://nodejs.org/)
*   **Server**: [Express.js](https://expressjs.com/)
*   **Scraping**: [Puppeteer](https://pptr.dev/) (Headless Chrome)

## 🧠 Under the Hood: How It Works

FlipSort operates on a sophisticated pipeline that combines headless browsing, structural data extraction, and Large Language Model (LLM) analysis.

### 1. Data Ingestion & Scraping Strategy
The backend (`/backend/index.js`) uses **Puppeteer** to act as a human-like browser agent.
*   **Anti-Detection**: It launches a browser instance with stealth arguments and sets a realistic User-Agent to bypass basic bot protection.
*   **Lazy Loading Handling**: It implements intelligent scrolling logic to trigger dynamic content loading (like reviews and detailed specs) that only appears when a user scrolls down.
*   **Triple-Layer Extraction Strategy**:
    1.  **JSON-LD (Gold Standard)**: First, it attempts to parse the structured SEO data embedded in the page's `<script type="application/ld+json">`. This provides the most accurate pricing and metadata.
    2.  **CSS Selectors**: If JSON-LD is missing, it falls back to specific CSS selectors (e.g., `_30jeq3` for price, `_3LWZlK` for ratings) targeted at Flipkart's current DOM structure.
    3.  **Regex Fallback**: As a final failsafe, it scans the raw text of the page using regular expressions to find patterns like prices (`₹599`) or ratings (`4.5 ★`).

### 2. The AI Analysis Pipeline
Once the backend extracts the raw data (including the first ~10 reviews, full description, and specs), it is sent to the Frontend, which forwards it to the **Groq API**.
*   **Model**: We use **Llama 3.3 70B Versatile**, a massive 70-billion parameter open-source model optimized for complex reasoning.
*   **Prompt Engineering**: the system constructs a precise prompt instructing the AI to act as a "Product Integrity Analyst".
    *   It feeds the raw reviews into the model context.
    *   It asks the model to perform **LDA (Latent Dirichlet Allocation)** topic modeling to find what users are talking about (e.g., "Battery Drain", "Camera Quality").
    *   It requests an **Authenticity Score** by analyzing review patterns for bot-like repetition or generic phrasing.
*   **Output**: The AI returns a strictly formatted JSON object containing sentiment distribution, keyword extraction, and a final "Fake or Genuine" verdict.

### 3. Real-Time Visualization
The React frontend takes this JSON response and renders it immediately:
*   **Confidence Scores**: Displayed as radial charts.
*   **Sentiment**: Visualized as a bar distribution (Positive/Neutral/Negative).
*   **Chat Assistant**: The `ChatAssistant` component maintains a conversation context with the LLM, allowing users to ask "Is the camera good for night shots?" and get answers based strictly on the scraped user reviews.

## 📦 Installation & Run Instructions

This project requires **Node.js** (v18+) and **npm**.

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Flipsort
```

### 2. Setup Backend (The Scraper)
Open a terminal and run:
```bash
cd backend
npm install
npm start
```
*   The server will start on `http://localhost:3001`.
*   Keep this terminal running.

### 3. Setup Frontend (The Dashboard)
Open a **new** terminal and run:
```bash
cd frontend
npm install
```

**Configure Environment Variables:**
Create a `.env` file in the `frontend` directory and add your Groq API Key:
```env
VITE_GROQ_API_KEY=your_groq_api_key_here
```

**Run the Frontend:**
```bash
npm run dev
```
*   The app will open at `http://localhost:5173` (or similar).

