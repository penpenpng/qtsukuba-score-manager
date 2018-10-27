<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style lang="scss">
  * {
    box-sizing: border-box;
  }

  body {
    padding: 0;
    margin: 0;
  }

  @font-face {
    font-family: Play;
    src: url("~@/assets/Play/Play-Regular.ttf");
  }

  @font-face {
    font-family: "M PLUS 1p";
    src: url("~@/assets/M_PLUS_1p/MPLUS1p-Regular.ttf");
    font-style: normal;
    font-weight: 400;
  }

  @font-face {
    font-family: "M PLUS 1p";
    src: url("~@/assets/M_PLUS_1p/MPLUS1p-Light.ttf");
    font-style: normal;
    font-weight: 300;
  }
</style>

<script>
  export default {
    name: "qtsukuba-score-manager",
  }
</script>
