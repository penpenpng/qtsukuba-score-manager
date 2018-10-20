

const state = {
  genres: ["Genre1", "Genre2"],
  currentGenre: "Genre1",
  viewPhase: "hidden",
  cursor: {
    Genre1: 0,
    Genre2: 0,
  },
  data: {
    Genre1: [
      {
        type: "normal",
        q: "1-1?",
        a: "1-1!",
      },
      {
        type: "normal",
        q: "1-2?",
        a: "1-2!",
      },
      {
        type: "normal",
        q: "1-2?",
        a: "1-2!",
      },
    ],
    Genre2: [
      {
        type: "normal",
        q: "2-1?",
        a: "2-1!",
      },
      {
        type: "normal",
        q: "2-2?",
        a: "2-2!",
      },
      {
        type: "normal",
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
    if (state.cursor[state.currentGenre] + 1 < getters.currentGenreLength(state))
      state.cursor[state.currentGenre]++
  },
  prevCursor(state) {
    if (state.cursor[state.currentGenre] > 0)
      state.cursor[state.currentGenre]--
  },
  jumpCursor(state, index) {
    index = +index
    if (0 <= index && index < getters.currentGenreLength(state))
      state.cursor[state.currentGenre] = index
  },
  changeViewPhase(state, phase) {
    if (
      phase !== "hidden" &&
      phase !== "qOnly" &&
      phase !== "showAll"
    ) throw new Error("Invalid argument")
    
    state.viewPhase = phase
  }
}

export default {
  state,
  getters,
  mutations,
}
