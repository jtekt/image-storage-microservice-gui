<template>
  <div class="home">
    <h1>About</h1>
    <p>Storage microservice, Maxime MOREILLON</p>
    <h2>Usage</h2>
    <p>POST {{api_url}}/collections/{YOUR COLLECTION}</p>
    <p>Content-Type: multipart/form-data with image as file called "image"</p>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'About',
  components: {

  },
  data(){
    return {
      api_url: process.env.VUE_APP_STORAGE_SERVICVE_API_URL
    }
  },

}
</script>

<style scoped>



</style>
