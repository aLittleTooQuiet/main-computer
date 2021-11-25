# main-computer
A simple chat server and client for replicating retro sci-fi computer interfaces.

# basic usage
If you're running a tabletop RPG, for example, Mothership, and you want to give the players a more immersive way to interact with an AI NPC, you can run the server app on the GM's computer, and run the client app on a player's computer.

Make sure you have node.js installed on your system and have installed the dependancies in the `client` and `server` folders with `npm install`.

If you start to see issues such as messages not being sent or duplicate characters appear when typing at the prompt, you can hit `ctrl-c` to exit the app and restart. You should usually be able to reconnect a client to an existing server without issues, but if that doesn't work, restart the server as well.

For best results, run the client using [cool-retro-term](https://github.com/Swordfish90/cool-retro-term).

## server
Open a terminal window and navigate to the `main-computer` folder. To start the server, use the command
```
npm run start-server
```

When the ` > ` prompt appears, you can type `/clear` to send a command to reset the client's terminal to the intro screen.

Wait for the client to send a message, and then the server can send a response. The server can send multiple responses per client message. Each message sent by the server will show up a new line in repsonse to the current client message. A new message from the client will clear their display and start a new line of responses, and so will a `/clear` command on the server.

By default, the server will run on port 3000. You can change the port by creating the file `src/server/config/server.json`. The defaults are `config/server.js`, and will be loaded if there is no `server.json`.

Example `server.json`
```
export default {
  "port": 3000,
  "prompt": " >"
}
```

You can change the computer's identity, intro text, and prompt for the client by creating the file `src/server/config/client.json`. The defaults are in `config/client.js`, and will be loaded if there is no `client.json`.

Example `client.json`
```
{
  "terminalGreeting": "\n\n\n VICTR | Virtual Informatics Control and Telemetry Resource\n\n",
  "introText": " System ready.\n Enter your query...\n\n > ",
  "prompt": " > "
}
```

## client
Open a terminal window and navigate to the `main-computer` folder. To start the client, use the command
```
npm run start-client
```

When prompted, enter the IP address and port of the server.

You'll see a message introducing the computer system and a command prompt. Enter a message and hit enter/return to send to the server and then wait for the response.
