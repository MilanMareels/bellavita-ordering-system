const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false, // Handig voor lokale API calls, zet op true voor productie indien mogelijk
    },
  });

  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    // Development: Laad de Vite server
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools(); // Open de console
  } else {
    // Productie: Laad het bestand
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
