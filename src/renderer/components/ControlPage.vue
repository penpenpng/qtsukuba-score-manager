<template>
  <div>
    <span>
      slasher: {{ slasher }}
    </span>
    <player-control
      v-for="player in players"
      :key="player.id"
      :player-id="player.id"></player-control>
    <button @click="appendPlayer">append</button>
  </div>
</template>

<script>
  import { mapState } from "vuex"
  import PlayerControl from "./PlayerControl.vue"

  export default {
    components: { PlayerControl },
    computed: mapState({
      slasher: state => state.slasher,
      players: state => state.players,
    }),
    methods: {
      appendPlayer() {
        this.$store.commit("appendPlayer")
      }
    }
  }
</script>
