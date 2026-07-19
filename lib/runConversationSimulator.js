const readline = require('readline');
const process = require('process');

function runConversationSimulator(replyFunction) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '>>> '
  });

  rl.prompt();

  rl.on('line', async (line) => {
    const trimmed = line.trim();
    if (trimmed === '') {
      rl.prompt();
      return;
    }
    if (trimmed === 'exit') {
      rl.close();
      return;
    }
    try {
      const reply = await replyFunction(trimmed);
      if (typeof reply !== 'string') {
        console.log('Error: replyFunction returned non-string value');
      } else {
        console.log(reply);
      }
    } catch (err) {
      console.log('Error:', err.message || err);
    }
    rl.prompt();
  });

  rl.on('close', () => {
    process.exit(0);
  });

  process.on('SIGINT', () => {
    rl.close();
  });
}

module.exports = { runConversationSimulator };