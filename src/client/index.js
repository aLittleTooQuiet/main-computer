import io from 'socket.io-client';
import readline from 'readline';
import clearTerminal from './modules/clearTerminal/index.js';
import createTerminalInterface from './modules/createTerminalInterface/index.js';
import printMessage from './modules/printMessage/index.js';

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

let socket;
let lastSentMessage = null;
let lastReceivedResponses = [];

let terminalGreeting = '\n\n\n Main Computer\n';
let introText = ' Please enter a command or query...\n\n > ';
let prompt = ' |> ';

let terminal = createTerminalInterface(process.stdin, process.stdout, prompt);

const getSentMessageString = () => `\n\n ${lastSentMessage}\n\n\n`;
const getResponseString = () => ` ${lastReceivedResponses.join('\n\n ')}`;

const resetTerminal = () => {
  lastSentMessage = null;
  clearTerminal();
  process.stdout.write(`${terminalGreeting}`);
  process.stdout.write(`${introText}`);
  terminal.prompt();
};

const onLine = (line) => {
  lastSentMessage = line;
  lastReceivedResponses = [];
  socket.send(lastSentMessage);
  clearTerminal();
  process.stdout.write(getSentMessageString());
};

const onRemoteInit = (config = {}) => {
  terminalGreeting = config.terminalGreeting || terminalGreeting;
  introText = config.introText || introText;
  prompt = config.prompt || prompt;
  terminal.setPrompt(prompt);
  terminal.off('line', onLine);
  terminal.on('line', onLine);
  resetTerminal();
};

const onConnect = () => {
  console.log(`${socket.id} connected`);
}

const onMessage = async (data) => {
  if (typeof data === 'string') {
    lastReceivedResponses.push(data);
    clearTerminal();
    process.stdout.write(getSentMessageString());
    await printMessage(getResponseString(), 10);
    process.stdout.write('\n\n');
    terminal.prompt();
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

  process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c') {
      socket.close();
      process.exit(0);
    }
  });

  socket.on('connect', onConnect);
  socket.on('message', onMessage);
};

clearTerminal();
terminal.question('\n\nEnter server url:port | ', createServer);
