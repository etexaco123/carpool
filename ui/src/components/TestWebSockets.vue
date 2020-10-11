<template>
<div>

  <div id="testWebSocketsConnect">
    <form>
      <label> WebSocket Connection: </label>
      <input type="text" v-model.lazy="url" placeholder="ws://localhost:5050/testwebsockets" required />
      <input type="text" v-model.lazy="name" placeholder="John" required />
    </form>
  </div>

  <div>
    <button @click.prevent="connectWebSocket"> Connect </button>
  </div>

  <div id="testWebSocketsMessage">
    <form>
      <label> Message: </label>
      <input type="text" v-model.lazy="message" placeholder="Say something ..." required />
    </form>
  </div>

  <div>
    <button @click.prevent="sendMessage"> Send message </button>
  </div>

  <div id="resultAreaWS">
    <label id="resultLabelWS"> Current client_id: </label>
    <p id="serverResponseWS"> {{ client_id }} </p>
    <label id="resultLabelWS"> Result: </label>
    <p id="serverResponseWS"> {{ serverResponseWS }} </p>
  </div>

</div>
</template>

<script>
export default {
  data() {
    return {
      client_id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      url: "",
      name: "",
      message: "",
      serverResponseWS: "",
      connection: null
    }
  },
  methods: {
    connectWebSocket: function() {
      console.log("Starting connection to WebSocket Server...")
      this.connection = new WebSocket(this.url)

      // Connection handlers
      this.connection.onopen = () => {
        console.log("Successfully connected to the websocket server!")
        this.serverResponseWS = "Successfully connected to the websocket server!"
        
        // Send initial connection message
        this.sendConnect();
      }
      this.connection.onmessage = (event) => {
        const { msg } = JSON.parse(event.data)
        console.log(`Received server message: ${msg}`)
        this.serverResponseWS = msg
      }
      this.connection.onerror = (event) => {
        console.log(`Websocket error`)
        console.log(event)
      }
      this.connection.onclose = () => {
        console.log(`Server Websocket closed`)
      }
    },
    sendConnect: function() {
      this.sendBase("connect", false);
    },
    sendMessage: function() {
      this.sendBase("message", true);
    },
    sendBase: function(type, showMessage) {
      if (showMessage) console.log(`Sending message: "${this.message}"`)
      if (this.connection) {
        const msgObj = `{"type": "${type}", "client_id": "${this.client_id}", "name": "${this.name}", "msg": "${this.message}"}`
        this.connection.send(msgObj);
      } else {
        console.log(`ERROR: Could not send message type [${type}] because connection is down!`);
      }
    }
  }
}
</script>

<style scoped>
#testWebSocketsConnect * {
  box-sizing: border-box;
}
#testWebSocketsConnect {
  margin: 20px auto;
  max-width: 400px;
}
#testWebSocketsMessage * {
  box-sizing: border-box;
}
#testWebSocketsMessage {
  margin: 20px auto;
  max-width: 400px;
}
label {
  display: block;
  margin: 20px 0 10px;
  font-weight: bold;
}
input[type="text"], textarea {
  display: block;
  width: 100%;
  padding: 8px;
}
button {
  margin-bottom: 20px;
  padding: 10px;
}

#resultAreaWS {
  background: lightyellow;
  padding: 1px;
  margin-top: 10px;
  margin-bottom: 10px;
  max-width: 600px;
}
#resultLabelWS {
  text-align: center;
  font-weight: bold;
}

</style>