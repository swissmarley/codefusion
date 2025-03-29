# <p align="center"> 👨🏼‍💻 AI CodeFusion 👨🏼‍💻 </p>

AI CodeFusion is a web application that generates code based on natural language descriptions. It features a real-time code preview and supports multiple AI models for code generation.

## Features

- 🤖 Code generation from natural language descriptions
- 📝 Real-time code streaming with visual feedback
- 👀 Live preview for HTML/CSS/JS code
- 🌓 Dark/Light theme support
- ✨ Code enhancement and modification capabilities
- 📋 One-click code copying

## Tech Stack

### Frontend
- React 18
- Vite
- Axios for HTTP requests
- Lucide React for icons

### Backend
- Flask
- Flask-CORS
- OpenAI API
- Anthropic Claude API (optional)
- Google Gemini API (optional)
- xAI Grok API (optional)

## Getting Started

### Prerequisites

- Node.js 16+
- Python 3.9+
- API keys for the AI providers you plan to use

### Installation

1. Clone the repository:
```bash
git clone https://github.com/swissmarley/codefusion.git
cd codefusion
```

2. Set up the backend:
```bash
cd server
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

3. Set up the frontend:
```bash
cd client
npm install
```

4. Configure your environment variables: Create a `.env` file in the `server` directory with your API keys:

```bash
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
GEMINI_API_KEY=your_gemini_key
XAI_API_KEY=your_xai_key
```

## Running the App

1. Start the backend server:
```bash
cd server
python app.py
```

2. Start the frontend development server:
```bash
cd client
npm run dev
```

3. Open `http://localhost:5173` in your browser


## Usage

1. Enter a description of the code you want to generate in the main text area

2. Click `Generate Code` to create the initial code

3. Use the enhancement section to modify or extend the generated code

4. View the live preview (for HTML/CSS/JS code)

5. Copy the generated code using the clipboard button


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

