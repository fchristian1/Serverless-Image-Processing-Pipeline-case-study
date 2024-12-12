#!/bin/bash
if [ -f .env ]; then
    source .env
fi
LOCATION="germanywestcentral"
FUNCTION_APP_NAME=$STORAGE_ACCOUNT_NAME"funktion"

# 1. Azure Function App erstellen
az functionapp create \
    --resource-group $RESOURCE_GROUP \
    --consumption-plan-location $LOCATION \
    --name $FUNCTION_APP_NAME \
    --storage-account $STORAGE_ACCOUNT_NAME \
    --runtime node \
    --runtime-version 20 \
    --functions-version 4 \
    --os-type Linux
# 2. Connection-String als Umgebungsvariable setzen
CONNECTION_STRING=$(az storage account show-connection-string \
    --resource-group $RESOURCE_GROUP \
    --name $STORAGE_ACCOUNT_NAME \
    --query connectionString -o tsv)

az functionapp config appsettings set \
    --name $FUNCTION_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --settings "imagewall_STORAGE=$CONNECTION_STRING"

# 3. Ins lokale Projektverzeichnis wechseln
cd ../2-azure-function/

# 4. Funktion bereitstellen
echo "Bereitstellen der Azure Function..."
npm install
npm prune --production
func azure functionapp publish $FUNCTION_APP_NAME
echo "Azure Function bereitgestellt."
