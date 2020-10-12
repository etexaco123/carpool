<template>
<div>

  <div id="register">
    <form>
      <label> Employee ID: </label>
      <input type="text" v-model.lazy="employee_id" required />
      <label> Password: </label>
      <input type="text" v-model.lazy="password" required />
      <button @click.prevent="postRegistration"> Register </button>
    </form>
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
      employee_id: "",
      password: "",
      serverResponse: "",
      showServerResponse: false
    }
  },
  methods: {
    postRegistration: function() {
      const server_host = process.env.VUE_APP_SERVER_HOST || '127.0.0.1';
      const server_port = process.env.VUE_APP_SERVER_PORT || '5050';
      const server_url = `http://${server_host}:${server_port}/register`

      axios.post(server_url, {
        employee_id: this.employee_id,
        password: this.password
      })
        .then(response => {
          this.serverResponse = response.data
        })
        .catch(error => {
          if (!error.response) {
            this.serverResponse = error.message
          } else {
            this.serverResponse = error.response.data
          }
        })
        .finally(() => {
          this.showServerResponse = true
        })

      this.employee_id = ""
      this.password = ""
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