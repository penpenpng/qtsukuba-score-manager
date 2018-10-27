<template>
  <div class="view-page">
    <div class="header">{{ title }}</div>
    <div class="body" v-if="viewVisibility">
      <image-view class="image-view" v-if="imageDisplay"></image-view>
      <div 
        v-for="(playerId, no) in playerOrder"
        :key="playerId">
        <transition appear
          enter-active-class="animated flipInY delay-1s">
          <player-view
            class="player-view-template"
            :player-id="playerId"
            :player-no="no + 1"></player-view>
        </transition>
      </div>
    </div>
    <div class="footer" v-if="viewVisibility">
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
    overflow: hidden;
    display: grid;
    grid-template-rows: auto 1fr 30%;

    .header {
      background: #6600CC;
      color: white;
      font-family: "Times New Roman", "Meiryo", Times, serif;
      font-size: 3rem;
      padding: 3px;
      padding-left: 10px;
    }

    .body {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      padding: 40px 130px;
      position: relative;
      margin-top: 1px;
      border-top: 5px solid #6600CC;

      .player-view-template {
        height: 100%;;
      }

      .image-view {
        position: absolute;
        width: 80%;
        height: 80%;
        top: 10%;
        left: 10%;
      }
    }

    .footer {
      border-bottom: solid 5px #6600CC;
      margin-bottom: 10px;
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
        viewVisibility: state => state.viewVisibility,
      })
    },
  }
</script>
