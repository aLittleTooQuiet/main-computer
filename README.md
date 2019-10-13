# main-computer
A simple chat server and client for replicating retro sci-fi computer interfaces.

# basic usage
Make sure you have node.js installed on your system and have installed the dependancies in the `client` and `server` folders with `npm install`.

For best results, whether you're on the server or client, send only one message at a time and then wait for the response. If you try sending mutliple messages between responses, you'll start to have issues.

There are still several bugs, and if you start to see issues such as messages not being sent or duplicate characters appear when typing at the prompt, you can hit `ctrl-c` to exit the app and restart. You should usually be able to reconnect a client to an existing server without issues, but if that doesn't work, restart the server as well.

## server
Open a terminal window and navigate to the `main-computer` folder. To start the server, use the command
```
npm run start-server
```

When the ` > ` prompt appears, you can type `/clear` to send a command to reset the client's terminal to the intro screen.

By default, the server will run on port 3000. You can change the port in `/server/config/server.json`.

You can change the computer's idendity, intro text, and prompt for the client by editing `/server/config/client.json`.

## client
Open a terminal window and navigate to the `main-computer` folder. To start the server, use the command
```
npm run start-client
```

When prompted, enter the IP address and port of the server.
