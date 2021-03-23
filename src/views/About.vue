<template>
  <div class="about">
    <h1>Image storage service GUI</h1>
    <p>Developed by Maxime MOREILLON</p>
    <p>Version {{version}}</p>
    <p>API URL: {{api_url || 'Undefined'}}</p>
    <p>WS URL: {{ws_url || 'Undefined'}}</p>
  </div>
</template>

<script>
import pjson from '@/../package.json'
export default {
  name: 'About',
  data () {
    return {
      version: pjson.version,
      api_url: process.env.VUE_APP_STORAGE_SERVICE_API_URL,
      ws_url: process.env.VUE_APP_WS_SERVER_URL,
    }
  },
}
</script>
