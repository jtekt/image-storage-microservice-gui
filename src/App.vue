<template>
  <div id="app">
    <AppTemplate application_name="Image storage" />
  </div>
</template>

<script>
import AppTemplate from '@/components/AppTemplate.vue'


export default {
  name: 'App',
  components: {
    AppTemplate
  },
  data() {
    return {
      application_name: 'Annotation tool'
    }
  }

}
</script>
