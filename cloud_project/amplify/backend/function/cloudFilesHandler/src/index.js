const AWS = require('aws-sdk');

// Initialize the S3 service object
const s3 = new AWS.S3();

// The name of the bucket
const myBucketName = 'cloudprojects3bucket183954-dev';

exports.handler = async (event) => {
    try {
        const cognitoIdentityId = event.headers['X-Identity-Id'] || event.headers['x-identity-id'];

        // Fetch the list of items from S3
        const s3Response = await s3.listObjectsV2({ Bucket: myBucketName }).promise();
        const itemsWithMetadata = [];

        for (const object of s3Response.Contents) {
            const headResponse = await s3.headObject({ Bucket: myBucketName, Key: object.Key }).promise();
            const metadataIdentityId = headResponse.Metadata['owner'];

            if (metadataIdentityId === cognitoIdentityId) {
                itemsWithMetadata.push({
                    key: object.Key.replace(/^public\//, ''),
                    size: object.Size
                });
            }
        }

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Identity-Id",
                "Access-Control-Allow-Methods": "GET,POST,OPTIONS,PUT,DELETE"
            },
            body: JSON.stringify(itemsWithMetadata),
        };
    } catch (error) {
        console.error('Error fetching items from S3', error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Identity-Id",
                "Access-Control-Allow-Methods": "GET,POST,OPTIONS,PUT,DELETE"
            },
            body: JSON.stringify({ message: 'Error fetching from S3', details: error.message }),
        };
    }
};
