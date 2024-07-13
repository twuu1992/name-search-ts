## ABOUT THE PROJECT

This is a small project which delivers an API written in TypeScript, and hosted in aws lambda function

### BACKEND

An API in TypeScript supports a basic name searching function.

- To start the backend API, please run `npm install` first to install all the dependencies
- Then `npm start serve` and access the url `localhost:8080` in Postman
- Endpoints:
    - `localhost:8080/names` [GET] to list all the names
    - `localhost:8080/search` [POST] to search the most matched name.
        - Wrap the payload like `{"input": "David Smith"}` in body of the request, set raw and select json type