FROM node:20.12.1-alpine AS build_stage

# required for ssh and git clone inside npm. dumb-init for process management.
RUN apk add --update --no-cache openssh git dumb-init

# RUN mkdir -p -m 0600 ~/.ssh && ssh-keyscan gitlab.niveussolutions.com >> ~/.ssh/known_hosts

RUN mkdir -p /app

WORKDIR /app

COPY package.json package.json

# package-lock.json is required for 'npm clean-install'
COPY package-lock.json package-lock.json

# npm install the dependencies (from npm and git)
# RUN --mount=type=ssh npm clean-install

RUN npm clean-install



FROM node:20.12.1-alpine

# Set the timezone
RUN apk add --no-cache tzdata
ENV TZ=Asia/Kolkata

# Copy dumb-init from build stage
COPY --from=build_stage /usr/bin/dumb-init /usr/bin/dumb-init

RUN mkdir -p /app

RUN chown node:node /app

# Use the built in 'node' user with lesser previliges.
USER node

WORKDIR /app

# Copy the /app from build stage
COPY --chown=node:node --chmod=555 --from=build_stage /app /app

COPY --chown=node:node --chmod=555 . .

EXPOSE 3001

CMD ["dumb-init", "node", "server.js"]
