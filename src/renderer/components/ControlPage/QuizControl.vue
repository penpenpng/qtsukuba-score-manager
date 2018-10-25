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
    <base-button @click.native="selectAndReadCsv">csvから読み込み</base-button>
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

    <h2>表示状態変更</h2>
    <label class="block">
      <input type="checkbox" :checked="autoDisplay" @input="toggleAutoDisplayMode">
      スコア処理時に次の問題と答えを表示する
    </label>
    <base-button @click.native="hideAll">すべて隠す</base-button>
    <base-button @click.native="showQuestion">問題文だけ表示</base-button>
    <base-button @click.native="showAll">すべて表示する</base-button>

    <h2>プレビュー</h2>
    <div class="preview">
      <div class="no">hogehoge~</div>
      <div
        class="question"
        :class="{ hidden: viewPhase === 'hidden'}">{{ currentQuestion.q }}</div>
      <div
        class="answer"
        :class="{ hidden: viewPhase !== 'showAll'}">A. {{ currentQuestion.a }}</div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
  .quiz-table {
    width: 100%;
    max-height: 800px;
    table-layout: fixed;
    box-shadow: 0 0 2px 0px gray;
    border: 1px solid;
    border-collapse: collapse;
    overflow-y: scroll;

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

  .block {
    display: block;
  }

  .preview {
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 2px 0px gray;

    .no {
      padding: 5px;
    }

    .question {
      height: 4em;
      padding: 5px;
      border-top: solid 0.5px darkgray;
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

    .hidden {
      background: gainsboro;
      // color: white;
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
      ...mapState({
        genres: state => state.quiz.genres,
        viewPhase: state => state.quiz.viewPhase,
        autoDisplay: state => state.quiz.autoDisplay,
      }),
      ...mapGetters([
        "currentGenreData",
        "currentGenreCursor",
        "currentQuestion",
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
      }
    }
  }
</script>
