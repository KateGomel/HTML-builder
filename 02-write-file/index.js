const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');
const os = require('node:os');

const filePath = path.join(__dirname, 'output.txt');

const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log(
  'Welcome. Enter your text. Press CTRL+C or type “exit” to leave the program.',
);

rl.on('line', (input) => {
  if (input.trim().toLowerCase() === 'exit') {
    closeProcess();
  } else {
    writeStream.write(`${input}` + os.EOL);
    console.log(
      'The text is saved. You can enter more text. Press CTRL+C or type “exit” to exit the program.',
    );
  }
});

function closeProcess() {
  console.log('Good Luck!');
  rl.close();
  writeStream.end(() => {
    fs.unlink(filePath, () => {
      process.exit();
    });
  });
}

rl.on('SIGINT', closeProcess);
