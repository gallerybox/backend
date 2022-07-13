# Stage 1: building Nest.js project
ARG NODE_VERSION
FROM node:${NODE_VERSION} AS development

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install rimraf
RUN npm install

# Copy in the source code
COPY . .

RUN npm run build


# Stage 2: preparing Nest.js project for production
FROM node:${NODE_VERSION} AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy in the source code
COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]