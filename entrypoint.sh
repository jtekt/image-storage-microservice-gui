#!/bin/sh

ROOT_DIR=/app

# Replace env vars in files served by NGINX
echo "Replacing environment variables"
for file in $ROOT_DIR/js/*.js* $ROOT_DIR/index.html $ROOT_DIR/precache-manifest*.js;
do
  echo "Processing $file ...";

  sed -i 's|VITE_IMAGE_STORAGE_API_URL_PLACEHOLDER|'${VITE_IMAGE_STORAGE_API_URL}'|g' $file
  sed -i 's|VITE_CATEGORIZER_PLACEHOLDER|'${VITE_CATEGORIZER}'|g' $file
  sed -i 's|VITE_FOLDER_STRUCTURE_PLACEHOLDER|'${VITE_FOLDER_STRUCTURE}'|g' $file

  # OIDC
  sed -i 's|VITE_OIDC_AUTHORITY_PLACEHOLDER|'${VITE_OIDC_AUTHORITY}'|g' $file
  sed -i 's|VITE_OIDC_CLIENT_ID_PLACEHOLDER|'${VITE_OIDC_CLIENT_ID}'|g' $file



done

echo "Starting Nginx"
nginx -g 'daemon off;'
