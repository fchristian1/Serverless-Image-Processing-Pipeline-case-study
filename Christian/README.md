# automate serverless imagewall


## usage

```bash
git clone https://github.com/fchristian1/Serverless-Image-Processing-Pipeline-case-study.git
cd Serverless-Image-Processing-Pipeline-case-study/Christian/3-automation
az login
./init
```


- clone the repo
- got to Christian/3-automation/
- login to azur cli "az login"
- call ./init and give the resurce group name and then the name of the app name ... "imageswall"
- on finish the http address is in link.txt in 3-automation folder

## init
- init create a .env and save the resurcegruopname and the app name.
- on seccond call init use the .env and dont show the promt to give the data.
- make changes to the files "index.html" or "storageBlobTrigger1.js" and then call init to make the changess online.
