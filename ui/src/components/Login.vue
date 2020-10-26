<template>
<div>

  <div id="login" v-if="!payload.isLoggedIn">
    <form>
      <label> Employee ID: </label>
      <input type="text" :disabled=isInputDisabled v-model.lazy="employee_id" required />
      <label> Password: </label>
      <input type="password" :disabled=isInputDisabled v-model.lazy="password" required />
      <button :disabled=isInputDisabled @click.prevent="postLogin"> Log in </button>
    </form>
  </div>

  <div v-if="payload.isLoggedIn">
    <h3> Redirecting Home ... </h3>
  </div>

  <div id="resultArea" v-if="this.showServerResponse">
    <label id="resultLabel"> Result: </label>
    <p id="serverResponse"> {{ serverResponse.message }} </p>
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
      isInputDisabled: false,
      serverResponse: {
        error: false,
        message: "",
        data: {}
      },
      showServerResponse: false,
      payload: {
        isLoggedIn: false,
        userData: {}
      }
    }
  },
  methods: {
    postLogin: function() {
      const server_host = process.env.VUE_APP_SERVER_HOST || '127.0.0.1';
      const server_port = process.env.VUE_APP_SERVER_PORT || '5050';
      const server_url = `http://${server_host}:${server_port}/login`

      // Temporarily disable the input fields
      this.isInputDisabled = true;

      axios.post(server_url, {
        employee_id: this.employee_id,
        password: this.password        
      })
        .then(response => {
          this.serverResponse = response.data
          if (!this.serverResponse.error) {
            this.payload.isLoggedIn = true
            this.payload.userData = this.serverResponse.data
            this.$emit('dologin', this.payload)
            setTimeout(() => {
                this.$router.push({name: 'Home'});
                },3000);
          }
        })
        .catch(error => {
          if (!error.response) {
              this.serverResponse.message = error.message
          } else {
            this.serverResponse = error.response.data
          }
        })
        .finally(() => {          
          this.showServerResponse = true;

          // Clear up the fields
          this.employee_id = ""
          this.password = ""

          // re-enable the input fields
          this.isInputDisabled = false;
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
  margin-top: 20px;
  margin-bottom: 10px;
  font-weight: bold;
}
input[type="text"], textarea {
  display: block;
  width: 100%;
  padding: 8px;
}
input[type="password"], textarea {
  display: block;
  width: 100%;
  padding: 8px;
}
#checkboxes {
  margin-top: 20px;
}
#checkboxes input {
  display: inline-block;
  margin-right: 10px;
}
#checkboxes label {
  display: inline-block;
  margin-top: 0px;
  margin-right: 10px;
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
h3{
  display: block;
  margin-top: 50px;
  margin-bottom: 100px;
  color: #fc8;
}

</style>