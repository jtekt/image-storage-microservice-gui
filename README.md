# Storage microservice GUI

GUI for the image storage microservice

## Environment variables

| Variable | Description |
| --- | --- |
| VUE_APP_STORAGE_SERVICE_API_URL | The URL of the storage service |
| VUE_APP_WS_SERVER_URL | Should match VUE_APP_STORAGE_SERVICE_API_URL |


## Deployment

### Docker

```
docker run -e VUE_APP_STORAGE_SERVICVE_API_URL=http://storage-ms-url 172.16.98.151:5000/image-storage-front
```
