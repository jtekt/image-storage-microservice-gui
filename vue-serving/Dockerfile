# Build the Vue app
FROM node:14 as build-stage
WORKDIR /app
COPY package*.json ./

RUN npm install
COPY ./ .
RUN npm run build

# Put the built app in a serving container
FROM moreillon/vue-serving as production-stage
COPY --from=build-stage /app/dist /usr/src/app/dist
