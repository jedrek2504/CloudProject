const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const myBucketName = 'cloudprojects3bucket183954-dev';

exports.handler = async (event) => {
    console.log("Received event:", JSON.stringify(event, null, 2));
    const cognitoIdentityId = event.requestContext.authorizer.claims.sub;

    try {
        console.log("Fetching list of object versions from S3");
        const s3Response = await s3.listObjectVersions({
            Bucket: myBucketName,
            Prefix: 'public/'
        }).promise();

        console.log("S3 listObjectVersions response:", JSON.stringify(s3Response, null, 2));

        if (!s3Response.Versions) {
            console.error("No versions found in the response.");
            return {
                statusCode: 500,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "*"
                },
                body: JSON.stringify({ error: "No versions found in the S3 response." }),
            };
        }

        const items = s3Response.Versions
            .filter(version => version.IsLatest && !version.IsDeleteMarker)
            .map(version => {
                const keyWithoutPrefix = version.Key.replace(/^public\//, '');
                return {
                    key: keyWithoutPrefix,
                    size: version.Size,
                    versionId: version.VersionId,
                    lastModified: version.LastModified
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
            body: JSON.stringify({ error: 'Error fetching from S3', details: error.message }),
        };
    }
};
