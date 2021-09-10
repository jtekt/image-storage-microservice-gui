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
      <AuthenticationWall
        v-if="use_auth"
        :options="auth_options">
        <v-container fluid>
          <router-view/>
        </v-container>
      </AuthenticationWall>

      <v-container fluid v-else>
        <router-view/>
      </v-container>

    </v-main>

  </v-app>
</template>

<script>
import AuthenticationWall from '@moreillon/vue_authentication_wall_vuetify'

export default {
  name: 'App',
  components: {
    AuthenticationWall
  },
  data: () => ({
    use_auth: process.env.VUE_APP_LOGIN_URL && process.env.VUE_APP_IDENTIFICATION_URL,
    auth_options: {
      title: 'Image storage service GUI',
      login_url: process.env.VUE_APP_LOGIN_URL,
      identification_url: process.env.VUE_APP_IDENTIFICATION_URL,
    },
    nav: [
      {title: 'My profile', to: {name: 'employee', params: {employee_id: 'self'} }, icon: 'mdi-account'},
      {title: 'Employees', to: {name: 'employees' }, icon: 'mdi-account-search'},
      {title: 'Groups', to: {name: 'groups' }, icon: 'mdi-account-multiple'},
      {title: 'Workplaces', to: {name: 'workplaces' }, icon: 'mdi-office-building'},
      {title: 'About', to: {name: 'about'}, icon: 'mdi-information-outline'},
    ]
  }),
}
</script>
