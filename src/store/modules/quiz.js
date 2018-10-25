import Vue from "vue"


const state = {
  genres: ["Genre1", "Genre2"],
  currentGenre: "Genre1",
  viewPhase: "hidden",
  autoDisplay: true,
  cursor: {
    Genre1: 0,
    Genre2: 0,
  },
  type: {
    Genre1: "normal",
    Genre2: "normal",
  },
  data: {
    Genre1: [
      {
        q: "1-1?",
        a: "1-1!",
      },
      {
        q: "1-2?",
        a: "1-2!",
      },
      {
        q: "1-2?",
        a: "1-2!",
      },
    ],
    Genre2: [
      {
        q: "2-1?",
        a: "2-1!",
      },
      {
        q: "2-2?",
        a: "2-2!",
      },
      {
        q: "2-2?",
        a: "2-2!",
      },
    ],
  },
}

const getters = {
  currentGenreData(state) {
    return state.data[state.currentGenre]
  },
  currentGenreLength(state) {
    return getters.currentGenreData(state).length
  },
  currentGenreCursor(state) {
    return state.cursor[state.currentGenre]
  },
  currentQuestion(state) {
    return state.data[state.currentGenre][getters.currentGenreCursor(state)]
  }
}

const mutations = {
  changeGenre(state, genre) {
    state.currentGenre = genre
  },
  nextCursor(state) {
    if (state.cursor[state.currentGenre] + 1 < getters.currentGenreLength(state)) {
      state.cursor[state.currentGenre]++
      mutations.changeViewPhase(state, "hidden")
    }
  },
  prevCursor(state) {
    if (state.cursor[state.currentGenre] > 0) {
      state.cursor[state.currentGenre]--
      mutations.changeViewPhase(state, "hidden")
    }
  },
  jumpCursor(state, index) {
    index = +index
    if (0 <= index && index < getters.currentGenreLength(state)) {
      state.cursor[state.currentGenre] = index
      mutations.changeViewPhase(state, "hidden")
    }
  },
  changeViewPhase(state, phase) {
    if (
      phase !== "hidden" &&
      phase !== "qOnly" &&
      phase !== "showAll"
    ) throw new Error("Invalid argument")
    
    state.viewPhase = phase
  },
  loadNormalQuizData(state, data) {
    for (let genre of Object.keys(data)) {
      Vue.set(state.cursor, genre, 0)
      Vue.set(state.type, genre, "normal")
      Vue.set(state.data, genre, data[genre])
      if (state.genres.findIndex((g) => g === genre) < 0) {
        state.genres.push(genre)
      }
    }
  },
  toggleAutoDisplayMode(state) {
    state.autoDisplay = !state.autoDisplay
  }
}

export default {
  state,
  getters,
  mutations,
}
