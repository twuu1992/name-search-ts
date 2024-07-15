#!/bin/bash

# 1. setup aws credentials first
# aws configure

# 2. create lambda function

# 3. manually upload zip file
aws lambda update-function-code --function-name name_searching --zip-file fileb://backend/lambda.zip