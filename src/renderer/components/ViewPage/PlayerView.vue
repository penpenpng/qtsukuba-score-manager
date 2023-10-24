<template>
  <div class="player-view-wrapper">
    <div
      class="player-view"
      :class="{marked: marked}">
      <div class="no">No. {{ playerNo }}</div>
      <div class="name">{{ player.name }}</div>
      <div
        v-for="scoreKey in Object.keys(player.score)"
        :key="scoreKey"
        class="score-wrapper">
        <div
          class="score"
          :class="{'animated flip': player.score[scoreKey].animating }"
          @animationend="endAnimating(playerId, scoreKey)">
          <span>{{ player.score[scoreKey].value }}</span>
        </div>
      </div>
    </div>
    <div
      class="rank"
      :class="{'ranked animated fadeIn delay-2s': isRanked }">
      {{ rank }}
    </div>
  </div>
</template>

<style scoped>
  .player-view-wrapper {
    width: 150px;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto;
  }

  .rank {
    font-size: 2rem;
    font-weight: bold;
    padding: 5px;
    text-align: center;
    color: transparent;
    justify-self: center;
  }
  .rank.ranked {
    color: red;
  }

  .player-view {
    width: 100px;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    grid-auto-columns: 1fr;
    grid-auto-rows: 5rem;
    box-shadow: 0 0 2px 0 darkgrey;
    font-family: "M PLUS 1p", sans-serif;
    justify-self: center;
  }
  .player-view.marked {
    box-shadow: 0 0 3px 0 blue;
  }
  .player-view .no {
    border-bottom: solid 1px;
    text-align: center;
    font-weight: 400;
  }
  .player-view .name {
    writing-mode: vertical-rl;
    text-align: center;
    justify-self: center;
    font-weight: 300;
    font-size: 3rem;
    padding: 10px;
  }
  .player-view .score-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff1e6;
  }
  .player-view .score-wrapper .score {
    font-family: "Play", sans-serif;
    font-size: 4rem;
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
      marked() {
        return this.$store.state.markedId === this.playerId
      },
      rank() {
        let rank = this.player.rank
        // if (rank == null)
        //   return "---"

        // let suf = ""
        // if (rank == 11 || rank == 12 || rank == 13) {
        //   suf = "th"
        // } else if (rank % 10 == 1) {
        //   suf = "st"
        // } else if (rank % 10 == 2) {
        //   suf = "nd"
        // } else if (rank % 10 == 3) {
        //   suf = "rd"
        // }

        // return `${rank}${suf}`

        if (rank != null && rank > 0) {
          return "Winner!"
        } else {
          return "---"
        }
      },
      isRanked() {
        return this.player.rank !== null
      },
      ...mapState({
        scoreDefinitions: state => state.scoreDefinitions,
      })
    },
    methods: {
      endAnimating(playerId, scoreKey) {
        this.push("endAnimating", {playerId, scoreKey})
      }
    }
  }
</script>
