<template>
  <div class="home">
    <h1>Storage MS GUI</h1>
    <h2>System map</h2>
    <div class="image_wrapper">
      <img src="@/assets/system_map.png" alt="">
    </div>
    <h2>Source code</h2>
    <ul>
      <li>
        <a href="http://172.16.98.151:8081/tokushima_k3s/watch_service">Watch microservice</a>
      </li>
      <li>
        <a href="http://172.16.98.151:8081/tokushima_k3s/storage_microservice">Storage microservice</a>
      </li>
      <li>
        <a href="http://172.16.98.151:8081/mike_k8s/tokushima_storage_microservice_front">Storage microservice UI</a>
      </li>
      <li>
        <a href="http://172.16.98.151:8081/tokushima_k3s/tokushima_tf2.0">AI classifier</a>
      </li>
      <li>
        <a href="http://172.16.98.151:8081/kojima/tokushima_result_viewer">Analytics microservice</a>
      </li>

    </ul>


  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {

  }
}
</script>

<style scoped>
.image_wrapper {
  text-align: center;
}

img {
  max-width: 75%;
}

li a {
  text-decoration: none;
  font-weight: bold;
  color: #c00000;
}
</style>
