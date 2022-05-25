const electron = require("electron");
const { listen } = require("./app");
const { app, BrowserWindow } = electron;
const appServer = require("./app")

let win;

app.on("ready", () => {
  win = new BrowserWindow({
    width: 1580,
    height: 920,
    webPreferences: {
      nodeIntegration: true,
    },
    resizable: false,
    show: false,
  });


  // appServer.listen("5000")
  win.loadURL(`http://localhost:5000`);

  win.once("ready-to-show", () => {
    win.show();
  })

  
  
  win.on("closed", () => {
    win = null;
    console.log("closed");
  });
});
