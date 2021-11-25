import Koa from 'koa';
import IO from 'koa-socket-2';
import readline from 'readline';
import sendMessage from './modules/sendMessage/index.js';
import parseCommand from './modules/parseCommand/index.js';
import { getClientConfig, getServerConfig } from './modules/loadConfig/index.js';
import { exit } from 'process';
import loadText from './modules/loadText/index.js';

const clientConfig = await getClientConfig();
const serverConfig = await getServerConfig();

const app = new Koa();
const io = new IO();

const terminal = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: serverConfig.prompt
});

const initInterface = () => {
  terminal.prompt();
  terminal.on('line', async (line) => {
    if (line.indexOf('/') === 0) {
      const cmdBits = line.substring(1).split(' ')
      const cmd = cmdBits[0];
      switch (cmd) {
        case 'load':
          console.log('Loading text file...');
          const text = await loadText(cmdBits[1]);
          sendMessage(text, io);
          break;
        case 'quit':
        case 'exit':
          console.log('Shutting down...');
          exit(0);
        default:
          console.log(`Sending command: ${line}`);
          sendMessage(parseCommand(line), io);
          break;
      }
    } else {
      sendMessage(line, io);
    }
    terminal.prompt();
  });
}

const initClient = () => {
  const message = {
    type: 'command',
    command: 'init',
    config: clientConfig,
  };
  sendMessage(message, io);
};

io.attach(app);
io.on('connection', () => {
  initClient();
  initInterface();
});
io.on('message', (ctx, data) => {
  process.stdout.write(`\nUser: ${data}\n`);
  terminal.prompt();
});

app.listen( process.env.PORT || serverConfig.port || 3000 );
