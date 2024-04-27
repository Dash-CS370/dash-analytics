import * as AWS from 'aws-sdk';
import * as csv from 'csv-parser';

const baseS3Url = 's3://dash-analytics-test/';

AWS.config.update({
    region: 'us-east-2',
});

const s3 = new AWS.S3();

// fetches CSV file from S3 and returns the data as JSON
// must be a next api route - keeps aws credentials secure on the server
export async function GET(request: Request): Promise<Response> {
    const searchParams = new URL(request.url).searchParams;
    const csvLink = searchParams.get('link');

    const s3Url = `${baseS3Url}${csvLink}`;

    // Parse S3 URI to get bucket name and object key
    const urlParts = s3Url.match(/^s3:\/\/([^\/]+)\/(.+)$/);
    if (!urlParts) {
        throw new Error('Invalid S3 URL');
    }

    const bucketName = urlParts[1];
    const objectKey = urlParts[2];
    const params = {
        Bucket: bucketName,
        Key: objectKey,
    };

    try {
        const csvData = await new Promise((resolve, reject) => {
            const rows: Record<string, any>[] = [];
            // Pipe the S3 stream through the csv-parser
            s3.getObject(params)
                .createReadStream()
                .pipe(csv.default())
                .on('data', (row) => {
                    rows.push(row);
                })
                .on('end', () => {
                    resolve(rows);
                })
                .on('error', (error) => {
                    reject(error);
                });
        });

        return new Response(JSON.stringify(csvData), { status: 200 });
    } catch (error) {
        return new Response(`Error reading file: ${error}`, { status: 500 });
    }
}
