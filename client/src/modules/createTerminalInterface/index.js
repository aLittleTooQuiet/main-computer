import readline from 'readline';

export default (input, output) => readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
