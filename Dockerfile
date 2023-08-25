FROM node:alpine

WORKDIR /application

EXPOSE 9000

COPY package*.json .

RUN npm install

COPY . .

CMD [ "npm", "run", "dev" ]
