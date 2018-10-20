<template>
  <div>
    <select v-model="ruleKey">
      <option
        v-for="option in ruleOptions" 
        :key="option.key"
        :value="option.key">{{ option.label }}</option>
    </select>
    <span>
      slasherId: {{ slasherId }}
    </span>
    <player-control
      v-for="(playerId, no) in playerOrder"
      :key="playerId"
      :player-id="playerId"
      :player-no="no + 1"></player-control>
    <button @click="appendPlayer">append</button>
    <button @click="resolveSlash">resolve</button>
  </div>
</template>

<script>
  import { mapState } from "vuex"
  import PlayerControl from "./PlayerControl.vue"

  export default {
    components: { PlayerControl },
    computed: {
      ruleKey: {
        get() {
          return this.$store.state.ruleKey
        },
        set(value) {
          this.push("setRule", value)
        }
      },
      ...mapState({
        ruleOptions: state => state.ruleOptions,
        slasherId: state => state.slasherId,
        playerOrder: state => state.playerOrder,
      })
    },
    methods: {
      appendPlayer() {
        this.push("appendPlayer")
      },
      resolveSlash() {
        this.push("resolveSlash")
      }
    }
  }
</script>
