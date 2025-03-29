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

# Copy frontend build
COPY --from=frontend-build /app/client/dist ./client/dist

# Install Python dependencies
COPY server/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY server/ .

# Environment variables
ENV FLASK_APP=app.py
ENV FLASK_ENV=production
ENV HOST=0.0.0.0
ENV PORT=5000

# Set up secrets for API keys
ENV SECRETS_DIR=/run/secrets
ENV OPENAI_API_KEY_FILE=/run/secrets/openai_key
ENV ANTHROPIC_API_KEY_FILE=/run/secrets/anthropic_key

# Expose port
EXPOSE 5000

# Run the application
CMD ["python", "app.py"]