const { BlobServiceClient } = require('@azure/storage-blob');
const sharp = require('sharp');

module.exports = async function (context, myBlob) {
    try {
        // Connection String für das Storage-Konto
        const connectionString = process.env.AzureWebJobsStorage;
        const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

        // Container-Clients erstellen
        const thumbnailContainer = blobServiceClient.getContainerClient('thumbnails');

        // Bild verkleinern
        const resizedImageBuffer = await sharp(myBlob)
            .resize(300, 300, {
                fit: 'inside',
                withoutEnlargement: true
            })
            .toBuffer();

        // Neuen Blob-Namen erstellen
        const thumbnailName = `thumb-${context.bindingData.name}`;
        
        // Thumbnail hochladen
        const blockBlobClient = thumbnailContainer.getBlockBlobClient(thumbnailName);
        await blockBlobClient.upload(resizedImageBuffer, resizedImageBuffer.length);

        context.log(`Bild erfolgreich verarbeitet: ${thumbnailName}`);
    } catch (error) {
        context.log.error('Fehler beim Verarbeiten des Bildes:', error);
        throw error;
    }
};