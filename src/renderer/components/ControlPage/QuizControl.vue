<template>
  <section class="quiz-control">
    <h2>クイズ選択</h2>
    <label>
      表示中のジャンル: 
      <select v-model="currentGenre">
        <option
          v-for="genre in genres" 
          :key="genre"
          :value="genre">{{ genre }}</option>
      </select>
    </label>
    <div class="quiz-reader">
      <base-button class="button" @click.native="selectAndReadCsv">csvから読み込む</base-button>
      <base-button class="button" @click.native="selectAndReadImgdir">画像フォルダから読み込む</base-button>
    </div>
    <div class="quiz-table-wrapper">
      <table class="quiz-table">
        <thead>
          <tr>
            <th class="no">#</th>
            <th class="question">問題</th>
            <th class="answer">答え</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, index) in currentGenreData"
            :key="currentGenre + index"
            :class="{ selected: currentGenreCursor == index }"
            @click="jumpCursor(index)">
            <td>{{ index }}</td>
            <td>{{ row.q }}</td>
            <td>{{ row.a }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2>表示状態変更</h2>
    <label class="auto-display-control" v-show="currentQuizType !== 'image'">
      <input type="checkbox" :checked="autoDisplay" @input="toggleAutoDisplayMode">
      スコア処理時に次の問題と答えを自動表示
    </label>
    <div class="view-state-control">
      <base-button class="button" @click.native="hideAll">すべて隠す</base-button>
      <base-button class="button" @click.native="showQuestion">問題文だけ表示</base-button>
      <base-button v-if="currentQuizType === 'image'" class="button image-button" @click.native="toggleImageDisplay">画像を表示/隠す</base-button>
      <base-button class="button" @click.native="showAll">問題文と答えを表示</base-button>
    </div>

    <h2>プレビュー</h2>
    <div class="preview">
      <div class="sentence-preview">
        <div
          class="question"
          :class="{ hidden: viewPhase === 'hidden'}">{{ currentQuestion.q }}</div>
        <div
          class="answer"
          :class="{ hidden: viewPhase !== 'showAll'}">A. {{ currentQuestion.a }}</div>
      </div>
      <div class="image-preview" :class="{ hidden: !imageDisplay }">
        <img :src="src">
      </div>
    </div>

  </section>
</template>

<style lang="scss" scoped>
  .quiz-reader {
    display: inline-block;
    
    .button {
      margin-left: 15px;
    }
  }

  .quiz-table-wrapper {
    margin: 10px;
    margin-bottom: 15px;
    max-height: 200px;
    overflow-x: hidden;
    overflow-y: scroll;
  }

  .quiz-table {
    width: 100%;
    table-layout: fixed;
    box-shadow: 0 0 2px 0px gray;
    border-collapse: collapse;

    thead tr {
      background: aliceblue;

      th {
        border: 1px solid;
        text-align: left;

        &.no {
          width: 5%;
          min-width: 3em;
        }

        &.question {
          width: 75%;
        }

        &.answer {
          width: 20%;
        }
      }
    }

    tbody tr {
      cursor: pointer;

      td {
        border: 1px solid;
        overflow-x: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      &.selected, &:hover {
        background: lightskyblue;
        color: white;

        &:hover:not(.selected) {
          opacity: 0.5;
        }
      }
    }
  }

  .auto-display-control {
    display: block;
  }

  .view-state-control {
    margin: 10px;
    margin-bottom: 15px;

    .button:not(:first-child) {
      margin-left: 15px;
    }

    .image-button {
      background: orange;
    }
  }

  .preview {
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 70% 30%;

    .hidden {
      background: gainsboro;
    }
  }

  .sentence-preview {
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 2px 0px gray;

    .question {
      height: 4em;
      padding: 5px;
      border-bottom: solid 0.5px darkgray;
      overflow-wrap: break-word;
      text-overflow: ellipsis;
    }

    .answer {
      padding: 5px;
      padding-right: 15px;
      text-align: right;
      text-overflow: ellipsis;
    }
  }

  .image-preview {
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 2px 0px grey;
    margin-left: 5px;
    padding: 5px;

    img {
      display: block;
      max-height: 100%;
      max-width: 100%;
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
      currentGenre: {
        get() {
          return this.$store.state.quiz.currentGenre
        },
        set(value) {
          this.push("changeGenre", value)
        },
      },
      src() {
        let path = this.currentQuestion.path
        if (path)
          return this.loadImageAsBase64(path)
        else
          return ""
      },
      ...mapState({
        genres: state => state.quiz.genres,
        viewPhase: state => state.quiz.viewPhase,
        autoDisplay: state => state.quiz.autoDisplay,
        questionNo: state => state.questionNo,
        imageDisplay: state => state.quiz.imageDisplay,
      }),
      ...mapGetters([
        "currentGenreData",
        "currentGenreCursor",
        "currentQuestion",
        "currentQuizType",
      ])
    },
    methods: {
      jumpCursor(index) {
        this.push("jumpCursor", index)
      },
      hideAll() {
        this.push("changeViewPhase", "hidden")
      },
      showQuestion() {
        this.push("changeViewPhase", "qOnly")
      },
      showAll() {
        this.push("changeViewPhase", "showAll")
      },
      toggleAutoDisplayMode() {
        this.push("toggleAutoDisplayMode")
      },
      toggleImageDisplay() {
        this.push("toggleImageDisplay")
      }
    }
  }
</script>
