FROM node:20-slim

WORKDIR /usr/src/app

# Copy the server's package.json to the current directory
COPY server/package*.json ./

# Install dependencies for the server
RUN npm install

# Copy the entire server directory
COPY server . 

# Set environment variables
ENV NODE_ENV=production

# Expose the port for the server
EXPOSE 3000

# Run the server
CMD ["node", "index.js"] && cd client && npm start
