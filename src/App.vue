<template>
  <div id="app">
    <header>
      <div class="application_title">
        {{application_name}}
      </div>
    </header>

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


    </nav>

    <main>
      <router-view/>
    </main>

    <footer>
      <img src="@/assets/logo.png" alt="">
      <div class="">
        <div class="">
          {{application_name}}
        </div>
        <div class="">
          Maxime MOREILLON
        </div>

      </div>

    </footer>
  </div>
</template>

<script>

export default {
  name: 'App',
  data() {
    return {
      application_name: 'Image storage'
    }
  }

}
</script>

<style>
body {
  margin: 0;
  box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
}




header {
  font-size: 150%;
  background-color: #444444;
  color: white;
  padding: 15px;
}


nav {
  padding: 15px;
  font-weight: bold;
  display: flex;
  align-items: center;
}
nav a {
  color: currentColor;
  text-decoration: none;
}

nav a:hover {
  color: #c00000;
}

nav > * {
  margin-right: 15px;
}


main {
  flex-grow: 1;
  margin: 0 15px;
}

footer {
  margin-top: 1em;
  margin-left: 1em;
  margin-right: 1em;
  border-top: 1px solid #dddddd;
  padding: 1em;
  display: flex;
  align-items: center;
  justify-content: center;
}


footer img {
  width: 2em;
  height: 2em;
}

.spacer {
  flex-grow: 1;
}

.loader_container {
  text-align: center;
  font-size: 200%;
}


.error {
  color: #c00000;
}


footer > div {
  margin-left: 0.5em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}
</style>
