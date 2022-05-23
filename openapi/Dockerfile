FROM node:alpine
RUN npm install @openapitools/openapi-generator-cli -g
RUN apk add --no-cache inotify-tools openjdk11
WORKDIR /app/openapi/
CMD ./watcher.sh