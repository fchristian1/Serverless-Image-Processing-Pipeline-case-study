import logging
import azure.functions as func
from azure.storage.blob import BlobServiceClient
import uuid

# Verbindung zum Blob Storage
CONNECTION_STRING = "<STORAGE_ACCOUNT_CONNECTION_STRING>"
blob_service_client = BlobServiceClient.from_connection_string(CONNECTION_STRING)
input_container = "input-images"

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('HTTP trigger function processed a request.')

    # Datei aus dem Request holen
    try:
        file = req.files['file']
        if not file:
            return func.HttpResponse("No file provided", status_code=400)

        # Eindeutiger Dateiname
        unique_filename = str(uuid.uuid4()) + "-" + file.filename

        # Datei in den Blob Container hochladen
        blob_client = blob_service_client.get_blob_client(container=input_container, blob=unique_filename)
        blob_client.upload_blob(file.stream)

        return func.HttpResponse(f"File uploaded successfully as {unique_filename}", status_code=200)
    except Exception as e:
        logging.error(f"Error: {e}")
        return func.HttpResponse(f"Error: {str(e)}", status_code=500)
