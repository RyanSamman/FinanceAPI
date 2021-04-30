# Using an Alpine-based LTS Version of Node.js for the base image
FROM node:14-alpine as base

# Creating a Directory for application
WORKDIR /home/node/app

# Installing Dependencies
COPY package.json ./
RUN yarn

# Copying the rest of the application to the working directory
COPY . .

# Production Image
FROM base as production

# Build application
RUN yarn build