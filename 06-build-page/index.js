const path = require('node:path');
const fsPromises = require('node:fs/promises');
const os = require('node:os');

const projectDist = path.join(__dirname, 'project-dist');
const outputHTMLPath = path.join(projectDist, 'index.html');
const outputCSSPath = path.join(projectDist, 'style.css');
const outputAssetsPath = path.join(projectDist, 'assets');
const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const stylesPath = path.join(__dirname, 'styles');
const assetsPath = path.join(__dirname, 'assets');

async function createDirectory(dirPath) {
  try {
    await fsPromises.access(dirPath);

    await fsPromises.rm(dirPath, { recursive: true, force: true });
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error('error:', error.message);
    }
  }

  await fsPromises.mkdir(dirPath, { recursive: true });
}

async function replaceTemplateTags() {
  try {
    let template = await fsPromises.readFile(templatePath, 'utf-8');

    const tags = template.match(/{{\w+}}/g);

    for (const tag of tags) {
      const tagName = tag.slice(2, -2);
      const componentPath = path.join(componentsPath, `${tagName}.html`);
      const componentContent = await fsPromises.readFile(
        componentPath,
        'utf-8',
      );
      template = template.replace(tag, componentContent);
    }

    await fsPromises.writeFile(outputHTMLPath, template);
  } catch (error) {
    console.error('error:', error.message);
  }
}

async function bundleStyles() {
  try {
    const files = await fsPromises.readdir(stylesPath);

    const styleFiles = files.filter((file) => path.extname(file) === '.css');

    let styles = '';
    for (const file of styleFiles) {
      const styleContent = await fsPromises.readFile(
        path.join(stylesPath, file),
        'utf-8',
      );
      styles += styleContent + os.EOL;
    }

    await fsPromises.writeFile(outputCSSPath, styles);
  } catch (error) {
    console.error('error:', error.message);
  }
}

async function copyDirectory(src, dest) {
  try {
    await fsPromises.mkdir(dest, { recursive: true });

    const dirs = await fsPromises.readdir(src, { withFileTypes: true });

    for (const item of dirs) {
      const srcPath = path.join(src, item.name);
      const destPath = path.join(dest, item.name);
      if (item.isDirectory()) {
        await copyDirectory(srcPath, destPath);
      } else {
        await fsPromises.copyFile(srcPath, destPath);
      }
    }
  } catch (error) {
    console.error('error:', error.message);
  }
}

async function buildPage() {
  try {
    await createDirectory(projectDist);
    await replaceTemplateTags();
    await bundleStyles();
    await copyDirectory(assetsPath, outputAssetsPath);
    console.log('All ok');
  } catch (error) {
    console.error('error:', error.message);
  }
}

buildPage();
