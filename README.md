# CLINICS API
Provides a simple API for accessing data on UK clinics.

## Prerequisites
[Node](http://nodejs.org/) v6.  
[npm](https://www.npmjs.com/) v3.

## Installation
From the app root run:
```
$> npm install
```

## Running
```
$> npm start
```
Then go to one of the endpoints (via browser or GET request): 
- http://localhost:3000/clinics/postcode/[POSTCODE]
- http://localhost:3000/clinics/name/[TYPE_OF_CLINIC]
- http://localhost:3000/clinics/city/[CITY]

## Config
Default config can be found in /config/default.json.  
  
This includes:
- location of service urls
- location of app and error logs

## Unit tests

To run tests:
```
$> npm run test
```

## Resources

The app uses:
- Express as a web app framework
- Request-promise as an http request handler
- Sinon, Mocha, Chai for unit testing
- Winston, Morgan for logging
- Underscore as a utility library

## Todos

- finish logger
- improve error handling
- improve input validation
- add API docs
- replace underscore functions with custom alternatives, eg countBy
- add debug
- healthchecks: improve error capture
- unit tests:
  - models/search - finish fetch method tests by resolving issue with request-promise and sinon
  - controllers/clinic-search - finish tests to cover handling of endpoint urls