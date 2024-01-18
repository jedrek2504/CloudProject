const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const myBucketName = 'cloudprojects3bucket183954-dev';

exports.handler = async (event) => {
    console.log("Received event:", JSON.stringify(event, null, 2));

    try {
        console.log("Fetching list of object versions from S3");
        const s3Response = await s3.listObjectVersions({
            Bucket: myBucketName,
            Prefix: 'public/'
        }).promise();

        // First, filter out delete markers and map versions
        const versionsWithoutDeleteMarkers = s3Response.Versions
            .filter(version => !version.IsDeleteMarker)
            .map(version => ({
                key: version.Key.replace(/^public\//, ''),
                versionId: version.VersionId,
                size: version.Size,
                lastModified: version.LastModified,
                isLatest: version.IsLatest
            }));

        // Group the filtered versions by their keys
        const itemsWithVersions = versionsWithoutDeleteMarkers.reduce((acc, version) => {
            (acc[version.key] = acc[version.key] || []).push(version);
            return acc;
        }, {});

        // Filter out keys that only have delete markers as the latest version
        const itemsToReturn = Object.keys(itemsWithVersions).reduce((acc, key) => {
            const latestVersion = itemsWithVersions[key].find(version => version.isLatest);
            if (latestVersion) {
                acc.push({
                    key,
                    versions: itemsWithVersions[key].sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified))
                });
            }
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
