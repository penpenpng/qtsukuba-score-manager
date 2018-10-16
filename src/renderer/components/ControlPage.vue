<template>
  <div>
    <span>
      slasher: {{ slasher }}
    </span>
    <player-control
      v-for="player in players"
      :key="player.id"
      :player-id="player.id"></player-control>
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
  }
</script>
