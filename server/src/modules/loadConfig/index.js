import { readFile } from 'fs/promises';
import path from 'path';
import { exit } from 'process';

const configPath = `./config`;
const clientFile = 'client.json';
const serverFile = 'server.json';

export const getClientConfig = async () => {
  let clientConfig;
  try {
    clientConfig = await readFile(path.resolve(configPath, clientFile));
    return JSON.parse(clientConfig);
  } catch (err) {
    try {
      clientConfig = import('../../../config/client.js');
      return clientConfig;
    } catch (err) {
      console.log(err.message);
      exit(1)
    }
  }
};

export const getServerConfig = async () => {
  let serverConfig;
  try {
    serverConfig = await readFile(path.resolve(configPath, serverFile));
    return JSON.parse(serverConfig);
  } catch (err) {
    try {
      serverConfig = import('../../../config/server.js');
      return serverConfig;
    } catch (err) {
      console.log(err.message);
      exit(1)
    }
  }
};
