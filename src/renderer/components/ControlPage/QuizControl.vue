<template>
  <section class="quiz-control">
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
    
    <h2>クイズ一覧</h2>
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
          <td>{{ index + 1 }}</td>
          <td>{{ row.q }}</td>
          <td>{{ row.a }}</td>
        </tr>
      </tbody>
    </table>

    <h2>プレビュー</h2>
    <div class="preview">
      <div class="no">No. {{ currentGenreCursor + 1}}</div>
      <div class="question" :class="{ hidden: viewPhase === 'hidden'}">{{ currentQuestion.q }}</div>
      <div class="answer" :class="{ hidden: viewPhase !== 'showAll'}">{{ currentQuestion.a }}</div>
    </div>
    <base-button @click.native="hideAll">Hide All</base-button>
    <base-button @click.native="showQuestion">Show Question</base-button>
    <base-button @click.native="showAll">Show All</base-button>
  </section>
</template>

<style lang="scss" scoped>
  .quiz-table {
    width: 100%;
    max-height: 800px;
    table-layout: fixed;
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

  .preview {
    .hidden {
      background: dimgray;
      color: white;
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
        genres: (state) => state.quiz.genres,
        viewPhase: (state) => state.quiz.viewPhase,
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
      }
    }
  }
</script>
