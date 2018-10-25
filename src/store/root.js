import {
  getScoreDefinitions,
  createInitialScore,
  removeWinner,
  resolveSlash,
  updateRank,
} from "./ruleLogic"
import QuizModule from "./modules/quiz"
import Vue from "vue"

const state = {
  title: "No Title",
  ruleOptions: [
    {
      key: "",
      label: "",
    },
    {
      key: "CyanaTennis",
      label: "きゃな式テニス",
    }
  ],
  ruleKey: "",
  scoreDefinitions: [],
  questionNo: 0,
  slasherId: null,
  correctlyAnswererIds: [],
  nextPlayerId: "1",
  playerOrder: [],
  players: {},
  ranking: [],
}

const mutations = {
  // Logic Setup
  updateTitle(state, title) {
    state.title = title
  },
  setRule(state, ruleKey) {
    state.ruleKey = ruleKey
    state.questionNo = 0
    state.correctlyAnswererIds.splice(0, state.correctlyAnswererIds.length)
    state.slasherId = null
    state.scoreDefinitions = getScoreDefinitions(ruleKey)
    state.ranking.splice(0, state.ranking.length)

    for (let playerState of Object.values(state.players))
      playerState.score = createInitialScore(ruleKey)
    updateRank(state.ruleKey, state)
  },

  // Player Management
  appendPlayer(state) {
    Vue.set(state.players, state.nextPlayerId, {
      id: state.nextPlayerId,
      name: "noname",
      lock: 0,
      rank: null,
      lose: false,
      score: createInitialScore(state.ruleKey),
    })
    state.playerOrder.push(state.nextPlayerId)
    state.nextPlayerId = "" + (+state.nextPlayerId + 1)
    updateRank(state.ruleKey, state)
  },
  deletePlayer(state, id) {
    let index = state.playerOrder.findIndex(i => i === id)
    if (index < 0)
      throw new Error(`player <${id}> is not found`)
    state.playerOrder.splice(index, 1)
    Vue.delete(state.players, id)
    removeWinner(id, state)
    updateRank(state.ruleKey, state)
    if (state.slasherId === id)
      state.slasherId = null
  },
  updatePlayerName(state, args) {
    let { id, name } = args
    state.players[id].name = name
  },
  updateScore(state, args) {
    let { scoreKey, playerId, value } = args
    state.players[playerId].score[scoreKey].value = value
    updateRank(state.ruleKey, state)
  },

  // Judgement Operations
  updateSlasherId(state, slasherId) {
    state.slasherId = "" + slasherId
  },
  updateCorrectlyAnswererIds(state, correctlyAnswererIds) {
    state.correctlyAnswererIds = correctlyAnswererIds.map((i) => "" + i)
  },
  resolveSlash(state) {
    state.questionNo++
    resolveSlash(state.ruleKey, state)
    updateRank(state.ruleKey, state)
    mutations.resetSelections(state)

    if (state.quiz.autoDisplay) {
      QuizModule.mutations.nextCursor(state.quiz)
      QuizModule.mutations.changeViewPhase(state.quiz, "showAll")
    }
  },
  resetSelections(state) {
    state.slasherId = null
    state.correctlyAnswererIds = []
  }
}

export default {
  state,
  mutations,
}
