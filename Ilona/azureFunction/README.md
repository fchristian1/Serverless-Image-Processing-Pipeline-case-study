# Bericht: Problem mit der Azure Function und dem BlobTrigger

## Projektübersicht
Die Azure Function wurde mit einem BlobTrigger entwickelt, um auf Änderungen in einem Azure Blob-Container zu reagieren. Trotz korrekter Implementierung und Konfiguration trat das Problem auf, dass die Funktion im Azure-Portal nicht angezeigt wurde und der Trigger nicht ausgelöst wurde.

## Schritte

1. **Erstellung und Konfiguration:**
   - Azure Function mit BlobTrigger erstellt und auf Azure deployed.
   - Die Verbindungszeichenfolge zu Azure Blob Storage wurde korrekt hinterlegt.

2. **Deployment und Ausführung:**
   - Die Funktion wurde ohne Fehler auf Azure deployed, jedoch war sie im Azure-Portal nicht sichtbar.
   - Der Blob-Trigger versuchte, den Container zu erreichen, aber es trat der Fehler „ContainerNotFound“ auf.

3. **Fehlerbehebung und Logs:**
   - Es gab keine Fehlerlogs im Azure-Portal oder in den Application Insights, die zur Fehlerdiagnose hätten beitragen können.
   - Es war nicht möglich, auf Logs zuzugreifen oder Fehlerursachen nachzuvollziehen, da die Funktion weder angezeigt noch die Logs zugänglich waren.

## Ursachen

- **Verbindungsprobleme:** Die Verbindungszeichenfolge zu Azure Blob Storage war korrekt, aber der BlobTrigger konnte den Container nicht finden.
- **Fehlende Logs:** Es war nicht möglich, Logs zu sehen, da weder Fehler noch die Funktion im Portal angezeigt wurden.
- **Synchronisationsprobleme im Azure-Portal:** Die Funktion wurde möglicherweise erfolgreich deployed, aber war im Azure-Portal aufgrund einer Verzögerung oder eines Problems mit der Anzeige nicht sichtbar.

## Fazit

Obwohl alle Schritte korrekt durchgeführt wurden, konnte die Funktion weder im Azure-Portal angezeigt noch der BlobTrigger erfolgreich ausgeführt werden. Die fehlenden Logs und die fehlende Sichtbarkeit im Portal machten eine genaue Fehlerdiagnose unmöglich.

## Weitere Schritte

- **Wiederholtes Deployment:** Die Funktion sollte erneut deployed werden, um zu prüfen, ob das Problem weiterhin besteht.
- **Azure-Support kontaktieren:** Bei anhaltenden Problemen könnte der Azure-Support hinzugezogen werden.
