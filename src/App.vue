<template>
  <div id="app">

    <nav>
      <router-link to="/">Home</router-link>
      <router-link :to="{ name: 'List', query: {collection: 'outer'} }">Outer</router-link>
      <router-link :to="{ name: 'List', query: {collection: 'inner'} }">Inner</router-link>
    </nav>
    <main>
      <router-view/>
    </main>

  </div>
</template>

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
  display: flex;
  background-color: #444444;

}

nav a {
  font-weight: bold;
  text-decoration: none;
  padding: 0.5em;
  color: white;
  border-top: 0.25em solid transparent;
  border-bottom: 0.25em solid transparent;
}

nav a:hover {
  border-bottom-color: #dddddd;
}
nav a.router-link-exact-active {
  border-bottom-color: #c00000;
}

main {
  margin: 0 1em;
}
</style>
