<template>
  <div class="quiz-view-wrapper">
    <transition appear
      enter-active-class="animated fadeInUp">
      <div class="quiz-view">
        <div class="quiz-view-row question" :class="{ hidden: !isQuestionVisible }">
          {{ currentQuestion.q }}
        </div>
        <div class="quiz-view-row answer" :class="{ hidden: !isAnswerVisible }">
          A. {{ currentQuestion.a }}
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
  .quiz-view-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    font-family: "M PLUS 1p", sans-serif;
  }
  .quiz-view-wrapper .quiz-view {
    box-shadow: 0 0 2px 0px darkgrey;
    width: 60%;
    min-width: 800px;
    height: 90%;
    display: grid;
    grid-template-rows: 1fr auto;
    grid-template-columns: 100%;
    padding: 5px;
    margin-bottom: 20px;
  }
  .quiz-view-wrapper .quiz-view .hidden {
    color: transparent;
  }
  .quiz-view-wrapper .quiz-view .quiz-view-row {
    font-size: 1.5rem;
    padding: 5px 15px;
    text-overflow: ellipsis;
  }
  .quiz-view-wrapper .quiz-view .question {
    padding: 5px 30px;
    border-bottom: solid 0.5px darkgray;
    overflow-wrap: break-word;
  }
  .quiz-view-wrapper .quiz-view .answer {
    text-align: right;
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
        questionNo: state => state.questionNo,
        isQuestionVisible: state => state.quiz.isQuestionVisible,
        isAnswerVisible: state => state.quiz.isAnswerVisible,
        isImageVisible: state => state.quiz.isImageVisible,
      }),
      ...mapGetters([
        "currentQuestion",
      ])
    }
  }
</script>
