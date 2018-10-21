<template>
  <div class="player-view">
    <div class="no">No. {{ playerNo}}</div>
    <div class="name">{{ player.name }}</div>
    <div
      v-for="scoreKey in Object.keys(player.score)"
      :key="scoreKey"
      class="score">{{ player.score[scoreKey].value }}</div>
  </div>
</template>

<style lang="scss" scoped>
  .player-view {
    height: 300px;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    grid-auto-columns: 1fr;
    grid-auto-rows: 50px;
    box-shadow: 0 0 2px 0px darkgrey;

    .no {
      border-bottom: solid 1px;
    }

    .name {
      writing-mode: vertical-rl;
      justify-self: center;
    }

    .score {
      background: lightblue;
      text-align: center;
    }
  }
</style>

<script>
  import { mapState } from "vuex"

  export default {
    props: [
      "playerId",
      "playerNo",  
    ],
    computed: {
      player() {
        return this.$store.state.players[this.playerId]
      },
      ...mapState({
        scoreDefinitions: (state) => state.scoreDefinitions,
      })
    }    
  }
</script>
