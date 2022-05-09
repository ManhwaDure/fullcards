FROM node:14-alpine

VOLUME [ "/app/configs", "/app/data" ]

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install

COPY . ./
RUN yarn build

EXPOSE 3000
CMD [ "yarn", "migrate-and-start" ]
