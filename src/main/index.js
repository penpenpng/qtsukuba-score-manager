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

let mainWindow, subWindow
const winURL = process.env.NODE_ENV === "development"
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`


function main() {
  ipcMain.on("push", (e, type, payload) => {
    mainWindow.webContents.send("postback", type, payload)
    subWindow.webContents.send("postback", type, payload)
    store.commit(type, payload)
  })
  
  ipcMain.on("fetch", () => {
    mainWindow.webContents.send("initialize", store.state)
    subWindow.webContents.send("initialize", store.state)
  })

  createMainWindow()
  createSubWindow()
}


function createMainWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
  })

  mainWindow.loadURL(winURL)

  mainWindow.on("closed", () => {
    mainWindow = null
  })
}


function createSubWindow() {
  /**
   * Initial window options
   */
  subWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
  })

  subWindow.loadURL(winURL + "/#/test")

  subWindow.on("closed", () => {
    subWindow = null
  })
}

app.on("ready", main)

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", () => {
  if (mainWindow === null) {
    createMainWindow()
  }
})

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
