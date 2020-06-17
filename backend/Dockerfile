###########
# Builder #
###########
FROM node:14-alpine

WORKDIR /usr/src

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source
COPY . /usr/src

# Build source
RUN npm run build

CMD ["npm", "start"]
