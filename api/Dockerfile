# Use an official Node runtime as a parent image
FROM node:latest

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files into the container at /app
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code into the container at /app
COPY . .

# Generate the Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Expose the port that the application will run on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]