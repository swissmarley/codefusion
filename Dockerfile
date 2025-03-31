# Build stage for React frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ .
RUN npm run build

# Python backend stage
FROM python:3.9-slim
WORKDIR /app

# Install Node.js and npm
RUN apt-get update && apt-get install -y nodejs npm && apt-get clean

# Copy frontend build
COPY --from=frontend-build /app/client/dist ./client/dist
COPY client/ ./client

# Install Python dependencies
COPY server/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY server/ .

# Environment variables
ENV FLASK_APP=app.py
ENV FLASK_ENV=production
ENV HOST=0.0.0.0
ENV PORT=5004

# Set up secrets for API keys
ENV SECRETS_DIR=/run/secrets
ENV OPENAI_API_KEY_FILE=/run/secrets/openai_key
ENV XAI_API_KEY_FILE=/run/secrets/xai_key

# Copy the launch script
COPY start_docker.sh .
RUN chmod +x start_docker.sh

# Expose port
EXPOSE 5004
EXPOSE 5173

# Run the script
CMD ["./start_docker.sh"]
