#!/bin/sh
set -eu

ROOT_DIR=/usr/share/nginx/html
ENV_FILE="$ROOT_DIR/env.js"

echo "Generating runtime environment config at $ENV_FILE"

{
  printf 'window.__ENV__ = {\n'
  
  # Process all VITE_* variables first
  env | grep '^VITE_' | while IFS='=' read -r key value; do
    escaped_value=$(printf '%s' "$value" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g')
    printf '  "%s": "%s",\n' "$key" "$escaped_value"
  done
  
  # Process VUE_APP_* variables and convert to VITE_ format
  # Only add if VITE_ version doesn't already exist
  env | grep '^VUE_APP_' | while IFS='=' read -r key value; do
    vite_key=$(echo "$key" | sed 's/^VUE_APP_/VITE_/')
    
    # Check if VITE_ version exists in environment
    if ! env | grep -q "^${vite_key}="; then
      escaped_value=$(printf '%s' "$value" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g')
      printf '  "%s": "%s",\n' "$vite_key" "$escaped_value"
    fi
  done
  
  printf '};\n'
} > "$ENV_FILE"

echo "Runtime config generated successfully"