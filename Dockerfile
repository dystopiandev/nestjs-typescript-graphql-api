FROM node:20-alpine As development
WORKDIR /usr/src/app
COPY --chown=node:node package*.json ./
RUN apk add --no-cache python3 make g++
RUN npm ci
COPY --chown=node:node . .
USER node

FROM node:20-alpine As build
WORKDIR /usr/src/app
COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .
RUN npm run build
ENV NODE_ENV production
RUN npm ci --only=production && npm cache clean --force
USER node

FROM node:20-alpine As production
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

CMD [ "node", "dist/main.js" ]
EXPOSE 8008
