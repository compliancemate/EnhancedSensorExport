FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
# RUN ls -al -R
RUN npm run build
EXPOSE 8883
CMD [ "npm", "run", "start:pm2"]
# CMD [ "npm", "start" ]