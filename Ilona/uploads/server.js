const express = require("express");
const multer = require("multer");
const {
  BlobServiceClient,
  StorageSharedKeyCredential,
} = require("@azure/storage-blob");
const path = require("path");
require("dotenv").config(); // Lädt die Umgebungsvariablen aus der .env-Datei

// Azure Blob Storage-Konfiguration
const storageKey = process.env.AZURE_STORAGE_KEY; // Lade den Azure Storage Key aus der .env-Datei
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME; // Lade den Account-Namen aus der .env-Datei
const containerName = "images"; // Der Name des Containers, den du erstellt hast

console.log(storageKey);
if (!storageKey || !accountName) {
  throw new Error(
    "AZURE_STORAGE_KEY und AZURE_STORAGE_ACCOUNT_NAME müssen in .env definiert sein"
  );
}

// Verbindung zu Azure Blob Storage herstellen
const credential = new StorageSharedKeyCredential(accountName, storageKey);
const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  credential
);

// Setze Multer für die Dateiübertragung
const upload = multer();

// Express-App erstellen
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "public"))); // Statische Dateien aus dem 'public'-Ordner bereitstellen
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html")); // Gibt die 'index.html' aus dem 'public'-Ordner zurück
});

app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("Keine Datei hochgeladen");
  }

  try {
    console.log("Container-Client wird abgerufen...");
    const containerClient = blobServiceClient.getContainerClient(containerName);

    console.log("Blob-Client für die Datei wird erstellt...");
    const blobClient = containerClient.getBlockBlobClient(
      req.file.originalname
    );

    console.log("Datei wird hochgeladen...");
    // Lade die Datei direkt in den Blob Storage hoch
    await blobClient.upload(req.file.buffer, req.file.size);

    // Erfolgreiche Antwort zurückgeben
    res.status(200).json({
      message: "Bild erfolgreich hochgeladen",
      url: blobClient.url, // URL der Datei im Blob Storage
    });
  } catch (error) {
    console.error("Fehler beim Hochladen:", error); // Detaillierte Fehlerausgabe
    res.status(500).json({
      message: "Fehler beim Hochladen des Bildes",
      error: error.message,
      stack: error.stack, // Zeigt die Stacktrace des Fehlers
    });
  }
});

// Server starten
app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});
