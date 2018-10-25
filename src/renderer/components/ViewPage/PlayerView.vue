<template>
  <div class="player-view-wrapper">
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
    <div class="rank" :class="{ norank: !isRanked }">{{ rank }}</div>
  </div>
</template>

<style lang="scss" scoped>
  .player-view-wrapper {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto;
  }

  .rank {
    font-size: 2rem;
    font-weight: bold;
    padding: 5px;
    text-align: center;
    color: red;

    &.norank {
      color: transparent;
    }
  }

  .player-view {
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
      rank() {
        let rank = this.player.rank
        if (rank == null)
          return "---"
        
        let suf = ""
        if (rank == 11 || rank == 12 || rank == 13) {
          suf = "th"
        } else if (rank % 10 == 1) {
          suf = "st"
        } else if (rank % 10 == 2) {
          suf = "nd"
        } else if (rank % 10 == 3) {
          suf = "rd"
        }

        return `${rank}${suf}`
      },
      isRanked() {
        return this.rank !== "---"
      },
      ...mapState({
        scoreDefinitions: (state) => state.scoreDefinitions,
      })
    }
  }
</script>
