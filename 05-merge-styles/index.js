const path = require('node:path');
const fsPromises = require('node:fs/promises');
const os = require('node:os');

const stylesDir = path.join(__dirname, 'styles');
const bundleFile = path.join(__dirname, 'project-dist', 'bundle.css');

async function mergeStyles(styles, bundler) {
  try {
    const files = await fsPromises.readdir(styles, {
      withFileTypes: true,
    });

    const cssFiles = files.filter(
      (file) => file.isFile() && path.extname(file.name) === '.css',
    );

    let bundleContent = '';
    for (const file of cssFiles) {
      const filePath = path.join(stylesDir, file.name);
      const content = await fsPromises.readFile(filePath, 'utf8');
      bundleContent += content + os.EOL;
    }

    await fsPromises.writeFile(bundler, bundleContent);
  } catch (error) {
    console.error('error:', error.message);
  }
}
mergeStyles(stylesDir, bundleFile);
