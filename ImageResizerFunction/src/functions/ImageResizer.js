const { app } = require("@azure/functions");
const { BlobServiceClient } = require("@azure/storage-blob");
const sharp = require("sharp");

app.storageBlob("ImageResizer", {
  path: "input-images/{name}", // Ihr Input-Container
  connection: "AzureWebJobsStorage",
  handler: async (blob, context) => {
    try {
      // Connection String für das Storage-Konto
      const connectionString = process.env.AzureWebJobsStorage;
      const blobServiceClient =
        BlobServiceClient.fromConnectionString(connectionString);

      // Container-Client für Output erstellen
      const thumbnailContainer =
        blobServiceClient.getContainerClient("output-images");

      // Bild verkleinern
      const resizedImageBuffer = await sharp(blob)
        .resize(300, 300, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .toBuffer();

      // Neuen Blob-Namen erstellen
      const thumbnailName = `thumb-${context.triggerMetadata.name}`;

      // Thumbnail hochladen
      const blockBlobClient =
        thumbnailContainer.getBlockBlobClient(thumbnailName);
      await blockBlobClient.upload(
        resizedImageBuffer,
        resizedImageBuffer.length
      );

      context.log(`Bild erfolgreich verarbeitet: ${thumbnailName}`);
    } catch (error) {
      context.log.error("Fehler beim Verarbeiten des Bildes:", error);
      throw error;
    }
  },
});
