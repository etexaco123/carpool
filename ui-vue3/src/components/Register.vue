<template>
<div>

  <div id="register">
    <form>
      <label> Username: </label>
      <input type="text" v-model.lazy="username" required />
      <label> Password: </label>
      <input type="text" v-model.lazy="password" required />
    </form>
  </div>

  <div>
    <button v-on:click.prevent="postRegistration"> Submit </button>
  </div>

</div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: "",
      password: "",
      registerResponse: ""
    }
  },
  methods: {
    postRegistration: function() {
      const server_host = process.env.VUE_APP_SERVER_HOST || '0.0.0.0';
      const server_port = process.env.VUE_APP_SERVER_PORT || '5050';
      const server_url = `http://${server_host}:${server_port}/register`

      axios.post(server_url, {
        username: this.username,
        password: this.password
      })
        .then(response => {
          this.registerResponse = response.data
          console.log(this.registerResponse);

          // TODO: Emit response back to parent App and show it on the screen.
        })
        .catch(error => {
          if (!error.response) {
            this.testResponse = error.message
          } else {
            this.testResponse = error.response.data
          }

          // TODO: Emit response back to parent App and show it on the screen.
        })
    }
  }
}
</script>

<style scoped>
#register * {
  box-sizing: border-box;
}
#register {
  margin: 20px auto;
  max-width: 500px;
}
label {
  display: block;
  margin: 20px 0 10px;
}
input[type="text"], textarea {
  display: block;
  width: 100%;
  padding: 8px;
}
button {
  margin-top: 10px;
  margin-bottom: 20px;
  padding: 10px;
}

</style>