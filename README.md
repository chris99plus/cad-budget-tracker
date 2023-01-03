# Budget Tracker
Project for the Cloud Application Development course


# Repository structure
- Every microservice has its own directory at the root level of the repository.
- To contribute to this repository we work in dedicated branches and create pull requests to bring the changes into the main branch

# Local development
To start the microservices for local development run:
```
docker compose up
```


# API Specification

## Transaction service

### Get transaction by id
`GET /api/v1/transactions/{id}`
Response:
```json
{
    "id": string,
	"cashbookId": string,
    "amount": numeric,
    "type": "income"|"expense",
    "description": string,
    "comment": string,
    "timestamp": datetime,
    "category": string
}
```

### Delete transaction
`DELETE /api/v1/transactions/{id}`

Response: siehe oben [[#Error Handling]]

### Create transaction
`POST /api/v1/cashbooks/{cashbookId}/transactions`

Body:
```json
{
    "amount": numeric,
    "type": "income"|"expense",
    "description": string,
    "comment": string,
    "timestamp": datetime,
    "category": string
}
```
Response:
```json
{
    "id": string,
    "cashbookId": string,
    "amount": numeric,
    "type": "income"|"expense",
    "description": string,
    "comment": string,
    "timestamp": datetime,
    "category": string
}
```



### Get all transactions
`GET /api/v1/cashbooks/{cashbookId}/transactions`

**Parameters (optional, passed inside the URL)**
- start: datetime
- end: datetime
- type: "income" | "expense"

Example:
`/api/v1/cashbooks/exampleCashbook/transactions?start=2023-01-01T02:12:24&end=2023-01-05T22:00:00&type=expense`

Response:
```json
[
    {
        "id": string,
        "cashbookId": string,
        "amount": numeric,
        "type": "income"|"expense",
        "description": string,
        "comment": string,
        "timestamp": datetime,
        "category": string
    }
]
```

### Get all cashbookIds
`GET /api/v1/cashbooks/cashbookIds`
Groups all transactions by cashbookId and returns a list of all cashbookIds that appear in any transaction

Response:
```json
[
    string,
    ...
]
```


### Get daily report
#### today
Berechnet einen Report über die Transaktionen des heutigen Tages. Der Report wird "on the fly" berechnet und nicht vom periodischen Microservice. Der Daily Report wird nicht in der MongoDB gespeichert.

`GET /api/v1/cashbooks/{cashbookId}/reports/daily/{day}`
for parameter **day** pass *today* to get the daily report of today or pass a timestamp to get the daily report of a specific day, e.g. 2022-12-24 

Response:
```json
{
    "total": numeric,
    "expenses": {
        "total": numeric,
        "categories": [
            {
                "name": string,
                "value": numeric,
                "percent": numeric
            },
            ...
        ]
    },
    "income": {
        "total": numeric,
        "categories": [
            {
                "name": string,
                "value": numeric,
                "percent": numeric
            },
            ...
        ]
    }
}
```



### Get weekly report
`GET /api/v1/cashbooks/{cashbookId}/reports/weekly/current`
Berechnet einen Report über die Transaktionen der aktuellen Woche. Momentan würde es ausreichen, hartcodierte Daten zu liefern. Die Berechnung ist nach Kalenderwochen, also von Mo - So. Der Report wird nicht in der MongoDB gespeichert.

Response:
```json
{
    "total": numeric,
    "expenses": {
        "total": numeric,
        "categories": [
            {
                "name": string,
                "value": numeric,
                "percent": numeric
            },
            ...
        ]
    },
    "income": {
        "total": numeric,
        "categories": [
            {
                "name": string,
                "value": numeric,
                "percent": numeric
            },
            ...
        ]
    }
}
```

`GET /api/v1/cashbooks/{cashbookId}/reports/weekly`
Liefert alle in der MongoDB gespeicherten Weekly-Reports eines cashbooks
Response:
```json
{
    "_id": string,
    "cashbookId": string,
    "start": datetime,
    "end": datetime,
    "total": numeric,
    "expenses": {
        "total": numeric,
        "categories": [
            {
                "name": string,
                "value": numeric,
                "percent": numeric
            },
            ...
        ]
    },
    "income": {
        "total": numeric,
        "categories": [
            {
                "name": string,
                "value": numeric,
                "percent": numeric
            },
            ...
        ]
    }
},
...
```


### Create weekly report
Zieht sich alle cashbookIds und erstellt die dazugehörigen Wochenberichte. Diese Funktion wird periodisch als Cron-Job ausgeführt. Die Reports werden in folgener Struktur in der MongoDB in der Collection reports gespeichert:
```json
{
    "cashbookId": string,
    "start": datetime,
    "end": datetime,
    "total": numeric,
    "expenses": {
        "total": numeric,
        "categories": [
            {
                "name": string,
                "value": numeric,
                "percent": numeric
            },
            ...
        ]
    },
    "income": {
        "total": numeric,
        "categories": [
            {
                "name": string,
                "value": numeric,
                "percent": numeric
            },
            ...
        ]
    }
}
```


## Authentication service
Ein Benutzer kann sich durch die REST Schnittstelle dem System gegenüber authentifizieren. Als Antwort bekommt der Benutzer ein JWT Token, mit dem er sich bei allen weiteren Endpunkten authentifiziert.

### Create new user
`POST /api/v1/auth/users`

Request:
```json
{
    "username": string,
    "email": string,
    "password": string,
    "licenseType": "free"|"standard"|"enterprise",
	"createTenant": boolean, // Must be set when licenseType = "enterprise"
	"tenantSecret": string?, // Must be set when createTenant = false
	"tenantName": string? // Must be set when createTenant = true
}
```

Response:
```json
{
	"authToken": string
}
```

### Login
`POST /api/v1/auth/login`

Request:
```json
{
    "username": string,
    "password": string,
}
```

Response:
```json
{
	"authToken": string
}
```

### Logout
`POST /api/v1/auth/logout`

Response: Siehe oben


## Error Handling
- HTTP 200 (Bei Erfolg)
- HTTP 400 (Bei Client Error)
- HTTP 500 (Bei Server Error)


### Response bei Erfolg
```json
{
    "successful": true,
    "data": ... -> je nach Endpunkt
}
```

### Response bei Fehler
```json
{
    "successful": false,
    "message": string,
    "data": ... -> optional, je nach Endpunkt
}
```
