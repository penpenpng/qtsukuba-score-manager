<template>
  <div class="player-control">
    <input type="radio" :value="playerId" v-model="slasher">
    <span>name: {{ player.name }}</span>
  </div>
</template>

<style scoped lang="scss">

</style>

<script>
  export default {
    props: ["playerId"],
    computed: {
      slasher: {
        get() {
          return this.$store.state.slasher
        },
        set(value) {
          this.$store.commit("updateSlasher", value)
        },
      },
      player() {
        return this.$store.getters.player(this.playerId)
      },
    },
  }
</script>
