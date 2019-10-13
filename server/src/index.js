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
  output: process.stdout
});

const initInterface = () => {
  terminal.question(`> `, (answer) => {
    if (answer.indexOf('/') === 0) {
      console.log(`Sending command: ${answer}`);
      sendMessage(parseCommand(answer), io);
    } else {
      sendMessage(answer, io);           
      initInterface();
    }
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
  initInterface();
});

app.listen( process.env.PORT || serverConfig.port || 3000 );
