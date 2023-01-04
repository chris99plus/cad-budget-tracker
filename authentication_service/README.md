# Authentication Service

This service manages the authentication of users.


## Development setup
To start developing for this microservice you have to install 
Node.js (at least version 18.10), npm and yarn.

```
npm install --global yarn 
yarn install
```

Create a `.env` file with the following variables:

```
JWT_SECRET_KEY=" < any at least 32 characters long password >"
SERVER_PORT=4001
MONGODB_CONNECTION_STRING="mongodb://localhost:27017/authentication"
TENANT_SERVICE_URL="http://localhost:4002"
```

## Development
Run the microservice in development mode:
```
yarn dev
```

## Build the docker image
To build the docker image run the following command in the repository root directory:

```
docker build -t authentication_service -f .\authentication_service\Dockerfile .
```
