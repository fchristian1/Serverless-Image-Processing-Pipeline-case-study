#!/bin/bash

# Variablen anpassen
if [ -f .env ]; then
    source .env
fi
LOCATION="germanywestcentral"
CONTAINER_NAME="images"
WEBSITE_CONTAINER="\$web"
INDEX_FILE="index.html"
OUTPUT_INDEX_FILE="updated_index.html"

# Storage Account erstellen
echo "Erstelle Storage Account $STORAGE_ACCOUNT_NAME ..."
az storage account create \
    --name $STORAGE_ACCOUNT_NAME \
    --resource-group $RESOURCE_GROUP \
    --location $LOCATION \
    --sku Standard_LRS \
    --kind StorageV2

# Zugriffsschlüssel abrufen
echo "Abrufen des Storage Account Keys..."
STORAGE_KEY=$(az storage account keys list \
    --resource-group $RESOURCE_GROUP \
    --account-name $STORAGE_ACCOUNT_NAME \
    --query "[0].value" -o tsv)

# Container erstellen
echo "Erstelle Container $CONTAINER_NAME..."
az storage container create \
    --name $CONTAINER_NAME \
    --account-name $STORAGE_ACCOUNT_NAME \
    --account-key $STORAGE_KEY

# SAS-Token erstellen (gültig für 7 Tage)
echo "Erstelle SAS-Token..."
SAS_TOKEN=$(az storage account generate-sas \
    --account-name $STORAGE_ACCOUNT_NAME \
    --account-key $STORAGE_KEY \
    --services b \
    --resource-types sco \
    --permissions rwl \
    --expiry $(date -u -d "365 days" '+%Y-%m-%dT%H:%MZ') \
    --https-only -o tsv)

# URL des Storage Accounts erstellen
STORAGE_URL="https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net"

# Index-Datei aktualisieren
echo "Aktualisiere die Index-Datei mit der URL und dem SAS-Token..."
rm -f ../1-html_upload_site/$OUTPUT_INDEX_FILE
cp ../1-html_upload_site/$INDEX_FILE ../1-html_upload_site/$OUTPUT_INDEX_FILE
sed -i "s|###URL###|$STORAGE_URL|g" ../1-html_upload_site/$OUTPUT_INDEX_FILE
ESCAPED_SAS_TOKEN=$(printf '%s\n' "$SAS_TOKEN" | sed 's/[&/\]/\\&/g')
sed -i "s|###SAS###|$ESCAPED_SAS_TOKEN|g" ../1-html_upload_site/$OUTPUT_INDEX_FILE
# Statische Website aktivieren
echo "Aktiviere statische Website..."
az storage blob service-properties update \
    --account-name $STORAGE_ACCOUNT_NAME \
    --static-website \
    --404-document "index.html" \
    --index-document "index.html"

# CORS-Einstellungen setzen
echo "Setze CORS-Einstellungen..."
az storage cors add \
    --methods GET POST PUT \
    --origins "*" \
    --allowed-headers "*" \
    --exposed-headers "*" \
    --max-age 3600 \
    --services b \
    --account-name $STORAGE_ACCOUNT_NAME \
    --account-key $STORAGE_KEY

# Datei in den $web Container hochladen
echo "Hochladen der $INDEX_FILE in den $WEBSITE_CONTAINER Container..."
az storage blob upload \
    --account-name $STORAGE_ACCOUNT_NAME \
    --container-name $WEBSITE_CONTAINER \
    --file ../1-html_upload_site/$OUTPUT_INDEX_FILE \
    --name "index.html" \
    --auth-mode key \
    --account-key $STORAGE_KEY \
    --overwrite

# URL der Website abrufen
WEBSITE_URL=$(az storage account show \
    --name $STORAGE_ACCOUNT_NAME \
    --resource-group $RESOURCE_GROUP \
    --query "primaryEndpoints.web" -o tsv)

rm -f ../1-html_upload_site/$OUTPUT_INDEX_FILE

echo "Erstellung abgeschlossen!"
echo "Storage Account: $STORAGE_ACCOUNT_NAME"
echo "Website verfügbar unter: $WEBSITE_URL"
echo $WEBSITE_URL >link.txt
echo "Container: $CONTAINER_NAME"
