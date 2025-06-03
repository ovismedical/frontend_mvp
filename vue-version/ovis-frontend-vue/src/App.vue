<template>
  <div id="app">
    <router-view /> <!-- This renders your page-level components like MainPage, AdminLogin, etc. -->
  </div>
</template>

<script setup>
// No script needed unless you're adding global logic or layout elements
</script>

<style>
/* Optional: Global styles */
body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
}
</style>
