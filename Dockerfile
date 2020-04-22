FROM node:alpine

WORKDIR /var/www

COPY ./package.json ./
RUN npm install
COPY . .
RUN node ./scripts/buildConfigs.js

CMD ["npm", "start"]
