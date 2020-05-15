<template>
  <div class="home">
    <h1>Live results</h1>
    <img :src="img_src">
    <div class="">
      {{prediction}}
    </div>
  </div>
</template>

<script>

export default {
  name: 'Home',
  components: {

  },
  data(){
    return {
      img_src : 'http://172.16.98.151:31616/test_10_0.jpg',
      prediction: 0.5,
    }
  },
  sockets: {
    outer(val) {
      console.log(val)
    }
  },
}
</script>
