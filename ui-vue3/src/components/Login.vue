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
    <button @click.prevent="postLogin"> Log in </button>
  </div>

  <div id="resultArea" v-if="this.showServerResponse">
    <label id="resultLabel"> Result: </label>
    <p id="serverResponse"> {{ serverResponse }} </p>
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
      serverResponse: "",
      showServerResponse: false,
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
          this.serverResponse = response.data
          console.log(this.stayloggedin);
        })
        .catch(error => {
          if (!error.response) {
            this.serverResponse = error.message
          } else {
            this.serverResponse = error.response.data
          }
        })
        .finally(() => {
          // Send the response to the parent App.vue
          this.$emit('showresult', this.serverResponse)
          this.showServerResponse = true
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
  font-weight: bold;
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