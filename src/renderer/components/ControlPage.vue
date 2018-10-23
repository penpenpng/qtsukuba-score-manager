<template>
  <div class="control-page">
    <label>
      ルール: 
      <select v-model="ruleKey">
        <option
          v-for="option in ruleOptions" 
          :key="option.key"
          :value="option.key">{{ option.label }}</option>
      </select>
    </label>
    <base-button @click.native="appendPlayer">プレイヤーを追加</base-button>

    <h1>スコア操作</h1>
    <player-control
      v-for="(playerId, no) in playerOrder"
      :key="playerId"
      :player-id="playerId"
      :player-no="no + 1"></player-control>
    <base-button @click.native="reset">リセット</base-button>
    <base-button @click.native="resolveSlash">スコア処理</base-button>
    <base-button @click.native="redo">スコア処理をキャンセルする</base-button>

    <h1>クイズ表示制御</h1>
    <QuizControl></QuizControl>
    <base-button @click.native="selectAndReadCsv">read csv</base-button>
  </div>
</template>

<style lang="scss" scoped>
  .control-page {
    padding: 20px;

    h1 {
      font-size: 1.5rem;
      padding: 10px;
      padding-left: 20px;
      margin: 0;
      font-weight: normal;
    }  
  }
  
</style>


<script>
  import { mapState } from "vuex"
  import PlayerControl from "./ControlPage/PlayerControl.vue"
  import QuizControl from "./ControlPage/QuizControl.vue"

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
      },
      redo() {

      },
      reset() {
        this.push("resetSelections")
      },
    }
  }
</script>
