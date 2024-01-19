const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const myBucketName = 'cloudprojects3bucket183954-dev';

exports.handler = async (event) => {
    const cognitoIdentityId = event.headers['X-Identity-Id'] || event.headers['x-identity-id'];

    try {
        console.log("Fetching list of object versions from S3");
        const s3Response = await s3.listObjectVersions({
            Bucket: myBucketName,
            Prefix: 'public/'
        }).promise();

        const getObjectOwner = async (key, versionId) => {
            const headObjectResponse = await s3.headObject({
                Bucket: myBucketName,
                Key: key,
                VersionId: versionId
            }).promise();
            return headObjectResponse.Metadata['owner'] || '';
        };
        
        const allVersions = await Promise.all(s3Response.Versions
    .filter(version => !version.IsDeleteMarker)
    .map(async version => {
        const owner = await getObjectOwner(version.Key, version.VersionId);

        return {
            key: version.Key.replace(/^public\//, ''),
            versionId: version.VersionId,
            size: version.Size,
            lastModified: version.LastModified,
            isLatest: version.IsLatest,
            owner: owner
        };
    }));


        const filteredVersions = allVersions.filter(version => version.owner === cognitoIdentityId);

        // Group the filtered versions by their keys
        const itemsWithVersions = filteredVersions.reduce((acc, version) => {
            (acc[version.key] = acc[version.key] || []).push(version);
            return acc;
        }, {});
        console.log("items",itemsWithVersions);
        // Filter out keys that only have delete markers as the latest version
        const itemsToReturn = Object.keys(itemsWithVersions).reduce((acc, key) => {
    // Sort versions for the specific key by modification date in descending order
        const sortedVersions = itemsWithVersions[key].sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
        
        acc.push({
            key,
            versions: sortedVersions
        });

        return acc;
        }, []);


        console.log("Mapped items with versions to return:", JSON.stringify(itemsToReturn, null, 2));
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            },
            body: JSON.stringify(itemsToReturn),
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
