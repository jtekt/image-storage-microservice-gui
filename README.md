# Storage microservice GUI

GUI for the image storage microservice


## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| VUE_APP_STORAGE_SERVICE_API_URL | true |The URL of the storage service |
| VUE_APP_LOGIN_URL | false | Login URL of the authentication service |
| VUE_APP_IDENTIFICATION_URL | false | identification URL of the authentication service |

Note: authentication is enabled when VUE_APP_LOGIN_URL and VUE_APP_IDENTIFICATION_URL are both set


## Deployment

### Docker

```
docker run -e VUE_APP_STORAGE_SERVICE_API_URL=http://storage-ms-url 172.16.98.151:5000/image-storage-front-vuetify
```
