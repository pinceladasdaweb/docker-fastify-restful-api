FROM node:16.17.1-alpine

LABEL maintainer="Pedro Rogério"

# Set the working directory
WORKDIR /usr/src/app

# Copy source code
COPY --chown=node:node package*.json ./

# Running npm install
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

# Copy the rest of your app's source code from your host to your image filesystem.
COPY --chown=node:node . .

# Switch to 'node' user
USER node

# Open the mapped port
EXPOSE 3000

CMD ["node", "src/index.js"]
