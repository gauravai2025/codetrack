FROM node:18-alpine

# Set working directory
WORKDIR /app

# Update package repository and install necessary packages
RUN apk update && \
    apk add --no-cache g++ openjdk11 python3

# Copy package.json and install dependencies
COPY package.json .
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port
EXPOSE 3000

# Command to run the application
CMD ["node", "index.js"]
