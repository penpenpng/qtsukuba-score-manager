
export function getScoreDefinitions(ruleKey) {
  if (ruleKey === "") { 
    return {
      order: [],
      properties: {}
    }
  }
  if (!RuleHash[ruleKey]) throw new Error(`Rule <${ruleKey}> is not found`)
  return RuleHash[ruleKey].scoreDefinitions
}

export function createInitialScore(ruleKey) {
  let definiton
  try {
    definiton = getScoreDefinitions(ruleKey)
  } catch (e) {
    throw e
  }

  let score = {}
  for (let scoreKey of definiton.order) {
    score[scoreKey] = {
      value: definiton.properties[scoreKey].initialValue,
      reach: false,
    }
  }
  return score
}

export function resolveSlash(ruleKey, vuexState) {
  if (ruleKey === "") return
  if (!RuleHash[ruleKey]) throw new Error(`Rule <${ruleKey}> is not found`)
  RuleHash[ruleKey].resolveSlash(State(vuexState))
}

export function updateRank(ruleKey, vuexState) {
  if (ruleKey === "") return
  if (!RuleHash[ruleKey]) throw new Error(`Rule <${ruleKey}> is not found`)
  RuleHash[ruleKey].updateRank(State(vuexState))
}

function State(vuexState) {
  let state = {
    players: [],
    env: {},
  }

  for (let playerState of Object.values(vuexState.players)) {
    state.players.push({
      id: playerState.id,
      lock: playerState.lock,
      rank: playerState.rank,
      score: JSON.parse(JSON.stringify(playerState.score)),
      correct: vuexState.correctlyAnswererIds.findIndex((i) => i === playerState.id) >= 0,
      slash: vuexState.slasherId === playerState.id
    })
  }

  return state
}

const CyanaTennis = {
  scoreDefinitions: {
    order: ["correct", "wrong"],
    properties: {
      correct: {
        initialValue: 0,
        visible: true,
        view: "normal",
        color: "",
      },
      wrong: {
        initialValue: 0,
        visible: true,
        view: "normal",
        color: "",
      }
    }
  },

  updateRank(state) {
    state
  },

  resolveSlash(state) {
    state
    // update score
    // resolve lock
  },
}

const RuleHash = {
  CyanaTennis
}
