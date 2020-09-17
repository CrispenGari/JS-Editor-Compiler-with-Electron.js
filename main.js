const electron = require("electron");
const path = require("path");
const url = require("url");
const fs = require("fs");

const ipc = electron.ipcMain;
let window;

const createWindow = () => {
  window = new electron.BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
    },
    center: true,
    darkTheme: true,
    resizable: true,
  });
  window.loadURL(
    url.format({
      slashes: true,
      protocol: "file",
      pathname: path.join(__dirname, "public/index.html"),
    })
  );

  electron.app.on("closed", () => {
    window: null;
  });
  window.webContents.openDevTools({ mode: "bottom" });
};

// listeners
ipc.on("clear-editor", (event, args) => {
  electron.dialog
    .showMessageBox(window, {
      message: "ARE YOU SURE YOU WANT TO CLEAR THE TEXT JS-TEXT EDITOR",
      buttons: ["Yes", "No", "Close"],
      defaultId: 0, // bound to buttons array
      cancelId: 1, // bound to buttons array
      closeId: 2,
    })
    .then((result) => {
      event.sender.send("response", result);
    });
});

ipc.on("open-file", (event, args) => {
  electron.dialog
    .showOpenDialog({
      title: "Chose a JavaScript File",
      closable: false,
      filters: [{ name: "JavaScript Files", extensions: ["js"] }],
    })
    .then((filenames) => {
      if (filenames.filePaths === undefined) {
        electron.dialog.showErrorBox("FILE ERROR", "UNABLE TO SELECT A FILE");
      } else {
        fs.readFile(filenames.filePaths[0], "utf8", (error, data) => {
          if (error) {
            throw error;
          } else {
            event.sender.send("data", data);
          }
        });
      }
    })
    .catch((error) => {
      electron.dialog.showErrorBox("FILE ERROR", error);
    });
});
const openFiles = () => {};

const template_menu = [
  {
    label: "File",
    submenu: [
      {
        role: "undo",
      },
      {
        role: "redo",
      },
      {
        type: "separator",
      },
      {
        role: "cut",
      },
      {
        role: "copy",
      },
      {
        role: "paste",
      },
      {
        role: "reload",
      },

      {
        type: "separator",
      },
      {
        role: "resetzoom",
      },
      {
        role: "zoomin",
      },
      {
        role: "zoomout",
      },
      {
        type: "separator",
      },
      {
        role: "togglefullscreen",
      },
      {
        role: "close",
      },
      {
        label: "Open",
        click: openFiles,
      },
    ],
  },
];
const menu = electron.Menu.buildFromTemplate(template_menu);
electron.Menu.setApplicationMenu(menu);
electron.app.on("ready", createWindow);
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
electron.app.on("activate", () => {
  if (electron.BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
