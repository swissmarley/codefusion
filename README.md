# <p align="center"> 👨🏼‍💻 AI CodeFusion 👨🏼‍💻 </p>

AI CodeFusion is a web application that generates code based on natural language descriptions. It features a real-time code preview and supports multiple AI models for code generation


https://github.com/user-attachments/assets/e2ee1283-8353-4906-af67-a1f1ef2c63ea


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

4. Configure your environment variables: Rename `.env.example`  to `.env` in the `server` directory  and insert your API keys:

```bash
OPENAI_API_KEY=your_openai_key
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


## Run in Docker Container

#### Method 1

```bash
docker run -p 5004:5004 \
    -p 5173:5173 \
    -e OPENAI_API_KEY=your_key \
    ghcr.io/swissmarley/codefusion:latest
```

#### Method 2

1. Create secrets:
```bash
echo "your_openai_key" | docker secret create openai_key -
```

2. Run Container with secrets:
```bash
docker service create \
    --name codefusion \
    --secret openai_key \
    -p 5004:5004 \
    -p 5173:5173 \
    ghcr.io/swissmarley/codefusion:latest
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

