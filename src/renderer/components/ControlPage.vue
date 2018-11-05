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
    <base-button
      v-show="isViewPageVisible"
      @click.native="push('toggleViewVisibility')"
      :class="{'show-button': !isViewVisible}">
      得点表示画面を{{isViewVisible ? "隠す" : "描画する"}}
    </base-button>

    <div class="columns-container">
      <div>
        <h1>プレイヤー/スコア管理</h1>
        <players-control class="control-section"></players-control>
      </div>

      <div>
        <h1>クイズ表示制御</h1>
        <quiz-control class="control-section"></quiz-control>
      </div>
    </div>

  </div>
</template>

<style lang="scss" scoped>
  @keyframes blink-button {
    0% {opacity: 0.5;}
    100% {opacity: 1;}
  }

  .control-page {
    padding: 20px;
    margin: 0;
    width: 100%;

    .show-button {
      animation: blink-button ease-in-out 1s infinite alternate;
      background: orangered;
    }

    .control-section {
      padding: 15px;
      box-shadow: 0 0 2px 0px grey;
      border-radius: 5px;
      margin: 5px;
    }
  }

  .columns-container {
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 50% 50%;
  }
</style>

<style lang="scss">
  .control-page {
    h1 {
      font-size: 1.5rem;
      margin: 0;
      margin-top: 10px;
      padding: 10px;
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
        isViewPageVisible: state => state.isViewPageVisible,
        isViewVisible: state => state.isViewVisible,
        ruleOptions: state => state.ruleOptions,
      })
    },
  }
</script>
