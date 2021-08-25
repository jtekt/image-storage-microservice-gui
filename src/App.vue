<template>
  <v-app>
    <v-app-bar
      app
      color="#444444"
      dark >
      <v-toolbar-title>Image storage service GUI</v-toolbar-title>
      
      <v-spacer></v-spacer>

      <v-btn
        text
        dark
        :to="{name:'about'}">
        <v-icon>mdi-information-outline</v-icon>
        <span class="ml-1">About</span>
      </v-btn>

    </v-app-bar>

    <v-main class="grey lighten-4">
      <v-container fluid>
        <router-view/>
      </v-container>
    </v-main>

  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    nav: [
      {title: 'My profile', to: {name: 'employee', params: {employee_id: 'self'} }, icon: 'mdi-account'},
      {title: 'Employees', to: {name: 'employees' }, icon: 'mdi-account-search'},
      {title: 'Groups', to: {name: 'groups' }, icon: 'mdi-account-multiple'},
      {title: 'Workplaces', to: {name: 'workplaces' }, icon: 'mdi-office-building'},
      {title: 'About', to: {name: 'about'}, icon: 'mdi-information-outline'},
    ]
  }),
};
</script>
