"use strict"

import Vue from "vue"
import {
  includes,
} from "lodash"


const NO_TARGET = "未選択"

const state = {
  genres: [NO_TARGET],
  currentGenre: NO_TARGET,
  enableAutoNext: true,
  isImageVisible: false,
  isQuestionVisible: false,
  isAnswerVisible: false,
  data: {
    [NO_TARGET]: {
      type: "normal",
      cursor: 0,
      quizList: [
        {
          q: "",
          a: "",
        }
      ]
    },
  },
}

const getters = {
  currentQuizList(state) {
    return state.data[state.currentGenre].quizList
  },
  currentGenreLength(state) {
    return getters.currentQuizList(state).length
  },
  currentGenreCursor(state) {
    return state.data[state.currentGenre].cursor
  },
  currentQuestion(state) {
    return getters.currentQuizList(state)[getters.currentGenreCursor(state)]
  },
  currentQuizType(state) {
    return state.data[state.currentGenre].type
  },
}

const mutations = {
  changeGenre(state, genre) {
    state.currentGenre = genre
    mutations.hideAll(state)
  },
  nextCursor(state) {
    if (state.data[state.currentGenre].cursor + 1 < getters.currentGenreLength(state)) {
      state.data[state.currentGenre].cursor++
      mutations.hideAll(state)
    }
  },
  jumpCursor(state, index) {
    index = +index
    if (0 <= index && index < getters.currentGenreLength(state)) {
      state.data[state.currentGenre].cursor = index
      mutations.hideAll(state)
    }
  },

  toggleAutoNextFlag(state) {
    state.enableAutoNext = !state.enableAutoNext
  },
  hideAll(state) {
    state.isQuestionVisible = false
    state.isAnswerVisible = false
    state.isImageVisible = false
  },
  showOnlyQuestion(state) {
    state.isQuestionVisible = true
    state.isAnswerVisible = false
    state.isImageVisible = true
  },
  toggleImageVisibility(state) {
    state.isImageVisible = !state.isImageVisible
  },
  showAll(state) {
    state.isQuestionVisible = true
    state.isAnswerVisible = true
    state.isImageVisible = true
  },
  
  loadNormalQuizData(state, data) {
    for (let genre of Object.keys(data)) {
      Vue.set(state.data, genre, {
        type: "normal",
        cursor: 0,
        quizList: data[genre],
      })
      if (!includes(state.genres, genre)) {
        state.genres.push(genre)
      }
    }
  },
  loadImageQuizData(state, data) {
    for (let genre of Object.keys(data)) {
      Vue.set(state.data, genre, {
        type: "image",
        cursor: 0,
        quizList: data[genre],
      })
      if (!includes(state.genres, genre)) {
        state.genres.push(genre)
      }
    }
  },
}

export default {
  state,
  getters,
  mutations,
}
