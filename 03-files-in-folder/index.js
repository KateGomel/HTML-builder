const fs = require('node:fs/promises');
const path = require('node:path');

const folderName = path.join(__dirname, 'secret-folder');

async function listFiles(folder) {
  try {
    const filesArr = await fs.readdir(folder, {
      withFileTypes: true,
    });

    for (const file of filesArr) {
      if (file.isFile()) {
        const filePath = path.join(folder, file.name);
        const stats = await fs.stat(filePath);
        const size = stats.size / 1024;
        const ext = path.extname(file.name);
        console.log(
          `${file.name.replace(ext, '')} - ${ext.replace(
            '.',
            '',
          )} - ${size.toFixed(3)} kb`,
        );
      }
    }
  } catch (error) {
    console.log('error:', error.message);
  }
}

listFiles(folderName);
