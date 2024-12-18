# Serverless-Image-Processing-Pipeline-case-study
## This is a lerning for a case to study the way, show and understanding the techniques and difficulties and practice in devops
### the Case:
Your team works for a photography startup, PixelPerfect. The company wants to provide customers with resized images for social media. As part of the engineering team, you’ve been tasked with setting up a pipeline where users can upload images to a storage system, which will then be resized automatically and made available for download. The CTO expects a scalable and cost-effective serverless solution.

### the Study:

Domain: Resize Images Serverless and get back a Download Link

Systems: 
- Azure Function to get a Files Upload Request -> Resize the images -> zip the files -> Save to a Stoarage -> Response a Download Link
  - why:
    - Use the function as api endpoint. You can use for an integrated system or with a small html website to upload data and make the size specifications.
    - It is scaleable and cost effective serverles solution.

- Azure Storage Container to store the files for re-download in a certain period of time
  - why:
    - Configure the container blob so that it only saves files for a few days or hours and then deletes them automatically
    - Hold the Azur Function and the data is simple system and rights management.

Pros:
  - its simple to manage the service, on failure restart the function, with hardening in the function can the system running stable.
  - the deployment is simple with az cli
  - a rewrite to aws or onpremies is simple, no IaaS use or complicated systems.
  - simple to intergrate or extend to a existing system

Cons:
  - with larger images or many images to download, the costs can be high, if you limit this, the function may be more complicated to maintain and understand
  - its a simple service, wenn you provide more functions to this system its a rewrite to an microservice or iaas(vm) better.
  - the function with multipart upload request is complicatet to handel all different types of upload methods.

Tasks:
  - create a Azure Function with HTTP Trigger in a new Storage Container Account
  - create a Test HTML Site to send Form Files Uploads
  - test the Endpoint with Postman or others
  - write scripts in your prefered lang (bash, powershell) with az cli to create and deploy the storage and the function
