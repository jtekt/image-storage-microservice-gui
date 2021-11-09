<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark>
      <v-toolbar-title>Image storage service</v-toolbar-title>
    </v-app-bar>

    <v-main class="grey lighten-4">
      <v-container>
        <router-view/>
      </v-container>
    </v-main>
    
  </v-app>

</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
};
</script>
