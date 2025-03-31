#!/bin/sh

# Run the backend server
python app.py &

# Wait for the backend to start
cd client
rm -rf node_modules package-lock.json
npm install

# Set the environment variables for the frontend
export HOST=0.0.0.0
export VITE_HOST=0.0.0.0
export PORT=5173

# Start the frontend server
npm run dev
