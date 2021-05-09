FROM node:16-alpine

LABEL maintainer="Pedro Rogério"

# Set the working directory
WORKDIR /usr/src/app

# Copy source code
COPY package*.json ./

# Running npm install
RUN npm install --only=production

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Create a user group 'nodegroup'
RUN addgroup -S nodegroup

# Create a user 'nodeuser' under 'nodegroup'
RUN adduser -S -D -h /usr/src/app nodeuser nodegroup

# Chown all the files to the app user.
RUN chown -R nodeuser:nodegroup /usr/src

# Switch to 'nodeuser'
USER nodeuser

# Open the mapped port
EXPOSE 3000

CMD [ "node", "src/index.js" ]
