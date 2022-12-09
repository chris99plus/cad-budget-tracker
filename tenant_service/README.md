# Tenant Service

This service manages the creation of tenants and their infrastructure.


## Development setup
To start developing for this microservice you have to install 
Node.js (at least version 18.10), npm and yarn.

```
npm install --global yarn 
yarn install
```

Create a `.env` file with the following variables:

```
SERVER_PORT=4000
MONGODB_CONNECTION_STRING="mongodb://localhost:27017/authentication"
```

## Development
Run the microservice in development mode:
```
yarn dev
```
