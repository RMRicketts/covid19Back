FROM node:alpine

WORKDIR /var/www/covidback

COPY ./package.json ./
RUN npm install
COPY . .

CMD ["npm", "start"]
