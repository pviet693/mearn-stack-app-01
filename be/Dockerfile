FROM node:alpine
WORKDIR /usr/src/app
COPY package*.json .
COPY . .
RUN rm -rf node_modules
RUN npm ci && npm cache clean --force 
EXPOSE 3002
CMD ["npm", "run", "dev"]