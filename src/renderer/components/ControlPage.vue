<template>
  <div class="control-page">
    <label>
      タイトル:
      <input type="text" v-model="title">
    </label>
    <label>
      ルール:
      <select v-model="ruleKey">
        <option
          v-for="option in ruleOptions"
          :key="option.key"
          :value="option.key">{{ option.label }}</option>
      </select>
    </label>
    <base-button @click.native="toggleViewVisibility">得点表示画面を描画する/隠す</base-button>

    <h1>プレイヤー/スコア管理</h1>
    <players-control class="control-section"></players-control>

    <h1>クイズ表示制御</h1>
    <quiz-control class="control-section"></quiz-control>
  </div>
</template>

<style lang="scss" scoped>
  .control-page {
    padding: 20px;
    margin: 0;
    width: 100%;

    .control-section {
      padding: 15px;
      box-shadow: 0 0 2px 0px grey;
      border-radius: 5px;
    }
  }
</style>

<style lang="scss">
  .control-page {
    h1 {
      font-size: 1.5rem;
      margin: 0;
      margin-top: 10px;
      padding: 10px;
      padding-left: 20px;
      font-weight: normal;
    }

    h2 {
      font-size: 1.2rem;
      padding: 10px;
      padding-left: 20px;
      margin: 0;
      font-weight: bold;
    }
  }
</style>

<script>
  import { mapState } from "vuex"
  import PlayersControl from "./ControlPage/PlayersControl.vue"
  import QuizControl from "./ControlPage/QuizControl.vue"

  export default {
    components: {
      PlayersControl,
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
      title: {
        get() {
          return this.$store.state.title
        },
        set(value) {
          this.push("updateTitle", value)
        }
      },
      ...mapState({
        ruleOptions: state => state.ruleOptions,
      })
    },
    methods: {
      toggleViewVisibility() {
        this.push("toggleViewVisibility")
      }
    }
  }
</script>
