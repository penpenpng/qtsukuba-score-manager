<template>
  <div class="player-view">
    <div class="no">No. {{ playerNo }}</div>
    <div class="name">{{ player.name }}</div>
    <div
      v-for="scoreKey in Object.keys(player.score)"
      :key="scoreKey"
      class="score-wrapper">
      <div class="score">
        {{ player.score[scoreKey].value }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .player-view {
    height: 100%;
    width: 80px;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    grid-auto-columns: 1fr;
    grid-auto-rows: 5rem;
    box-shadow: 0 0 2px 0px darkgrey;

    .no {
      border-bottom: solid 1px;
      text-align: center;
    }

    .name {
      padding-top: 10px;
      writing-mode: vertical-rl;
      justify-self: center;
      font-size: 3rem;
    }

    .score-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      background: lightblue;

      .score {
        font-size: 4rem;
      }
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
