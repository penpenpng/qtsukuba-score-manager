import Vue from "vue"


const NO_TARGET = "未選択"

const state = {
  genres: [NO_TARGET],
  currentGenre: NO_TARGET,
  viewPhase: "hidden",
  autoDisplay: true,
  imageDisplay: false,
  cursor: {
    [NO_TARGET]: 0,
  },
  type: {
    [NO_TARGET]: "normal",
  },
  data: {
    [NO_TARGET]: [
      {
        q: "",
        a: "",
      }
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
  },
  currectQuizType(state) {
    return state.type[state.currentGenre]
  }
}

const mutations = {
  changeGenre(state, genre) {
    state.currentGenre = genre
    mutations.changeViewPhase(state, "hidden")
    mutations.hideImage(state)
  },
  nextCursor(state) {
    if (state.cursor[state.currentGenre] + 1 < getters.currentGenreLength(state)) {
      state.cursor[state.currentGenre]++
      mutations.changeViewPhase(state, "hidden")
      mutations.hideImage(state)
    }
  },
  prevCursor(state) {
    if (state.cursor[state.currentGenre] > 0) {
      state.cursor[state.currentGenre]--
      mutations.changeViewPhase(state, "hidden")
      mutations.hideImage(state)
    }
  },
  jumpCursor(state, index) {
    index = +index
    if (0 <= index && index < getters.currentGenreLength(state)) {
      state.cursor[state.currentGenre] = index
      mutations.changeViewPhase(state, "hidden")
      mutations.hideImage(state)
    }
  },
  changeViewPhase(state, phase) {
    if (
      phase !== "hidden" &&
      phase !== "qOnly" &&
      phase !== "showAll"
    ) throw new Error("Invalid argument")
    
    state.viewPhase = phase

    if (phase === "hidden" || phase === "qOnly") 
      mutations.hideImage(state)
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
  loadImageQuizData(state, data) {
    for (let genre of Object.keys(data)) {
      Vue.set(state.cursor, genre, 0)
      Vue.set(state.type, genre, "image")
      Vue.set(state.data, genre, data[genre])
      if (state.genres.findIndex((g) => g === genre) < 0) {
        state.genres.push(genre)
      }
    }
  },
  toggleAutoDisplayMode(state) {
    state.autoDisplay = !state.autoDisplay
  },
  toggleImageDisplay(state) {
    state.imageDisplay = !state.imageDisplay
  },
  hideImage(state) {
    state.imageDisplay = false
  },
  showImage(state) {
    state.imageDisplay = true
  }
}

export default {
  state,
  getters,
  mutations,
}
