<template>
  <div>
    <div class="header">HEADER</div>
    <div class="body">
      <player-view
        v-for="(playerId, no) in playerOrder"
        :key="playerId"
        :player-id="playerId"
        :player-no="no + 1"></player-view>
    </div>
    <div class="hint">HINT</div>
  </div>
</template>

<style lang="scss" scoped>
  .body {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }
</style>

<script>
  import { mapState } from "vuex"
  import PlayerView from "./ViewPage/PlayerView.vue"

  export default {
    components: {
      PlayerView,
    },
    computed: mapState({
      playerOrder: state => state.playerOrder,
    })
  }
</script>
