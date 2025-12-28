# Dockerfile for Dazzling Tours Next.js Application
# Optimized for Render.com deployment
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port (Render will set PORT environment variable)
EXPOSE 3000

# Start the application
# Next.js automatically uses PORT env var if set by Render
CMD ["npm", "start"]
