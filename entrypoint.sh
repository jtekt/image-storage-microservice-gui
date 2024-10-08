#!/bin/sh

ROOT_DIR=/app

# Replace env vars in files served by NGINX
echo "Replacing environment variables"
for file in $ROOT_DIR/js/*.js* $ROOT_DIR/index.html $ROOT_DIR/precache-manifest*.js;
do
  echo "Processing $file ...";

  sed -i 's|VUE_APP_IMAGE_STORAGE_API_URL_PLACEHOLDER|'${VUE_APP_IMAGE_STORAGE_API_URL}'|g' $file
  sed -i 's|VUE_APP_IDENTIFICATION_URL_PLACEHOLDER|'${VUE_APP_IDENTIFICATION_URL}'|g' $file
  sed -i 's|VUE_APP_LOGIN_URL_PLACEHOLDER|'${VUE_APP_LOGIN_URL}'|g' $file
  sed -i 's|VUE_APP_CATEGORIZER_PLACEHOLDER|'${VUE_APP_CATEGORIZER}'|g' $file
  sed -i 's|VUE_APP_FOLDER_STRUCTURE_PLACEHOLDER|'${VUE_APP_FOLDER_STRUCTURE}'|g' $file

  # OIDC
  sed -i 's|VUE_APP_OIDC_AUTHORITY_PLACEHOLDER|'${VUE_APP_OIDC_AUTHORITY}'|g' $file
  sed -i 's|VUE_APP_OIDC_CLIENT_ID_PLACEHOLDER|'${VUE_APP_OIDC_CLIENT_ID}'|g' $file
  sed -i 's|VUE_APP_OIDC_AUDIENCE_PLACEHOLDER|'${VUE_APP_OIDC_AUDIENCE}'|g' $file



done

echo "Starting Nginx"
nginx -g 'daemon off;'
