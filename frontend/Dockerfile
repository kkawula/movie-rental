FROM node:22-alpine

WORKDIR /frontend
COPY . .
RUN yarn install
EXPOSE 5173
CMD yarn install;yarn dev --host 0.0.0.0
