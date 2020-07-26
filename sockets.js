let app = require('./express_endpoints.js');
let server = require('http').Server(app);
let db = require('./db_functions.js');
let io = require('socket.io')(server);
var request = require('request');

// clients store roomID's and the active clients within them
let clientsInRooms = new Map();
let connectedClients = new Set();

io.on('connection', function (client) {
  client.on('join', handleJoin);
  client.on('leave', handleLeave);
  client.on('disconnect', handleDisconnect);


  /**
   * Maintains a Map (clients) of active users per room. Upon a new client in 
   * a room, they are added to clients 
   * @param {Dictionary} data : Contains key 'roomID' that houses the "room" a user 
   * is inside
   */
  function handleJoin(data) {
    let roomID = data.roomID;
    if (clients.has(roomID)) {
      let currentActiveUsers = clients.get(roomID);
      currentActiveUsers.add(client)
    }
    else {
      let newActives = new Set()
      newActives.add(client)
      clients.set(roomID, newActives)
    }
    console.log(clients)
  }

  /**
   * Maintains a Map (clients) of actve users per room. Upon a client leaving, 
   * they are removed from clients. 
   * @param {Disctionary} data : Contains key 'roomID' that houses the "room" a user 
   */
  function handleLeave(data) {
    let roomID = data.roomID;
    if (clients.has(roomID)) {
      let currentActiveUsers = clients.get(roomID);
      if (currentActiveUsers.size == 1 && currentActiveUsers.has(client)) {
        clients.delete(roomID);
      }
      else if (currentActiveUsers.has(client)) {
        currentActiveUsers.delete(client)
      }
    }
  }

  /**
   *  Helper function to remove disconnected clients from Map
   */
  function handleDisconnectHelper(value, key, map) {
    if (value.has(client)) {
      handleLeave({ 'roomID': key }, () => { return; })
    }
  }

  /**
   * Removes user who disconnects from the clients Map
   */
  function handleDisconnect(data) {
    clients.forEach(handleDisconnectHelper)
    console.log(clients)
  }

  server.listen(process.env.PORT || 8000, () => {
    console.log("Listening on port 8000.");
  })
}); 