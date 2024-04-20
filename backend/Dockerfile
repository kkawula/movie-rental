FROM node:20-alpine

WORKDIR /backend
COPY . .
RUN npm install
EXPOSE 3001
EXPOSE 9299
CMD ["npm", "run", "dev"]
