"use strict"

import {
  app,
  ipcMain,
  Menu,
  shell,
} from "electron"

import {
  initializeWindows,
  openControlWindow,
  openViewWindow,
} from "./appWindows"
import {
  initializeFunctions,
  commit,
  syncAppStates,
  openSelectCsvDialog,
  openSelectImageDirectoryDialog,
  rollbackState,
} from "./appFunctions"

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== "development") {
  global.__static = require("path").join(__dirname, "/static").replace(/\\/g, "\\\\")
}

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = true


app.on("ready", main)

function main() {
  app.on("activate", openControlWindow)

  initializeWindows()
  initializeFunctions()
  
  registerIpcEvents()
  setApplicationMenu()
  openControlWindow()
}

function registerIpcEvents() {
  ipcMain.on("push", (e, t, p) => commit(t, p))
  ipcMain.on("fetch", syncAppStates)
}

function setApplicationMenu() {
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    {
      label: "表示",
      submenu: [{
        label: "得点表示ウィンドウ",
        click: openViewWindow,
      }],
    },
    {
      label: "制御",
      submenu: [
        {
          label: "CSVから問題を読み込む",
          click: openSelectCsvDialog,
        },
        {
          label: "画像フォルダから問題を読み込む",
          click: openSelectImageDirectoryDialog,
        },
        {
          label: "1つ前のスコア処理をキャンセルする",
          click: rollbackState,
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
