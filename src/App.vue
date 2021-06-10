<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark >
      <v-app-bar-title>Image storage service GUI</v-app-bar-title>

    </v-app-bar>

    <v-main>
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
