
// state は playerState の列 と globalenv
// let playerState = {
//   id: 0,
//   name: 0,
//   slash: false,
//   correct: false,
//   rank: 0,
//   lock: 0,

//   score: {
//     key1: {
//       value: 0,
//       reach: false,
//     }
//   }
// }

// let globalenv = {
//   quizNo: 0,
//   time: 0,
// }

function State(vuexState) {
  vuexState
  //let state = {}
  //return state
}

export function resolveSlash(ruleKey, state) {
  if (ruleKey === "") return
  if (!RuleHash[ruleKey]) throw new Error(`Rule <${ruleKey}> is not found`)
  RuleHash[ruleKey].resolveSlash(State(state))
}

export function getScoreStruct(ruleKey) {
  if (ruleKey === "") return []
  if (!RuleHash[ruleKey]) throw new Error(`Rule <${ruleKey}> is not found`)
  return RuleHash[ruleKey].scoreStruct
}

const CyanaTennis = {
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
  exArgs: [],

  updateRank(state) {
    state
  },

  resolve(state) {
    state
    // update score
    // resolve lock
  },

  allowMultiCorrect() {
  }
}

const RuleHash = {
  CyanaTennis
}
