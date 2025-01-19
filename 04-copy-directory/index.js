const path = require('node:path');
const fs = require('node:fs/promises');

async function copyDir(folder, copyFolder) {
  try {
    try {
      await fs.access(copyFolder);
      await fs.rm(copyFolder, { recursive: true, force: true });
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.error('error:', error.message);
      }
    }

    await fs.mkdir(copyFolder, { recursive: true });
    const dirs = await fs.readdir(folder, { withFileTypes: true });

    for (const item of dirs) {
      const place = path.join(folder, item.name);
      const newPlace = path.join(copyFolder, item.name);
      if (item.isDirectory()) {
        await copyDir(place, newPlace);
      } else {
        await fs.copyFile(place, newPlace);
      }
    }
  } catch (error) {
    console.error('error:', error.message);
  }
}

const dir = path.resolve(__dirname, 'files');
const newDir = path.resolve(__dirname, 'files-copy');

copyDir(dir, newDir);
