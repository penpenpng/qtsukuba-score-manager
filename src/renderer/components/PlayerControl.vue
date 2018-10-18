<template>
  <div class="player-control">
    <input type="radio" :value="playerId" v-model="slasher">
    <input type="checkbox" :value="playerId" v-model="correct">
    <input type="text" v-model="name">
    <span>name: {{ player.name }}</span>
  </div>
</template>

<style scoped lang="scss">

</style>

<script>
  export default {
    props: ["playerId"],
    computed: {
      player() {
        return this.$store.getters.player(this.playerId)
      },
      correct: {
        get() {
          return this.$store.state.correct
        },
        set(value) {
          this.$store.commit("updateCorrect", value)
        },
      },
      slasher: {
        get() {
          return this.$store.state.slasher
        },
        set(value) {
          this.$store.commit("updateSlasher", value)
        },
      },
      name: {
        get() {
          return this.player.name
        },
        set(value) {
          this.$store.commit("updatePlayerName", {
            id: this.playerId,
            name: value,
          })
        },
      },
    },
  }
</script>
