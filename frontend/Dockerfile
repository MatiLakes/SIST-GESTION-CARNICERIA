FROM node:20.10.0
WORKDIR /usr/src/frontend
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3050
CMD ["npm", "start"]