<template>
  <div class="player-control">
    <div class="actions">
      <span> No. {{ playerNo }} </span>
      <input type="radio" :value="playerId" v-model="slasherId">
      <input type="checkbox" :value="playerId" v-model="correctlyAnswererIds">
    </div>
    <input type="text" v-model="name">
    <input
      v-for="scoreKey in Object.keys(player.score)"
      :key="scoreKey"
      type="number"
      :value="player.score[scoreKey].value"
      @input="updateScore($event, scoreKey)">
    <button @click="deletePlayer">delete</button>
  </div>
</template>

<style scoped lang="scss">
  .player-control {
    background: ivory;
    display: flex;
    flex-direction: row;
    align-items: center;

    .actions {
      padding: 10px;
      margin-right: 10px;
      background: thistle;
    }
  }
</style>

<script>
  export default {
    props: [
      "playerId",
      "playerNo",
    ],
    computed: {
      player() {
        return this.$store.state.players[this.playerId]
      },
      scoreDefinitons() {
        return this.$store.state.scoreDefinitons
      },
      correctlyAnswererIds: {
        get() {
          return this.$store.state.correctlyAnswererIds
        },
        set(value) {
          this.push("updateCorrectlyAnswererIds", value)
        },
      },
      slasherId: {
        get() {
          return this.$store.state.slasherId
        },
        set(value) {
          this.push("updateSlasherId", value)
        },
      },
      name: {
        get() {
          return this.player.name
        },
        set(value) {
          this.push("updatePlayerName", {
            id: this.playerId,
            name: value,
          })
        },
      },
    },
    methods: {
      updateScore(e, key) {
        this.push("updateScore", {
          playerId: this.playerId,
          scoreKey: key,
          value: e.target.value,
        })
      },
      deletePlayer() {
        this.push("deletePlayer", this.playerId)
      },
    }
  }
</script>
