terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "ap-southeast-2"
}

# Grant execution role to lambda function
data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}
resource "aws_iam_role" "iam_for_lambda" {
  name               = "iam_for_lambda"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}
resource "aws_iam_role_policy_attachment" "lambda_execution_policy" {
  role       = aws_iam_role.iam_for_lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Lambda function
resource "aws_lambda_function" "test_lambda" {
  function_name = "name_searching"
  filename      = "../backend/lambda.zip"
  role          = aws_iam_role.iam_for_lambda.arn

  runtime = "nodejs20.x"
  handler = "dist/src/app.handler"  # needs to be the relevant path of the app.js file after compile
}

resource "aws_lambda_function_url" "test_latest" {
  function_name      = aws_lambda_function.test_lambda.function_name
  authorization_type = "NONE"

  depends_on = [aws_lambda_function.test_lambda]
}

output "lambda_function_url" {
  value = aws_lambda_function_url.test_latest.function_url
}