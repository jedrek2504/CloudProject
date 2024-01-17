const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const myBucketName = 'cloudprojects3bucket183954-dev';

exports.handler = async (event) => {
    console.log("Received event:", JSON.stringify(event, null, 2));
    const cognitoIdentityId = event.requestContext.authorizer.claims.sub; // Use the sub claim as the identity id

    try {
        console.log("Fetching list of object versions from S3");
        const s3Response = await s3.listObjectVersions({
            Bucket: myBucketName,
            Prefix: 'public/'
        }).promise();

        console.log("S3 listObjectVersions response:", JSON.stringify(s3Response, null, 2));

        const latestVersions = s3Response.Versions.filter(version => version.IsLatest);
        console.log("Filtered latest versions:", JSON.stringify(latestVersions, null, 2));

        const items = latestVersions.map(version => {
            const keyWithoutPrefix = version.Key.replace(/^public\//, '');
            return {
                key: keyWithoutPrefix,
                size: version.Size,
                versionId: version.VersionId
            };
        });

        console.log("Mapped items to return:", JSON.stringify(items, null, 2));
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            },
            body: JSON.stringify(items),
        };

    } catch (error) {
        console.error("Error fetching from S3:", error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            },
            body: JSON.stringify('Error fetching from S3: ' + error.message),
        };
    }
};
