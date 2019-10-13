import io from 'socket.io-client';
import readline from 'readline';
import clearTerminal from './modules/clearTerminal/index.js';
import createTerminalInterface from './modules/createTerminalInterface/index.js';
import printMessage from './modules/printMessage/index.js';

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

let socket;
let lastSentMessage = null;
let lastReceivedResponse = null;
let terminal = createTerminalInterface(process.stdin, process.stdout);

let terminalGreeting = '\n\n\n Main Computer\n';
let introText = ' Please enter a command or query...\n\n > ';
let prompt = ' |> ';

const resetTerminal = () => {
  terminal.close();
  clearTerminal();
  process.stdout.write(`${terminalGreeting}`);
  terminal = createTerminalInterface(process.stdin, process.stdout);
  terminal.question(introText, (answer) => {
    lastSentMessage = answer;
    socket.send(lastSentMessage);
    terminal.close();
  });
};

const onRemoteInit = (config = {}) => {
  terminalGreeting = config.terminalGreeting || terminalGreeting;
  introText = config.introText || introText;
  prompt = config.prompt || prompt;
  resetTerminal();
};

const onConnect = () => {
  console.log(`${socket.id} connected`);
  // resetTerminal();
}

const onMessage = async (data) => {
  if (typeof data === 'string') {
    lastReceivedResponse = data;
    process.stdout.write('\x1Bc');
    if (lastSentMessage) {
      process.stdout.write(`\n\n\n ${lastSentMessage}\n`);
    }
    process.stdout.write(' ');
    await printMessage(`${lastReceivedResponse}`, 10);
    process.stdout.write('\n\n');
    terminal = createTerminalInterface(process.stdin, process.stdout);
    terminal.question(`${prompt}`, (answer) => {
      lastSentMessage = answer;
      socket.send(lastSentMessage);
      terminal.close();
    });
  } else {
    if (data.type === 'command') {
      switch (data.command) {
        case 'clear':
          resetTerminal();
          break;
        case 'init':
          onRemoteInit(data.config);
          break;
        default:
          break;
      }
    }
  }
}

const createServer = (serverUrl) => {
  // TODO sanitize serverUrl
  socket = io(`http://${serverUrl}`);
  terminal.close();

  process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c') {
      socket.close();
      terminal.close();
      process.exit();
    }
  });

  socket.on('connect', onConnect);
  socket.on('message', onMessage);
};

clearTerminal();
terminal.question('\n\nEnter server url:port | ', createServer);
