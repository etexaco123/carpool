<template>
<div>

  <div id="testWebSocketsConnect">
    <form>
      <label> URL WebSockets: </label>
      <input type="text" v-model.lazy="url" placeholder="ws://localhost:5050/testwebsockets" required />
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

  <div id="resultArea">
    <label id="resultLabel"> Result: </label>
    <p id="serverResponse"> {{ serverResponse }} </p>
  </div>

</div>
</template>

<script>
export default {
  data() {
    return {
      url: "",
      message: "",
      serverResponse: "",
      connection: null
    }
  },
  methods: {
    connectWebSocket: function() {
      console.log("Starting connection to WebSocket Server...")
      this.connection = new WebSocket(this.url)

      this.connection.onmessage = function(event) {
        console.log(event);
      }

      this.connection.onopen = function(event) {
        console.log("Successfully connected to the websocket server...")
        console.log(event)
      }

      this.connection.onerror = function(event) {
        console.log(`Websocket error`)
        console.log(event)
      }

      this.connection.onclose = function(event) {
        console.log(`Websocket closed`)
        console.log(event)
      }
    },
    sendMessage: function() {
      console.log(`Sending message: "${this.message}"`)
      console.log(this.connection);
      if (this.connection) this.connection.send(this.message);
      else console.log(`ERROR: Could not send message because connection is down!`);
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

#resultArea {
  background: lightyellow;
  padding: 1px;
  margin-top: 10px;
  margin-bottom: 10px;
  max-width: 600px;
}
#resultLabel {
  text-align: center;
  font-weight: bold;
}

</style>