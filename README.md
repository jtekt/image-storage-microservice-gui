# Storaqge microservice GUI

Front end for the image storage microservice

## Environment variables

| Variable | Description |
| --- | --- |
| VUE_APP_STORAGE_SERVICVE_API_URL | The URL of the storage service |
| VUE_APP_HOMEPAGE_URL | (OPTIONAL) URL of the application homepage |


## Deployment

### Docker

```
docker run -e VUE_APP_STORAGE_SERVICVE_API_URL=http://your-db-url 172.16.98.151:5000/seikaibu-storage-front
```
