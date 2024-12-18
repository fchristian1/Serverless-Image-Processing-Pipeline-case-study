const { app } = require('@azure/functions');
const { BlobServiceClient } = require('@azure/storage-blob');
const JSZip = require('jszip');
app.http('downloadReference', {
    methods: ['GET', 'POST'],
    route: 'download',
    authLevel: 'anonymous',
    handler: async (request, context) => {
        const querys = request.query;
        const refQuery = querys.get('ref');
        if (!refQuery) {
            return {
                status: 400,
                body: 'No reference Number given'
            };
        }
        // get filelist from blob
        const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.imagewall_STORAGE);
        const containerName = 'images';
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const matchingBlobs = [];
        for await (const blob of containerClient.listBlobsFlat()) {
            if (blob.name.includes(refQuery)) {
                matchingBlobs.push(blob.name);
            }
        }
        const zip = new JSZip();

        for (const blobName of matchingBlobs) {
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
            const downloadBlockBlobResponse = await blockBlobClient.download(0);
            const chunks = [];
            for await (const chunk of downloadBlockBlobResponse.readableStreamBody) {
                chunks.push(chunk);
            }
            const fileContent = Buffer.concat(chunks);
            zip.file(blobName, fileContent);
        }
        const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

        return {
            headers: {
                'Content-Type': 'application/zip',
                'Content-Disposition': `attachment; filename=${refQuery}.zip`
            },
            body: zipBuffer
        };
    }
});
