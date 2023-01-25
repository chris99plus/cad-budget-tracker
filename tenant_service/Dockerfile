FROM node:18.10 as builder

# Copy and build common dependency code
COPY ./microservice_helpers /usr/microservice_helpers
WORKDIR /usr/microservice_helpers
RUN yarn install
RUN yarn build

# Copy and build the microservice code
COPY ./tenant_service /usr/tenant_service
WORKDIR /usr/tenant_service
RUN yarn install
RUN yarn build

FROM node:18.10 as server

COPY --from=builder /usr/microservice_helpers/ /usr/microservice_helpers/

WORKDIR /usr/tenant_service

COPY --from=builder /usr/tenant_service/dist/ dist/
COPY --from=builder /usr/tenant_service/package.json .
COPY --from=builder /usr/tenant_service/yarn.lock .


RUN yarn install --production

RUN curl -LO "https://dl.k8s.io/release/v1.26.1/bin/linux/amd64/kubectl" && \
    install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
RUN curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash 


COPY ./infrastructure/charts/ /usr/infrastructure/charts

WORKDIR /usr/infrastructure/charts

RUN helm repo add bitnami https://charts.bitnami.com/bitnami
RUN helm dependency build ./budget-tracker
RUN helm dependency build ./authentication-service
RUN helm dependency build ./frontend
RUN helm dependency build ./transaction-service
RUN helm dependency build ./tenant

WORKDIR /usr/tenant_service

ENV SERVER_PORT=4000
EXPOSE 4000

CMD [ "yarn", "start" ]
