import Koa from 'koa';
import IO from 'koa-socket-2';
import readline from 'readline';
import sendMessage from './modules/sendMessage/index.js';
import parseCommand from './modules/parseCommand/index.js';
import serverConfig from '../config/server.json';
import clientConfig from '../config/client.json';

const app = new Koa();
const io = new IO();

const terminal = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: serverConfig.prompt
});

const initInterface = () => {
  terminal.prompt();
  terminal.on('line', (line) => {
    if (line.indexOf('/') === 0) {
      console.log(`Sending command: ${line}`);
      sendMessage(parseCommand(line), io);
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
