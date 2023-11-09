export type AmplifyDependentResourcesAttributes = {
  "api": {
    "cloudprojectapi": {
      "ApiId": "string",
      "ApiName": "string",
      "RootUrl": "string"
    }
  },
  "auth": {
    "cloudprojectd09d3ea3": {
      "AppClientID": "string",
      "AppClientIDWeb": "string",
      "IdentityPoolId": "string",
      "IdentityPoolName": "string",
      "UserPoolArn": "string",
      "UserPoolId": "string",
      "UserPoolName": "string"
    }
  },
  "function": {
    "cloudFilesHandler": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    }
  },
  "storage": {
    "s3bucket": {
      "BucketName": "string",
      "Region": "string"
    }
  }
}