<template>
  <div id="app">
    <router-view /> <!-- This renders your page-level components like MainPage, AdminLogin, etc. -->
  </div>
</template>

<script setup>
// No script needed unless you're adding global logic or layout elements
</script>

<style>
/* Global styles */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  box-sizing: border-box;
  overflow-x: hidden; /* Prevent horizontal scrolling */
  overflow-y: auto; /* Allow vertical scrolling */
}

#app {
  height: 100%;
  min-height: 100vh;
}

*, *::before, *::after {
  box-sizing: inherit;
}
</style>
