<template>
  <div id="app">
    <nav>
      <router-link :to="{ name: 'home', params: {} }">
        Collections
      </router-link>

      <template v-if="$route.params.collection">
        <span>></span>
        <router-link :to="{ name: 'collection', params: {collection: $route.params.collection} }">
          {{$route.params.collection}}
        </router-link>
      </template>

      <template v-if="$route.params.entry_id">
        <span>></span>
        <span>
          {{$route.params.entry_id}}
        </span>
      </template>

      <div class="spacer"/>

      <router-link :to="{ name: 'about'}" class="about">
        <InformationOutlineIcon />
      </router-link>

    </nav>
    <main>
      <router-view/>
    </main>

  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'
import 'vue-material-design-icons/styles.css';
import InformationOutlineIcon from 'vue-material-design-icons/InformationOutline.vue';

export default {
  name: 'App',
  components: {
    InformationOutlineIcon,
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
}

nav {
  background-color: #444444;
  color: white;
  padding: 1em 1em;
  font-weight: bold;
  display: flex;
  align-items: center;
}
nav a {
  color: currentColor;
  text-decoration: none;


}

nav a:hover {
  color: #dddddd;
}

nav > * {
  margin-right: 0.5em;
}


main {
  margin: 0 1em;
}

.spacer {
  flex-grow: 1;
}

.loader_container {
  text-align: center;
  font-size: 200%;
}

.about {
  font-size: 120%;
}
</style>
