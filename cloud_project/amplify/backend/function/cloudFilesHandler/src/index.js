// Import the AWS SDK
const AWS = require('aws-sdk');

// Initialize the S3 service object
const s3 = new AWS.S3();

// The name of the bucket
const myBucketName = 'cloudprojects3bucket183954-dev';

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
    try {
        console.log("Received event:", JSON.stringify(event, null, 2));
        const cognitoIdentityId = event.headers['X-Identity-Id'] || event.headers['x-identity-id']; // Headers are case-insensitive
        console.log("Cognito Identity ID in Lambda:", cognitoIdentityId);
        // Fetch the list of items from S3
        const s3Response = await s3.listObjectsV2({
            Bucket: myBucketName,
        }).promise();

        // Extract the file information from the S3 response
        const items = s3Response.Contents
            .filter(file => file.TagCount > 0 && file.TagSet.find(tag => tag.Key === 'Owner' && tag.Value === cognitoIdentityId))
            .map(file => {
                // Remove the 'public/' prefix from the key
                const keyWithoutPrefix = file.Key.replace(/^public\//, '');
                return {key: keyWithoutPrefix, size: file.Size};
            });

        // Return the file list as the response
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            },
            body: JSON.stringify(items),
        };

    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            },
            body: JSON.stringify('Error fetching from S3' + error.message),
        };
    }
};