
export function getScoreDefinitions(ruleKey) {
  if (ruleKey === "") { 
    return {
      order: [],
      properties: {}
    }
  }
  if (!RuleHash[ruleKey])
    throw new Error(`Rule <${ruleKey}> is not found`)
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
  if (ruleKey === "")
    return
  if (!RuleHash[ruleKey])
    throw new Error(`Rule <${ruleKey}> is not found`)

  let stateRepr = convertToLogicArg(vuexState)
  RuleHash[ruleKey].resolveSlash(stateRepr)
  validate(stateRepr)

  // update vuexState
  // update target: lock, score.value, score.reach
  for (let pk of Object.keys(vuexState.players)) {
    if (!(pk in stateRepr.players))
      continue

    let p = stateRepr.players[pk]
    let vuexPlayerState = vuexState.players[pk]

    if (Number.isInteger(p.lock))
      vuexPlayerState.lock = +p.lock

    for (let sk of Object.keys(vuexPlayerState.score)) {
      if (!(sk in p.score))
        continue
      
      if (Number.isInteger(p.score[sk].value))
        vuexPlayerState.score[sk].value = +p.score[sk].value
      if (typeof (p.score[sk].reach) === "boolean")
        vuexPlayerState.score[sk].reach = !!p.score[sk].reach
    }
  }
}

export function updateRank(ruleKey, vuexState) {
  if (ruleKey === "")
    return
  if (!RuleHash[ruleKey])
    throw new Error(`Rule <${ruleKey}> is not found`)

  let stateRepr = convertToLogicArg(vuexState)
  RuleHash[ruleKey].updateRank(stateRepr)
  validate(stateRepr)

  // update rank of vuexState
  for (let pk of Object.keys(vuexState.players)) {
    if (!(pk in stateRepr.players))
      continue

    let p = stateRepr.players[pk]
    if (p.rank === null || Number.isInteger(p.rank))
      vuexState.players[pk].rank = p.rank
  }
}

function convertToLogicArg(vuexState) {
  let playerRepr = {}
  for (let playerState of Object.values(vuexState.players)) {
    // copy scoreState (DON'T copy by JSON.stringify)
    let score = {}
    for (let scoreStateKey of Object.keys(playerState.score)) {
      let scoreState = playerState.score[scoreStateKey]
      score[scoreStateKey] = {
        value: scoreState.value,
        reach: scoreState.reach,
      }
    }
    // ---

    let correct = vuexState.correctlyAnswererIds.findIndex((i) => i === playerState.id) >= 0
    let slash = vuexState.slasherId === playerState.id
    playerRepr[playerState.id] = {
      lock: playerState.lock,
      rank: playerState.rank,
      score: score,
      // readonly
      get id() { return playerState.id },
      get correct() { return correct },
      get slash() { return slash }
      // ---
    }
  }

  let repr = {
    players: playerRepr,
    env: {},
    get isThrough() { return vuexState.slasherId === null },
    get slasher() {
      if (repr.isThrough)
        return null
      else
        return playerRepr[vuexState.slasherId]
    },
  }
  return repr
}

function validate(logicArg) {
  if (!("players" in logicArg))
    throw new Error("State doesn't have 'players' property")
  if (typeof (logicArg.players) !== "object")
    throw new Error("'players' property is not an object")
  if (!("env" in logicArg))
    throw new Error("State doesn't have 'env' property")
  if (typeof (logicArg.env) !== "object")
    throw new Error("'env' property is not an object")
}

const CyanaTennis = {
  scoreDefinitions: {
    order: ["point"],
    properties: {
      point: {
        initialValue: 0,
        visible: true,
        view: "normal",
        color: "",
      },
    }
  },

  updateRank(state) {
    state
  },

  resolveSlash(state) {
    if (state.slasher === null)
      return
    
    if (state.slasher.correct) {
      state.slasher.score.point.value++
    } else {
      for (let player of Object.values(state.players)) {
        if (player.id !== state.slasher.id)
          player.score.point.value++
      }
    }
  },
}

const RuleHash = {
  CyanaTennis
}
