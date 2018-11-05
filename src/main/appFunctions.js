"use strict"

import {
  dialog,
} from "electron"
import {
  readFileSync,
  readdirSync,
} from "fs"
import {
  join as joinPath,
  parse as parsePath,
} from "path"
import {
  detect,
  convert,
} from "encoding-japanese"
import isEmpty from "lodash/isEmpty"
import cloneDeep from "lodash/cloneDeep"
import parseCsv from "csv-parse/lib/sync"

import store from "../store"
import {
  ipcSend,
  ipcBroadcast,
  CONTROL_WINDOW,
} from "./appWindows"


export function initializeFunctions() {
  backup = cloneDeep(store.state)
}

export function syncAppStates() {
  ipcBroadcast("initialize", store.state)
}

export function commit(type, payload) {
  if (type === "resolveSlash")
    backup = cloneDeep(store.state)

  store.commit(type, payload)
  ipcBroadcast("postback", type, payload)
}

export function rollbackState() {
  store.replaceState(backup)
  ipcBroadcast("initialize", backup)
}

export function openSelectCsvDialog() {
  const csvPaths = dialog.showOpenDialog({
    properties: ["openFile", "multiSelections"],
    filters: [{name: "csv", extensions: ["csv"]}],
  })

  if (!csvPaths)
    return
  
  const messages = []
  const data = {}
  for (const csvPath of csvPaths) {
    const { name } = parsePath(csvPath)

    const csv = parseCsvFile(csvPath)
    if (csv === null)
      continue

    const quizList = csv2QuizList(csv)
    if (isEmpty(quizList)) {
      errorMessage(`${csvPath}は空です`)
      continue
    }

    data[name] = [{
      q: "(この問題はダミーです)",
      a: "",
    }].concat(quizList)
    infoMessage(`${csvPath}から${quizList.length}件の問題を読み込みました`)
  }

  if (data)
    commit("loadNormalQuizData", data)
  else
    errorMessage("読み込みはキャンセルされました")

  ipcSend(CONTROL_WINDOW, "notice", messages.join("\n"))
  return


  // local functions__________________________________

  function parseCsvFile(path) {
    let content
    try {
      const buf = readFileSync(path)
      const enc = detect(buf)
      content = convert(buf, {
        from: enc,
        to: "UNICODE",
        type: "string",
      })
    } catch (_) {
      errorMessage(`${parsePath(path).base}を開けませんでした`)
      return null
    }

    try {
      return parseCsv(content, {
        skip_empty_lines: true,
      })
    } catch (_) {
      errorMessage(`${parsePath(path).base}のパースに失敗しました`)
      return null
    }
  }

  function csv2QuizList(csv) {
    const list = []
    for (const row of csv) {
      if (row.length <= 1)
        continue
      const question = row[0].trim()
      const answer = row[1].trim()
      if (isEmpty(question) || isEmpty(answer))
        continue
      list.push({
        q: question,
        a: answer,
      })
    }

    return list
  }

  function errorMessage(msg) {
    messages.push(`[ERROR] ${msg}`)
  }

  function infoMessage(msg) {
    messages.push(`${msg}`)
  }
}

export function openSelectImageDirectoryDialog() {
  const dirPaths = dialog.showOpenDialog({
    properties: ["openDirectory", "multiSelections"],
  })

  if (!dirPaths)
    return
  
  const messages = []
  const data = {}
  for (const dirPath of dirPaths) {
    const quizList = []
    for (const filePath of readdirSync(dirPath).sort()) {
      const { base, name, ext } = parsePath(filePath)
      
      if (!/(jpe?g|png)/i.test(ext))
        continue
      
      try {
        const splitted = name.split("_")
        quizList.push({
          q: splitted[1].trim(),
          a: splitted[2].trim(),
          path: joinPath(dirPath, filePath),
        })
      } catch (_) {
        errorMessage(`${base}のファイル名は不適切です`)
        continue
      }
    }

    if (isEmpty(quizList)) {
      errorMessage(`${dirPath}には適切な画像ファイルがありません`)
      continue
    }

    data[`[Visual] ${parsePath(dirPath).name}`] = [{
      q: "(この問題はダミーです)",
      a: "",
      path: "",
    }].concat(quizList)
    infoMessage(`${dirPath}から${quizList.length}件の問題を読み込みました`)
  }

  if (data)
    commit("loadNormalQuizData", data)
  else
    errorMessage("読み込みはキャンセルされました")

  ipcSend(CONTROL_WINDOW, "notice", messages.join("\n"))
  return
  

  // local functions__________________________________

  function errorMessage(msg) {
    messages.push(`[ERROR] ${msg}`)
  }

  function infoMessage(msg) {
    messages.push(`${msg}`)
  }
}


// private members__________________________________

let backup
