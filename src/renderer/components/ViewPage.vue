<template>
  <div class="view-page">
    <div class="header">{{ title }}</div>
    <div class="body">
      <image-view class="image-view" v-if="imageDisplay"></image-view>
      <div 
        v-for="(playerId, no) in playerOrder"
        :key="playerId">
        <transition appear
          enter-active-class="animated flipInY">
          <player-view
            class="player-view-template"
            :player-id="playerId"
            :player-no="no + 1"></player-view>
        </transition>
      </div>
    </div>
    <div class="footer">
      <quiz-view></quiz-view> 
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .view-page {
    padding: 0;
    margin: 0;
    height: 100vh;
    width: 100vw;
    display: grid;
    grid-template-rows: auto 1fr 30%;

    .header {
      background: purple;
      color: white;
      font-size: 3rem;
      padding: 3px;
      padding-left: 10px;
    }

    .body {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      padding: 15px;
      position: relative;

      .player-view-template {
        height: 100%;
      }

      .image-view {
        position: absolute;
        width: 80%;
        height: 80%;
        top: 10%;
        left: 10%;
      }
    }
  }
</style>

<style>
  .view-page * {
    user-select: none;
  }
</style>

<script>
  import { mapState } from "vuex"
  import PlayerView from "./ViewPage/PlayerView.vue"
  import QuizView from "./ViewPage/QuizView.vue"
  import ImageView from "./ViewPage/ImageView.vue"

  export default {
    components: {
      PlayerView,
      QuizView,
      ImageView,
    },
    computed: {
      ...mapState({
        title: state => state.title,
        playerOrder: state => state.playerOrder,
        imageDisplay: state => state.quiz.imageDisplay,
      })
    },
  }
</script>
