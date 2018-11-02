<template>
  <div class="image-view">
    <img :src="src">
  </div>
</template>

<style lang="scss">
  .image-view {
    display: flex;
    justify-content: center;
    align-items: center;
    background: white;
    box-shadow: 0 0 2px 0px grey;
    padding: 10px;

    img {
      display: block;
      height: 100%;
      max-height: 100%;
      max-width: 100%;
    }
  }
</style>

<script>
  import {
    mapState,
    mapGetters,
  } from "vuex"
  
  export default {
    computed: {
      src() {
        let path = this.currentQuestion.path
        if (path)
          return this.loadImageAsBase64(path)
        else
          return ""
      },
      ...mapState({
      }),
      ...mapGetters([
        "currentQuestion",
      ])
    }
  }
</script>
