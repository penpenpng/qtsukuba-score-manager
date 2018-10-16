
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
        key: "correct",
        label: "",
        view: "normal",
        value: 0,
        visible: true,
        color: "",
      },
      {
        key: "wrong",
        label: "",
        view: "normal",
        value: 0,
        visible: true,
        color: "",
      },
    ],
  }
}

const state = {
  title: "No Title",
  rule: "cyana-tennis",
  slasher: "null",
  players: [PlayerState(), PlayerState()],
}

const mutations = {
  updateSlasher(state, slasher) {
    state.slasher = +slasher
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
