"use strict"

import {
  app,
  BrowserWindow,
  ipcMain,
  dialog,
} from "electron"
import {
  readFileSync
} from "fs"
import {
  parse as parsePath
} from "path"
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

const winURL = process.env.NODE_ENV === "development"
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`


let windows = {}


function main() {
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit()
  })
  
  app.on("activate", () => {
    if (!windows.control) createControlWindow()
  })

  ipcMain.on("push", commit)
  
  ipcMain.on("fetch", () => {
    for (let w of Object.values(windows)) if (w)
      w.webContents.send("initialize", store.state)
  })

  ipcMain.on("open-view-page", () => {
    if (!windows.view) createViewWindow()
  })

  ipcMain.on("select-and-read-csv", (e) => {
    let paths = dialog.showOpenDialog(e.sender, {
      properties: ["openFile", "multiSelections"],
      filters: [{name: "csv", extensions: [".csv"]}],
    })

    if (!paths)
      return
    
    let data = {}
    let messages = []
    for (let path of paths) {
      let { base, name, ext } = parsePath(path)
      const genre = name

      if (ext !== ".csv" && ext !== ".CSV") {
        messages.push(`[ERROR] ${base}はcsvファイルではありません`)
        continue
      }

      let content
      try {
        content = readFileSync(path, {
          encoding: "utf-8"
        })
      } catch (_) {
        messages.push(`[ERROR] ${base}の読み込みに失敗しました`)
        continue
      }

      let list = []
      try {
        const csv = parseCsv(content)
        for (let row of csv)
          list.push({
            q: row[0].trim(),
            a: row[1].trim(),
          })
      } catch (_) {
        messages.push(`[ERROR] ${base}のパースに失敗しました`)
        continue
      }

      if (list.length <= 0) {
        messages.push(`[ERROR] ${base}は空です`)
        continue
      }

      if (store.state.quiz.genres.findIndex((g) => g === genre) < 0) {
        messages.push(`"${genre}"は正常に読み込まれました`)
      } else {
        messages.push(`"${genre}"は上書きされました`)
      }
      data[genre] = list
    }

    if (data)
      commit("postback", "loadNormalQuizData", data)
    sendNotice(e.sender, messages.join("\n"))
  })

  createControlWindow()
  createViewWindow()
}


function createControlWindow() {
  windows.control = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
  })

  windows.control.loadURL(winURL)

  windows.control.on("closed", () => {
    windows.control = null
  })
}


function createViewWindow() {
  windows.view = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
  })

  windows.view.loadURL(winURL + "/#/view")

  windows.view.on("closed", () => {
    windows.view = null
  })
}


function sendNotice(window, text) {
  window.webContents.send("notice", text)
}


function commit(e, type, payload) {
  for (let w of Object.values(windows)) if (w)
    w.webContents.send("postback", type, payload)
  store.commit(type, payload)
}

  
app.on("ready", main)


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
