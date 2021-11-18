<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark>
      <v-toolbar-title>Image storage service</v-toolbar-title>
      <v-spacer/>
      <v-btn
        text
        :to="{name: 'about'}">
        <v-icon>mdi-information-outline</v-icon>
        <span class="ml-2">About</span>
      </v-btn>
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
