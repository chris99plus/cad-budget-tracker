FROM node:18.10 as builder

COPY ./authentication_service usr/authentication_service
COPY ./microservice_helpers usr/microservice_helpers
WORKDIR /usr/authentication_service
RUN yarn install
RUN yarn build

FROM node:18.10 as server

COPY --from=builder /usr/microservice_helpers/ /usr/microservice_helpers/

WORKDIR /usr/authentication_service

COPY --from=builder /usr/authentication_service/dist/ dist/
COPY --from=builder /usr/authentication_service/package.json .
COPY --from=builder /usr/authentication_service/yarn.lock .


RUN yarn install --production

ENV SERVER_PORT=4000
EXPOSE 4000

CMD [ "yarn", "start" ]
