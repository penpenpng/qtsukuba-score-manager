"use strict"

import {
  app,
  BrowserWindow,
  ipcMain,
} from "electron"

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

  ipcMain.on("push", (e, type, payload) => {
    for (let w of Object.values(windows)) if (w)
      w.webContents.send("postback", type, payload)
    store.commit(type, payload)
  })
  
  ipcMain.on("fetch", () => {
    for (let w of Object.values(windows)) if (w)
      w.webContents.send("initialize", store.state)
  })

  ipcMain.on("open-view-page", () => {
    if (!windows.view) createViewWindow()
  })

  createControlWindow()
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

  windows.view.loadURL(winURL + "/#/test")

  windows.view.on("closed", () => {
    windows.view = null
  })
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
