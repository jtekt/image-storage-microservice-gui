<template>
  <div class="about">
    <h1>Annotation tool</h1>
    <p>Developed by Maxime MOREILLON</p>
    <p>Version {{version}}</p>
    <p>Storage service URL: {{api_url || 'Undefined'}}</p>
  </div>
</template>

<script>
import pjson from '@/../package.json'
export default {
  name: 'About',
  data () {
    return {
      version: pjson.version,
      shinsei_manager: process.env.VUE_APP_SHINSEI_MANAGER_URL,
      api_url: process.env.VUE_APP_STORAGE_SERVICE_API_URL
    }
  },
}
</script>
