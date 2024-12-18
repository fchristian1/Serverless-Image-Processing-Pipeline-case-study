const { app } = require('@azure/functions');
const { BlobServiceClient } = require('@azure/storage-blob');
const sharp = require('sharp');
const multipart = require("parse-multipart");

const sizes = [200, 800, 1024];
app.http('uploadRawFiles', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'upload/{ref}',

    handler: async (request, context) => {
        //get files from request
        const ref = request.params.ref;
        let files = [];
        let resizedFiles = [];

        try {
            let bodyBuffer = Buffer.from(await request.arrayBuffer());
            let boundary = multipart.getBoundary(request.headers.get('content-type'));
            files = multipart.Parse(bodyBuffer, boundary);
            if (!files.length) {
                return { status: 400, body: 'No file uploaded' };
            }

        } catch (err) {
            context.error("Upload Error:", err)
        }
        //resize the images
        try {
            for (const file in files) {
                context.log(`Processing file ${file.data}`);
                for (const size of sizes) {
                    const resizedImage = await sharp(file)
                        .resize({ width: size, height: size, fit: sharp.fit.inside, withoutEnlargement: true })
                        .toBuffer();
                    const resizedFileName = `images-resize-${size}/${file.filename}`;
                    context.log(`Resizing image ${file.filename} to ${size} pixels`);
                    resizedFiles.push({ filename: resizedFileName, data: resizedImage });
                }
            }
        } catch (error) {
            context.error("Resize Error:", error)
        }
        //upload resized images to the blob storage
        try {

        } catch (error) {
            context.error("Blob Error:", error)

        }
        //package the files in zip file for response
        try {

        } catch (error) {
            context.error("Zip Error:", error)

        }
    },
});
