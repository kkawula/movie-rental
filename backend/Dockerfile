FROM node:20-alpine

WORKDIR /backend
COPY . .
RUN npm install
EXPOSE 3001
EXPOSE 9299
EXPOSE 4983
CMD ["npm", "run", "dev"]
