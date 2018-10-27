import QuizModule from "./modules/quiz"


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
      animating: false,
    }
  }
  return score
}

export function removeWinner(playerId, vueState) {
  for (let chunk of vueState.ranking) {
    let index = chunk.findIndex((i) => i === playerId)
    if (index < 0) continue
    chunk.splice(index, 1)
  }

  while (true) {
    let index = vueState.ranking.findIndex((c) => c.length <= 0)
    if (index < 0) break
    vueState.ranking.splice(index, 1)
  }
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
      
      if (Number.isInteger(p.score[sk].value)) {
        vuexPlayerState.score[sk].animating = vuexPlayerState.score[sk].value != p.score[sk].value
        vuexPlayerState.score[sk].value = +p.score[sk].value
      }
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
  
  function win(playerId) {
    for (let chunk of vuexState.ranking)
      if (chunk.findIndex((i) => i === playerId) >= 0)
        return true
    return false
  }

  let newWinners = []
  for (let playerId of Object.keys(vuexState.players)) {
    let decision = RuleHash[ruleKey].makeDecision(
      convertToLogicArg(vuexState).players[playerId],
      convertToLogicArg(vuexState)
    )
    if (decision !== "win" && decision !== "lose" && decision !== "none")
      throw new Error("Invalid decision")

    if (!win(playerId) && decision === "win")
      newWinners.push(playerId)
    else if (win(playerId) && decision !== "win")
      removeWinner(playerId, vuexState)
    
    vuexState.players[playerId].lose = decision === "lose"
    vuexState.players[playerId].rank = null
  }
  if (newWinners.length > 0)
    vuexState.ranking.push(newWinners)

  let rank = 1
  for (let chunk of vuexState.ranking) {
    for (let playerId of chunk)
      vuexState.players[playerId].rank = rank
    rank++
  }
}

export function getRuleOptions() {
  let options = []
  for (let key of Object.keys(RuleHash)) {
    options.push({
      key: key,
      label: RuleHash[key].name
    })
  }
  return options
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
      score: score,
      // readonly
      get id() { return playerState.id },
      get rank() { return playerState.rank },
      get correct() { return correct },
      get slash() { return slash }
      // ---
    }
  }

  let repr = {
    players: playerRepr,
    env: {
      get questionNo() { return vuexState.questionState },
      get quizType() { return QuizModule.getters.currentQuizType(vuexState.quiz) },
    },
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

// function loadLogic(path) {

// }

const SohosaiBoard = {
  name: "2ndボード",
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

  makeDecision() {
    return "none"
  },

  resolveSlash(state) {
    if (state.env.quizType == "image") {
      // ビジュアルボード
      for (let player of Object.values(state.players)) {
        if (player.correct) {
          player.score.point.value += 1
        }
      }
    } else {
      // 早押しボード
      for (let player of Object.values(state.players)) {
        if (player.correct) {
          if (player.slash) {
            // 押して正解
            player.score.point.value += 2
          } else {
            // 押さずに正解
            player.score.point.value += 1
          }
        } else {
          if (player.slash) {
            // 押して誤答
            player.score.point.value -= 1
          }
        }
      }
    }
  },
}

const CyanaTennis = {
  name: "きゃな式テニス",
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

  makeDecision(player, state) {
    let point = player.score.point.value 
    if (point < 8) return "none"
    for (let p of Object.values(state.players)) {
      if (player.id != p.id && point - p.score.point.value < 2)
        return "none"
    }
    return "win"
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

let RuleHash = {
  SohosaiBoard,
  CyanaTennis,
}
