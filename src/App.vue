<template>
  <div id="app">

    <nav>
      <router-link :to="{ name: 'List'}">List</router-link>
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
  color: white;
  align-items: stretch;
}

nav a {
  font-weight: bold;
  text-decoration: none;
  padding: 0.5em;
  color: currentColor;
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

.spacer {
  flex-grow: 1;
}

.signature {
  display: flex;
  align-items: center;
  font-size: 120%;
}

.signature img {
  width: 1.5em;
  height: 1.5em;
  margin: 0.5em;
}
</style>
