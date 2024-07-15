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

### TERRAFORM

The IAC module to create the lambda function which hosts the API

- Provisioning:
    - Setup the aws credential by running `aws configure` and pass the Access Key and Secret Access Key to prompt
    - In `backend` folder, do `npm run build`, the typescript will be converted into the js file
    - Zip the source code `zip -r lambda.zip .` and ready for code upload
    - `terraform init`
    - `terraform apply` will create the lambda with zip file
    - Test the API by utilizing the lambda function url in the output `lambda_function_url`
- Decommission:
    - `terraform destroy`
    - Go to the aws console and remove the logs from `Log Group` in `CloudWatch`

### Manual Deployment

- Setup the aws credentials `aws configure`
- Create lambda function
- Give privillege `chmod +x lambda_deploy.sh`
- Run `./lambda_deploy.sh` 