<template>
  <div class="quiz-view-wrapper">
    <div class="quiz-view">
      <div class="header">
        hogehoge~
      </div>
      <div class="question" :class="{ hidden: viewPhase === 'hidden' }">
        {{ currentQuestion.q }}
      </div>
      <div class="answer" :class="{ hidden: viewPhase !== 'showAll' }">
        A. {{ currentQuestion.a }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .quiz-view-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    
    .quiz-view {
      box-shadow: 0 0 2px 0px darkgrey;
      width: 75%;
      height: 90%;
      display: grid;
      grid-template-rows: auto 1fr auto;
      grid-template-columns: 100%;
      padding: 5px;

      .hidden {
        color: transparent;
      }

      .question {
        font-size: 1.5rem;
        padding: 5px;
        border-top: solid 0.5px darkgray;
        border-bottom: solid 0.5px darkgray;
        overflow-wrap: break-word;
        text-overflow: ellipsis;
      }

      .answer {
        font-size: 1.5rem;
        text-align: right;
        padding: 5px;
        padding-right: 15px;
        text-overflow: ellipsis;
      }
    }
  }
</style>

<script>
  import {
    mapState,
    mapGetters,
  } from "vuex"

  export default {
    computed: {
      ...mapState({
        viewPhase: state => state.quiz.viewPhase,
      }),
      ...mapGetters([
        "currentQuestion",
      ])
    }
  }
</script>
