FROM node:20.10.0
WORKDIR /usr/src/backend
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3050
CMD ["npm", "run", "start"]