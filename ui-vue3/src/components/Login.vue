<template>
<div>

  <div id="login">
    <form>
      <label> Username: </label>
      <input type="text" v-model.lazy="username" required />
      <label> Password: </label>
      <input type="text" v-model.lazy="password" required />
    </form>
  </div>
  
  <div id="checkboxes">
    <label> Stay logged in </label>
    <input type="checkbox" value="true" v-model="stayloggedin" />
  </div>

  <div>
    <button v-on:click.prevent="postLogin"> Log in </button>
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
      loginResponse: "",
      stayloggedin: false
    }
  },
  methods: {
    postLogin: function() {
      const server_host = process.env.VUE_APP_SERVER_HOST || '0.0.0.0';
      const server_port = process.env.VUE_APP_SERVER_PORT || '5050';
      const server_url = `http://${server_host}:${server_port}/login`

      axios.post(server_url, {
        username: this.username,
        password: this.password
      })
        .then(response => {
          this.stayloggedin = response.data
          console.log(this.stayloggedin);

          // TODO: Emit response back to parent App and show it on the screen.
        })
        .catch(error => {
          if (!error.response) {
            this.stayloggedin = error.message
          } else {
            this.stayloggedin = error.response.data
          }

          // TODO: Emit response back to parent App and show it on the screen.
        })
    }
  }
}
</script>

<style scoped>
#login * {
  box-sizing: border-box;
}
#login {
  margin: 20px auto;
  max-width: 500px;
}
label {
  display: block;
  margin: 10px 0 10px;
}
input[type="text"], textarea {
  display: block;
  width: 100%;
  padding: 8px;
}
#checkboxes input {
  display: inline-block;
  margin-right: 10px;
}
#checkboxes label {
  display: inline-block;
}
button {
  margin-top: 10px;
  margin-bottom: 20px;
  padding: 10px;
}

</style>