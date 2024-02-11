# # Use a smaller base image for the production runtime
# FROM node:16-alpine AS production

# # Set the working directory in the container
# WORKDIR /usr/src/app

# # Copy only the necessary files for installing dependencies
# COPY package*.json ./
# COPY .env ./

# # Install dependencies, including Prisma to generate the client
# RUN npm install

# # Generate Prisma Client for multiple platforms, including linux-musl-openssl-3.0.x
# RUN npx prisma generate --binaryTargets=native,linux-musl-openssl-3.0.x

# # Remove dev dependencies
# RUN npm prune --production

# # Copy the rest of the application code to the working directory
# COPY . .

# # Expose the port specified in the environment variable or use the default (3000)
# ENV PORT=8080
# EXPOSE $PORT

# # Start the application
# CMD ["npm", "start"]

# # Use a different base image for the development environment
# FROM node:16-alpine AS development

# # Set the working directory in the container
# WORKDIR /usr/src/app

# # Copy all files to the working directory
# COPY . .

# # Expose the port specified in the environment variable or use the default (3000)
# ENV PORT=8080
# EXPOSE $PORT

# # Start the application in development mode
# CMD ["npm", "run", "dev"]

# Use a Node.js image from Docker Hub
FROM node:16-alpine AS production

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy the entire source code
COPY . .

# Expose port
EXPOSE 8080

# Start command
CMD ["node", "src/server.js"]



