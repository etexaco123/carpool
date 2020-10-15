<template>
<div>

  <div id="login" v-if="!isLoggedIn">
    <form>
      <label> Employee ID: </label>
      <input type="text" v-model.lazy="employee_id" required />
      <label> Password: </label>
      <input type="password" v-model.lazy="password" required />
      <div id="checkboxes">
        <label> Stay logged in </label>
        <input type="checkbox" value="true" v-model="stayloggedin" />
      </div>
      <button @click.prevent="postLogin"> Log in </button>
    </form>
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
  props:{
    isLoggedIn: {
      type:Boolean
    },
    role: {
      type:String
    },
    adminMode: {
      type:Boolean
    }
  },
  data() {
    return {
      employee_id: "",
      password: "",
      serverResponse: "",
      showServerResponse: false,
      stayloggedin: false
    }
  },
  methods: {
    postLogin: function() {
      const server_host = process.env.VUE_APP_SERVER_HOST || '127.0.0.1';
      const server_port = process.env.VUE_APP_SERVER_PORT || '5050';
      const server_url = `http://${server_host}:${server_port}/login`

      axios.post(server_url, {
        employee_id: this.employee_id,
        password: this.password        
      })
        .then(response => {
          this.serverResponse = response.data
          if (!this.serverResponse.error) {
            this.$emit('dologin', true)  
            if (this.serverResponse.data.role === "Admin") {
                this.$emit('admin', true)
            }
          }
        })
        .catch(error => {
          if (!error.response) {
            this.serverResponse = error.message
          } else {
            this.serverResponse = error.response.data
          }
        })
        .finally(() => {          
          this.showServerResponse = true;     
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