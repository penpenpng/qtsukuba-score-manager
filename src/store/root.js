import {
  getScoreDefinitions,
  createInitialScore,
  resolveSlash,
  updateRank,
} from "./ruleLogic"
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
  slasherId: null,
  correctlyAnswererIds: [],
  nextPlayerId: 1,
  playerOrder: [],
  players: {},
}

const mutations = {
  // Logic Setup
  setRule(state, ruleKey) {
    state.ruleKey = ruleKey
    state.correctlyAnswererIds.splice(0, state.correctlyAnswererIds.length)
    state.slasherId = null
    state.scoreDefinitions = getScoreDefinitions(ruleKey)

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
      score: createInitialScore(state.ruleKey),
    })
    state.playerOrder.push(state.nextPlayerId)
    state.nextPlayerId++
    updateRank(state.ruleKey, state)
  },
  deletePlayer(state, id) {
    let index = state.playerOrder.findIndex(i => i === id)
    if (index < 0)
      throw new Error(`player <${id}> is not found`)
    state.playerOrder.splice(index, 1)
    Vue.delete(state.players, id)
    if (state.slasherId === id)
      state.slasherId = null
    updateRank(state.ruleKey, state)
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
    state.slasherId = +slasherId
  },
  updateCorrectlyAnswererIds(state, correctlyAnswererIds) {
    state.correctlyAnswererIds = correctlyAnswererIds.map((i) => +i)
  },
  resolveSlash(state) {
    resolveSlash(state.ruleKey, state)
    updateRank(state.ruleKey, state)
  },
}

export default {
  state,
  mutations,
}
