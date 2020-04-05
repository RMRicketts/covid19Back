FROM node:alpine

WORKDIR /var/www/covidback

COPY ./package.json ./
RUN npm install
COPY . .
COPY ../configs ../../

CMD ["npm", "start"]
