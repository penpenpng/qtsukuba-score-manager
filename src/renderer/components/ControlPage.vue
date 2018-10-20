<template>
  <div>
    <select v-model="ruleKey">
      <option
        v-for="option in ruleOptions" 
        :key="option.key"
        :value="option.key">{{ option.label }}</option>
    </select>
    <ul>
      <li> slasherId: {{ slasherId }} </li>
      <li> ranking: {{ ranking }} </li>
    </ul>
    <player-control
      v-for="(playerId, no) in playerOrder"
      :key="playerId"
      :player-id="playerId"
      :player-no="no + 1"></player-control>
    <button @click="appendPlayer">append</button>
    <button @click="resolveSlash">resolve</button>
    <QuizControl></QuizControl>
  </div>
</template>

<script>
  import { mapState } from "vuex"
  import PlayerControl from "./PlayerControl.vue"
  import QuizControl from "./QuizControl.vue"

  export default {
    components: {
      PlayerControl,
      QuizControl,
    },
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
        ranking: state => state.ranking,
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
