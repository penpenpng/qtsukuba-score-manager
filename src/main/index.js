"use strict"

import {
  app,
  ipcMain,
  Menu,
  shell,
  dialog,
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
  initializeWindows()
  initializeFunctions()
  
  registerAppEvents()
  registerIpcEvents()
  setApplicationMenu()
  openControlWindow()
}

function registerAppEvents() {
  app.on("activate", openControlWindow)
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
      submenu: [
        {
          label: "使い方",
          click: () => {
            shell.openExternal("https://github.com/penpenpng/qtsukuba-score-manager")
          },
        },
        {
          label: "このアプリについて",
          click: () => {
            dialog.showMessageBox({
              title: "バージョン情報",
              message: `qtsukuba-score-manager v${process.env.npm_package_version}\nelectron: v${process.versions["electron"]}\nchromium: v${process.versions["chrome"]}`
            })
          }
        }
      ]
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
