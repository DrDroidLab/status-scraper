# Use official Playwright image with all dependencies
FROM mcr.microsoft.com/playwright:v1.43.1-jammy

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose your app's port
EXPOSE 4000

# Run your app using npm start
CMD ["npm", "start"]
