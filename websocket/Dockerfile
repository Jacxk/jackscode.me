###########
# Builder #
###########
FROM node:12-alpine

WORKDIR /usr/src

# Install dependencies
COPY package.json ./
RUN npm i

# Copy source
COPY . /usr/src

# Build source
RUN npm run build

CMD ["npm", "start-dev"]
