<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style>
  * {
    box-sizing: border-box;
  }

  body {
    padding: 0;
    margin: 0;
  }

  #app {
    padding: 0;
    margin: 0;
    height: 100vh;
    width: 100vw;
  }
</style>

<script>
  export default {
    name: "qtsukuba-score-manager",
  }
</script>
