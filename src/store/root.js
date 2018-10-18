
let id = 0
function PlayerState() {
  return {
    id: ++id,
    name: "noname",
    lock: 0,
    rank: null,
    isPlaying: true,
    score: [
      {
        value: 0,
        reach: false,
      },
      {
        value: 0,
        reach: false,
      },
    ],
  }
}

const state = {
  title: "No Title",
  rule: "cyana-tennis",
  scoreStruct: [
    {
      key: "correct",
      label: "",
      visible: true,
      view: "normal",
      color: "",
    },
    {
      key: "wrong",
      label: "",
      visible: true,
      view: "normal",
      color: "",
    },
  ],
  slasher: "null",
  correct: [],
  players: [PlayerState(), PlayerState()],
}

const mutations = {
  updateSlasher(state, slasher) {
    state.slasher = +slasher
  },
  updateCorrect(state, correct) {
    state.correct = correct
  },
  appendPlayer(state) {
    state.players.push(PlayerState())
  },
  updatePlayerName(state, args) {
    let { id, name } = args
    getters.player(state)(id).name = name
  },
  updateScore(state, args) {
    let { scoreId, playerId, value } = args
    getters.player(state)(playerId).score[scoreId].value = value
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
