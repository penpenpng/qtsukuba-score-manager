import { getScoreStruct, resolveSlash } from "./ruleLogic"


let id = 0
function PlayerState() {
  return {
    id: ++id,
    name: "noname",
    lock: 0,
    rank: null,
    isPlaying: true,
    score: [],
  }
}

function replaceScoreState(ruleKey, score) {
  let struct = getScoreStruct(ruleKey)

  score.splice(0, score.length)
  for (let i = 0; i < struct.length; i++) {
    score.push({
      value: 0,
      reach: 0,
    })
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
  scoreStruct: [],
  slasher: "null",
  correct: [],
  players: [],
}

const mutations = {
  // Logic Setup
  setRule(state, ruleKey) {
    let struct = getScoreStruct(ruleKey)

    state.ruleKey = ruleKey
    state.correct.splice(0, state.correct.length)
    state.slasher = "null"
    state.scoreStruct = struct

    for (let player of state.players) replaceScoreState(ruleKey, player.score)
  },

  // Player Management
  appendPlayer(state) {
    let playerState = PlayerState()
    replaceScoreState(state.ruleKey, playerState.score)
    state.players.push(playerState)
  },
  deletePlayer(state, id) {
    let index = state.players.findIndex(p => p.id === id)
    if (index < 0) throw new Error(`player <${id}> is not found`)
    state.players.splice(index, 1)
  },
  updatePlayerName(state, args) {
    let { id, name } = args
    getters.player(state)(id).name = name
  },
  updateScore(state, args) {
    let { scoreId, playerId, value } = args
    getters.player(state)(playerId).score[scoreId].value = value
  },

  // Judgement Operations
  updateSlasher(state, slasher) {
    state.slasher = +slasher
  },
  updateCorrect(state, correct) {
    state.correct = correct
  },
  resolveSlash(state) {
    resolveSlash(this.ruleKey, state)
  }
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
