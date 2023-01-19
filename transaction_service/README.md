# Transaction Service

This service manages the creation and deletion of transactions.


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
MONGODB_CONNECTION_STRING="mongodb://localhost:27017/transaction"
JWT_SECRET_KEY="..."
AZURE_BLOB_STORAGE_CONNECTION_STRING="..."
AZURE_BLOB_STORAGE_CONTAINER_NAME="budgettrackerobjects-container"
```

Starting the transaction_service with `docker-compose` you must remove the `"` for:
- `MONGODB_CONNECTION_STRING`
- `AZURE_BLOB_STORAGE_CONNECTION_STRING`
- `AZURE_BLOB_STORAGE_CONTAINER_NAME`

## Development
Run the microservice in development mode:
```
yarn dev
```

## Build the docker image
To build the docker image run the following command in the repository root directory:

```
docker build -t transaction_service -f .\transaction_service\Dockerfile .
```
