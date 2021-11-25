import readline from 'readline';

export default (input, output, prompt) => readline.createInterface({
  input,
  output,
  prompt
});
