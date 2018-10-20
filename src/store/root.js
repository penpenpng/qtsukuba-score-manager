import {
  getScoreDefinitions,
  createInitialScore,
  resolveSlash,
  updateRank,
} from "./ruleLogic"


let id = 0
function PlayerState() {
  return {
    id: ++id,
    name: "noname",
    lock: 0,
    rank: null,
    score: {},
  }
}

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
  slasherId: NaN,
  correctlyAnswererIds: [],
  players: [],
}

const mutations = {
  // Logic Setup
  setRule(state, ruleKey) {
    state.ruleKey = ruleKey
    state.correctlyAnswererIds.splice(0, state.correctlyAnswererIds.length)
    state.slasher = "null"
    state.scoreDefinitions = getScoreDefinitions(ruleKey)

    for (let playerState of state.players) playerState.score = createInitialScore(ruleKey)
    updateRank(state.ruleKey, state)
  },

  // Player Management
  appendPlayer(state) {
    let playerState = PlayerState()
    playerState.score = createInitialScore(state.ruleKey)
    state.players.push(playerState)
    updateRank(state.ruleKey, state)
  },
  deletePlayer(state, id) {
    let index = state.players.findIndex(p => p.id === id)
    if (index < 0) throw new Error(`player <${id}> is not found`)
    state.players.splice(index, 1)
    updateRank(state.ruleKey, state)
  },
  updatePlayerName(state, args) {
    let { id, name } = args
    getters.player(state)(id).name = name
  },
  updateScore(state, args) {
    let { scoreKey, playerId, value } = args
    getters.player(state)(playerId).score[scoreKey].value = value
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

const getters = {
  player: (state) => (id) => {
    let result = state.players.find(p => p.id === +id)
    if (result === undefined) throw new Error(`player <${id}> is not found`)
    else return result
  },
}

export default {
  state,
  getters,
  mutations,
}
