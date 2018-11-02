"use strict"

import {
  app,
  BrowserWindow,
  ipcMain,
  dialog,
  Menu,
  shell,
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
import cloneDeep from "lodash/cloneDeep"
import isEmpty from "lodash/isEmpty"
import parseCsv from "csv-parse/lib/sync"

import store from "../store"

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== "development") {
  global.__static = require("path").join(__dirname, "/static").replace(/\\/g, "\\\\")
}

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = true


let windows = {}
let backup = cloneDeep(store.state)


app.on("ready", main)

function main() {
  app.on("activate", () => {
    if (!windows.control) createControlWindow()
  })

  registerIpcEvents()
  setApplicationMenu()
  createControlWindow()
}

function registerIpcEvents() {
  function sync() {
    for (let w of Object.values(windows)) if (w)
      w.webContents.send("initialize", store.state)
  }

  ipcMain.on("push", (e, t, p) => commit(t, p))
  ipcMain.on("fetch", sync)
}

function setApplicationMenu() {
  function sendNotice(window, text) {
    window.webContents.send("notice", text)
  }

  function loadBackup() {
    store.replaceState(backup)
    for (let w of Object.values(windows)) if (w)
      w.webContents.send("initialize", backup)
  }

  function loadCsv() {
    function askCsvFilePaths() {
      return dialog.showOpenDialog({
        properties: ["openFile", "multiSelections"],
        filters: [{name: "csv", extensions: ["csv"]}],
      })
    }

    function loadNormalQuizData(filePath) {
      const { base } = parsePath(filePath)

      let content
      try {
        let buf = readFileSync(filePath)
        let enc = detect(buf)
        content = convert(buf, {
          from: enc,
          to: "UNICODE",
          type: "string",
        })
      } catch (_) {
        throw Error(`${base}を開けませんでした`)
      }

      let csv
      try {
        csv = parseCsv(content, {
          skip_empty_lines: true,
        })
      } catch (_) {
        throw Error(`${base}のパースに失敗しました`)
      }

      let list = []
      for (let row of csv) {
        if (row.length <= 1)
          continue
        let question = row[0].trim()
        let answer = row[1].trim()
        if (isEmpty(question) || isEmpty(answer))
          continue
        list.push({
          q: question,
          a: answer,
        })
      }
      return list
    }

    const csvPaths = askCsvFilePaths()
    if (!csvPaths)
      return

    let data = {}
    let messages = []
    for (let file of csvPaths) {
      let quizList
      try {
        quizList = loadNormalQuizData(file)
      } catch (e) {
        message.push(`[ERROR] ${e.message}`)
        continue
      }

      if (isEmpty(quizList)) {
        messages.push(`[ERROR] ${file}は空です`)
        continue
      }

      const genre = parsePath(file).name
      messages.push(`${file}から${list.length}件の問題を読み込みました`)
      data[genre] = [{
        q: "(この問題はダミーです)",
        a: "",
      }].concat(quizList)
    }

    if (data)
      commit("loadNormalQuizData", data)
    if (messages && windows.control)
      sendNotice(windows.control, messages.join("\n"))
  }

  function loadImageDirectory() {
    function askImageDirectoryPaths() {
      return dialog.showOpenDialog({
        properties: ["openDirectory", "multiSelections"],
      })
    }

    function loadVisualQuizData(dirPath) {
      let list = []
      for (let filePath of readdirSync(dirPath).sort()) {
        const { name, ext } = parsePath(filePath)

        if (!/(jpe?g|png)/i.test(ext))
          continue

        try {
          let splitted = name.split("_")
          list.push({
            q: splitted[1].trim(),
            a: splitted[2].trim(),
            path: joinPath(dirPath, filePath),
          })
        } catch (_) {
          continue
        }
      }
      return list
    }

    const dirPaths = askImageDirectoryPaths()
    if (!dirPaths)
      return

    let data = {}
    let messages = []
    for (let dir of dirPaths) {
      let quizList = loadVisualQuizData(dir)

      if (isEmpty(quizList)) {
        messages.push(`[ERROR] ${dir}には適切な画像ファイルがありません`)
        continue
      }

      messages.push(`${dir}から${list.length}件の問題を読み込みました`)
      data[`[Visual] ${parsePath(dir).name}`] = [{
        q: "(この問題はダミーです)",
        a: "",
        path: "",
      }].concat(quizList)
    }

    if (data)
      commit("loadImageQuizData", data)
    if (messages && windows.control)
      sendNotice(windows.control, messages.join("\n"))
  }

  Menu.setApplicationMenu(Menu.buildFromTemplate([
    {
      label: "表示",
      submenu: [{
        label: "得点表示ウィンドウ",
        click: createViewWindow,
      }],
    },
    {
      label: "制御",
      submenu: [
        {
          label: "CSVから問題を読み込む",
          click: loadCsv,
        },
        {
          label: "画像フォルダから問題を読み込む",
          click: loadImageDirectory,
        },
        {
          label: "1つ前のスコア処理をキャンセルする",
          click: loadBackup,
        }
      ],
    },
    {
      label: "ヘルプ",
      submenu: [{
        label: "Github",
        click: () => {
          shell.openExternal("https://github.com/penpenpng/qtsukuba-score-manager")
        },
      }]
    }
  ]))
}

function createControlWindow() {
  if (windows.control)
    windows.control.close()

  let win = new BrowserWindow({
    height: 563,
    width: 1000,
    useContentSize: true,
  })

  win.loadURL(url(""))
  win.on("close", (e) => {
    if (process.platform !== "darwin") {
      let clicked = dialog.showMessageBox({
        type: "question",
        title: "確認",
        message: "アプリケーションを終了しますか？",
        buttons: ["終了", "キャンセル"],
      })
      if (clicked === 1)
        e.preventDefault()
    }
  })
  win.on("closed", () => {
    windows.control = null
    if (windows.view)
      windows.view.close()

    if (process.platform !== "darwin")
      app.quit()
  })

  windows.control = win
}

function createViewWindow() {
  if (windows.view)
    windows.view.close()

  let win = new BrowserWindow({
    height: 563,
    width: 1000,
    useContentSize: true,
    autoHideMenuBar: true,
  })
  win.loadURL(url("view"))
  win.on("closed", () => {
    commit("hideViewPage")
    windows.view = null
  })
  commit("showViewPage")

  windows.view = win
}

function commit(type, payload) {
  if (type === "resolveSlash")
    backup = cloneDeep(store.state)

  store.commit(type, payload)
  for (let w of Object.values(windows)) if (w)
    w.webContents.send("postback", type, payload)
}

function url(path) {
  if (process.env.NODE_ENV === "development")
    return `http://localhost:9080/#/${path}`
  else
    return `file://${__dirname}/index.html#${path}`
}


/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
