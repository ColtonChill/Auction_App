FROM node:13.8.0-alpine3.11
# Build dependencies.
RUN apk add python make gcc g++ postgresql-dev
# Set our directory
WORKDIR /home/auction
# Copy our dependencies
COPY package*.json /home/auction/
# Install dependencies
RUN npm ci --quiet
# Copy configs.
COPY knexfile.js /home/auction/
COPY tsconfig.json /home/auction/
# Copy files.
COPY src /home/auction/src/
COPY db /home/auction/db/
COPY tests /home/auction/tests/
# Build the server
RUN npm run build
# Run it
EXPOSE 3000
CMD ["node", "build/index.js"]