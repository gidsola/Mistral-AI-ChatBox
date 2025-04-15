import electron from 'electron';
import serve from 'electron-serve';
import prompt from 'electron-prompt';
import { writeFile, readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

/**
 * @description
 * This is the development/production toggle.
 * This will be moved to env or config.
 */
const isDev = false,

  serveURL = serve({ directory: 'out' }),
  __dirname = dirname(fileURLToPath(import.meta.url)),
  { app, BrowserWindow, ipcMain, Menu, MenuItem } = electron,
  contextMenu = new Menu(),
  promptObject = {
    title: 'Please enter a username',
    label: 'Username:',
    value: 'username',
    inputAttrs: {
      type: 'text'
    },
    type: 'input'
  },
  printOptions = { silent: false, printBackground: false };

let
  USERNAME = '',
  AINAME = 'Assistant',
  tempUSERPFP = '/images/ph.png',
  tempAIPFP = '/images/ph.png',
  tempGradientColors = ['#ff0000', '#00ff00', '#0000ff'];

async function writeSettingsToFile(settings = null) {
  const defaults = {
    userName: USERNAME,
    aiName: AINAME,
    userPfp: tempUSERPFP,
    aiPfp: tempAIPFP,
    gradientColors: tempGradientColors
  };
  try {
    await writeFile('settings.json', JSON.stringify(settings == null ? defaults : settings, null, 2));
  }
  catch (e) {
    console.error('Error writing settings to file:', e);
  }
};

async function readSettingsFromFile() {
  try {
    const
      data = await readFile('settings.json', 'utf-8'),
      settings = JSON.parse(data);

    USERNAME = settings.userName;
    AINAME = settings.aiName;
    tempUSERPFP = settings.userPfp;
    tempAIPFP = settings.aiPfp;
    tempGradientColors = settings.gradientColors;

    return;
  } catch (e) {
    // console.error('Error reading settings from file:', e);
    writeSettingsToFile();
    // console.log('Default settings saved to settings.json');
    return await readSettingsFromFile();
  }
};

async function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 768,
    frame: isDev,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: false
    },
  });

  isDev
    ? await mainWindow.loadURL('http://localhost:3000')
    : await serveURL(mainWindow);

  ipcMain.on('minimize', () => {
    mainWindow.minimize();
  });

  ipcMain.on('maximize', () => {
    mainWindow.isMaximized()
      ? mainWindow.unmaximize()
      : mainWindow.maximize();
  });

  ipcMain.on('close', () => {
    mainWindow.close();
  });

  ipcMain.on('saveSettings', async (e, settings) => {
    // console.log(settings);
    await writeSettingsToFile(settings);
  });

  mainWindow.webContents.on('context-menu', (_, params) => {
    contextMenu.popup({ window: mainWindow, x: params.x, y: params.y });
  });

};

app.on('ready', async () => {
  await readSettingsFromFile();

  if (USERNAME === '') {
    USERNAME = await prompt(promptObject);
  };

  await createWindow();

  const WebContents = BrowserWindow.getFocusedWindow().webContents

  contextMenu.append(new MenuItem({
    label: 'Print Page', click() {
      WebContents.print(printOptions, (success, e) => {
        if (!success) console.log(e);
      });
    }
  }));

  contextMenu.append(new MenuItem({ type: 'separator' }));
  contextMenu.append(new MenuItem({
    label: 'Copy', click() {
      WebContents.copy();
    }
  }));

  contextMenu.append(new MenuItem({
    label: 'Paste', click() {
      WebContents.paste();
    }
  }));


})
  .on('window-all-closed', async () => {
    if (process.platform !== 'darwin') {
      // await writeSettingsToFile();
      app.quit();
    }
  })
  .on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await createWindow();
    }
  });


// fetches
ipcMain.handle('getUsername', () => {
  return USERNAME;
});
ipcMain.handle('getAiName', () => {
  return AINAME;
});
ipcMain.handle('getUserPfp', () => {
  return tempUSERPFP;
});
ipcMain.handle('getAiPfp', () => {
  return tempAIPFP;
});
ipcMain.handle('getTheme', () => {
  // console.log("getTheme called", tempGradientColors[0]);
  return tempGradientColors;
});

