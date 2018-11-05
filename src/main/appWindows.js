"use strict"

import {
  app,
  BrowserWindow,
  dialog,
} from "electron"

import {
  commit,
} from "./appFunctions"


export const CONTROL_WINDOW = "control"
export const VIEW_WINDOW = "view"

export function initializeWindows() {
  windows = {}
}

export function openControlWindow() {
  if (windows[CONTROL_WINDOW])
    return

  let win = new BrowserWindow({
    height: 563,
    width: 1000,
    useContentSize: true,
  })

  if (process.platform !== "darwin") {
    win.on("close", (e) => {
      let clicked = dialog.showMessageBox({
        type: "question",
        title: "確認",
        message: "アプリケーションを終了しますか？",
        buttons: ["終了", "キャンセル"],
      })
      if (clicked === 1)
        e.preventDefault()
    })
    win.on("closed", () => {
      windows[CONTROL_WINDOW] = null
      if (windows[VIEW_WINDOW])
        windows[VIEW_WINDOW].close()
  
      app.quit()
    })
  } else {
    win.on("closed", () => {
      windows[CONTROL_WINDOW] = null
      if (windows[VIEW_WINDOW])
        windows[VIEW_WINDOW].close()
    })
  }

  win.loadURL(url(""))
  windows[CONTROL_WINDOW] = win
}

export function openViewWindow() {
  if (windows[VIEW_WINDOW])
    return

  let win = new BrowserWindow({
    height: 563,
    width: 1000,
    useContentSize: true,
    autoHideMenuBar: true,
  })
  win.on("closed", () => {
    windows[VIEW_WINDOW] = null
    commit("hideViewPage")
  })
  commit("showViewPage")

  win.loadURL(url("view"))
  windows[VIEW_WINDOW] = win
}

export function ipcSend(windowName, messageType, ...payload) {
  let window = windows[windowName]
  if (!window)
    throw Error(`Window "${windowName}" doesn't exist`)
  
  window.webContents.send(messageType, ...payload)
}

export function ipcBroadcast(messageType, ...payload) {
  for (let w of Object.values(windows)) if (w)
    w.webContents.send(messageType, ...payload)
}


// private members__________________________________

let windows

function url(path) {
  if (process.env.NODE_ENV === "development")
    return `http://localhost:9080/#/${path}`
  else
    return `file://${__dirname}/index.html#${path}`
}
