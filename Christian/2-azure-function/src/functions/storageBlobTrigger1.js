const { app } = require('@azure/functions');
const sharp = require('sharp');
const { BlobServiceClient } = require('@azure/storage-blob');

app.storageBlob('storageBlobTrigger1', {
    path: 'images/upload/{name}',
    connection: 'imagewall_STORAGE',
    handler: async (blob, context) => {
        context.log(`Storage blob function processed blob "${context.triggerMetadata.name}" with size ${blob.length} bytes`);

        const sizes = [200, 800, 1024];

        const blobName = context.triggerMetadata.name;
        const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.imagewall_STORAGE);
        const containerName200 = 'images'; // Zielcontainer für skalierte Bilder
        const containerName800 = 'images'; // Zielcontainer für skalierte Bilder
        const containerName1024 = 'images'; // Zielcontainer für skalierte Bilder


        const containerClient200 = blobServiceClient.getContainerClient(containerName200);
        const containerClient800 = blobServiceClient.getContainerClient(containerName800);
        const containerClient1024 = blobServiceClient.getContainerClient(containerName1024);

        // Stelle sicher, dass der Zielcontainer existiert
        if (!(await containerClient200.exists())) {
            await containerClient200.create();
        }
        if (!(await containerClient800.exists())) {
            await containerClient800.create();
        }
        if (!(await containerClient1024.exists())) {
            await containerClient1024.create();
        }
        context.log(`Try to resize image ${blobName}`);
        try {
            for (const size of sizes) {
                const resizedImage = await sharp(blob)
                    .resize({ width: size, height: size, fit: sharp.fit.inside, withoutEnlargement: true })
                    .toBuffer();
                const resizedBlobName = `images-resize-${size}/${blobName}`;
                const containerClient = size === 200 ? containerClient200 : size === 800 ? containerClient800 : containerClient1024;
                const blockBlobClient = containerClient.getBlockBlobClient(resizedBlobName);
                await blockBlobClient.uploadData(resizedImage);
                context.log(`Resizing image ${blobName} to ${size} pixels`);
            }
            //delete original image
            const containerClient = blobServiceClient.getContainerClient('images/upload');
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
            await blockBlobClient.delete();
            context.log(`Image ${blobName} resized successfully`);
        } catch (error) {
            context.log(`Error resizing image ${blobName}: ${error}`);
        }
    }
});
