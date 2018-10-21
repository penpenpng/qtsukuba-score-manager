<template>
  <div>
    <select v-model="currentGenre">
      <option
        v-for="genre in genres" 
        :key="genre"
        :value="genre">{{ genre }}</option>
    </select>
    <table class="quiz-table">
      <thead>
        <tr>
          <th class="question"></th>
          <th class="answer"></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, index) in currentGenreData"
          :key="currentGenre + index"
          class="quiz-table-row"
          :class="{ selected: currentGenreCursor == index }"
          @click="jumpCursor(index)">
          <td>{{ row.q }}</td>
          <td>{{ row.a }}</td>
        </tr>
      </tbody>
    </table>
    <div class="preview">
      <div class="no">No. {{ currentGenreCursor + 1}}</div>
      <div class="question" :class="{ hidden: viewPhase === 'hidden'}">{{ currentQuestion.q }}</div>
      <div class="answer" :class="{ hidden: viewPhase !== 'showAll'}">{{ currentQuestion.a }}</div>
    </div>
    <button @click="hideAll">Hide All</button>
    <button @click="showQuestion">Show Question</button>
    <button @click="showAll">Show All</button>
  </div>
</template>

<style lang="scss" scoped>
  .quiz-table {
    max-height: 800px;
    overflow-y: scroll;

    .quiz-table-row.selected {
      background: dimgray;
      color: white;
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
