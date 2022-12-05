FROM node:18.10 as builder

WORKDIR /usr/app
COPY . .
RUN yarn install
RUN yarn build

FROM node:18.10 as server

WORKDIR /usr/app
COPY --from=builder /usr/app/dist/ dist/
COPY --from=builder /usr/app/package.json .
COPY --from=builder /usr/app/yarn.lock .
RUN yarn install --production

EXPOSE 4000

CMD [ "yarn", "start" ]
