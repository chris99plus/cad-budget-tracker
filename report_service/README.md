# Report Service

This service manages the cyclic and on-the-fly creation of daily and weekly reports.


## Development setup
To start developing for this microservice you have to install 
Node.js (at least version 18.10), npm and yarn.

```
npm install --global yarn 
yarn install
```

Create a `.env` file with the following variables:

```
SERVER_PORT=4004
MONGODB_CONNECTION_STRING="mongodb://simba:theLionKing@cluster-fra.vm27r7k.mongodb.net/budget-tracker"
JWT_SECRET_KEY="..."
TRANSACTION_SERVICE_URL=http://localhost:4003
EXECUTION_MODE="service" | "cron-job"

```

## Development
Run the microservice in development mode:
```
yarn dev
```
