<template>
<div>

  <div id="chatConnect" v-if="!connection">
    <form>
      <label> WebSocket Connection: </label>
      <input type="text" v-model.lazy="url" placeholder="ws://localhost:5050/chat" required />
      <input type="text" v-model.lazy="name" placeholder="John" required />
    </form>
    <button @click.prevent="connectWebSocket"> Connect </button>
  </div>

  <div id="chatMessage" v-if="!!connection">
    <textarea readonly id="chatArea" v-model="chatArea" rows=20 resize=none> Something </textarea>
    <input type="text" v-model.lazy="message" placeholder="Say something ..." required />
    <button @click.prevent="sendMessage"> Send message </button>
  </div>

  <div id="resultAreaWS">
    <label id="resultLabelWS"> Current client_id: </label>
    <p id="serverResponseWS"> {{ client_id }} </p>
    <label id="resultLabelWS"> Sever's latest response: </label>
    <p id="serverResponseWS"> {{ serverResponseWS }} </p>
  </div>

</div>
</template>

<script>
export default {
  data() {
    return {
      default_url: "ws://localhost:5050/chat",
      default_name: "John",
      client_id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      url: "",
      name: "",
      message: "",
      chatArea: "",
      serverResponseWS: "",
      connection: null
    }
  },
  methods: {
    connectWebSocket: function() {
      console.log("Starting connection to WebSocket Server...")
      if (!this.url) {
        console.log(`Empty URL, using default: ${this.default_url}`)
        this.url = this.default_url
      }
      if (!this.name) {
        console.log(`Empty Name, using default: ${this.default_name}`)
        this.name = this.default_name
      }
      this.connection = new WebSocket(this.url)

      // Connection handlers
      this.connection.onopen = () => {
        console.log("Successfully connected to the websocket server!")
        this.serverResponseWS = "Successfully connected to the websocket server!"
        
        // Send initial connection message
        this.sendConnect();
      }
      this.connection.onmessage = (event) => {
        const { name, msg } = JSON.parse(event.data)
        console.log(`Received server message from ${name}: ${msg}`)
        this.serverResponseWS = `${msg} (${name})`
        this.chatArea += name + ': ' + msg + '\n' 
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
      if (this.message) {
        this.sendBase("message", true);
        this.message = ""
      }
    },
    sendBase: function(type, showMessage) {
      if (!this.connection) {
        console.log(`ERROR: Could not send message type [${type}] because connection is down!`);
        return false;
      }
      if (showMessage) console.log(`Sending message: "${this.message}"`)
      const msgObj = `{"type": "${type}", "client_id": "${this.client_id}", "name": "${this.name}", "msg": "${this.message}"}`
      this.connection.send(msgObj);
      return true;
    }
  }
}
</script>

<style scoped>
#chatConnect * {
  box-sizing: border-box;
}
#chatConnect {
  margin: 20px auto;
  max-width: 400px;
}
#chatMessage * {
  box-sizing: border-box;
}
#chatMessage {
  margin: 20px auto;
  max-width: 400px;
}
#chatArea {
  margin: 20px auto;
  max-width: 400px;
  resize: none;
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
  margin-top: 20px;
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