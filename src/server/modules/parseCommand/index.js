export default (str) => {
  const command = str.substring(1);
  return {
    type: 'command',
    command
  };
};
