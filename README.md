# Budget Tracker
Project for the Cloud Application Development course


# Repository structure
- Every microservice has its own directory at the root level of the repository.
- To contribute to this repository we work in dedicated branches and create pull requests to bring the changes into the main branch



# API Specification

## Transaction service
### Create transaction
`POST /api/v1/transactions`

Body:
```json
{
    "amount": numeric,
    "type": "income"|"expense",
    "description": string,
    "comment": string,
    "timestamp": datetime,
    "category": TBD
}
```
Response:
```json
{
	"id": string,
	"amount": numeric,
    "type": "income"|"expense",
    "description": string,
    "comment": string,
    "timestamp": datetime,
    "category": TBD
}
```

### Delete transaction
`DELETE /api/v1/transactions/{id}`

Response: siehe oben [[#Error Handling]]

### Get all transactions
`GET /api/v1/transactions`

Response:
```json
[
	{
		"id": string,
	    "amount": numeric,
        "type": "income"|"expense",
        "description": string,
        "comment": string,
        "timestamp": datetime,
        "category": TBD
	}
]
```

### Get transaction by id
`GET /api/v1/transactions/{id}`

Response:
```json
{
    "id": string,
	"amount": numeric,
    "type": "income"|"expense",
    "description": string,
    "comment": string,
    "timestamp": datetime,
    "category": TBD
}
```


### Get daily report
Berechnet einen Report über die Transaktionen des heutigen Tages. Der Report wird "on the fly" berechnet und nicht vom periodischen Microservice.

`GET /api/v1/reports/daily/today`

Response:
```json
{
	"total": numeric,
	"expenses": {
	    "total": numeric,
	    "categories": {
	        "food": {
	            "value": numeric,
	            "percent": numeric
	        },
	        ...
	    }
	},
	"income": {
	    "total": numeric,
	    "categories": {
	        "other": {
	            "value": numeric,
	            "percent": numeric
	        },
	        ...
	    }
	}
}
```


### Get weekly report
Berechnet einen Report über die Transaktionen der aktuellen Woche. Momentan würde es ausreichen, hartcodierte Daten zu liefern. Die Berechnung ist nach Kalenderwochen, also von Mo - So.

`GET /api/v1/reports/weekly/current`

Response:
```json
{
	"total": numeric,
	"expenses": {
	    "total": numeric,
	    "categories": {
	        "food": {
	            "value": numeric,
	            "percent": numeric
	        },
	        ...
	    }
	},
	"income": {
	    "total": numeric,
	    "categories": {
	        "other": {
	            "value": numeric,
	            "percent": numeric
	        },
	        ...
	    }
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
    "licenseType": "free"|"standard"|"enterprise"
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
