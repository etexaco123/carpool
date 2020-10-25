<template>
<div>

  <div id="dropDownTypeSelection">
    <dropdown v-bind:options="registrationTypes" :selected="registrationType" @updateoption="selectRegistrationType"></dropdown>
  </div>

  <div id="addDriverInfo" v-if="registrationType.name=='Driver'">
    <form>
      <span><label> Employee ID </label></span>
      <input type="text" :disabled=isInputDisabled v-model.lazy="driver.employee_id" required />
      <br>
      <span><label> First Name </label></span>
      <input type="text" :disabled=isInputDisabled v-model.lazy="driver.first_name" required />
      <br>
      <span><label> Last Name </label></span>
      <input type="text" :disabled=isInputDisabled v-model.lazy="driver.last_name" required />
      <br>
      <span><label> Car Make </label></span>
      <input type="text" :disabled=isInputDisabled v-model.lazy="driver.car_make" required />
      <br>
      <span><label> Car Image ID </label></span>
      <input type="text" :disabled=isInputDisabled v-model.lazy="driver.car_image_id" required />
      <br>

      <button :disabled=isInputDisabled @click.prevent="postDriver"> Add {{ registrationType.name }} </button>
    </form>
  </div>
  
  <div id="addEmployeeInfo" v-if="registrationType.name=='Employee'">
    <form>
      <label> Employee ID </label>
      <input type="text" :disabled=isInputDisabled v-model.lazy="employee.employee_id" required />
      <br>
      <label> First Name </label>
      <input type="text" :disabled=isInputDisabled v-model.lazy="employee.first_name" required />
      <br>
      <label> Last Name </label>
      <input type="text" :disabled=isInputDisabled v-model.lazy="employee.last_name" required />
      <br>
      <label> Address </label>
      <input type="text" :disabled=isInputDisabled v-model.lazy="employee.address" required />
      <br>
      <label> Job Title </label>
      <input type="text" :disabled=isInputDisabled v-model.lazy="employee.job_title" required />
      <br>
      <label> E-mail </label>
      <input type="text" :disabled=isInputDisabled v-model.lazy="employee.email" required />
      <br>
      <label> Age </label>
      <input type="text" :disabled=isInputDisabled v-model.lazy="employee.age" required />
      <br>
      <label> Driver License </label>
      <input type="text" :disabled=isInputDisabled v-model.lazy="employee.is_driver" required />
      <br>

      <button :disabled=isInputDisabled @click.prevent="postEmployee"> Add {{ registrationType.name }} </button>
    </form>
  </div>
  
  <div id="addEmployeeInfo" v-if="registrationType.name=='User'">
    <form>
      <label> Employee ID </label>
      <input type="text" :disabled=isInputDisabled v-model.lazy="user.employee_id" required />
      <br>
      <label> Password </label>
      <input type="password" :disabled=isInputDisabled v-model.lazy="user.password" required />
      <br>
      <label id="roleLabel"> Role </label>
      <dropdown id="dropDownRoleSelection" v-bind:options="roles" :selected="role" @updateoption="selectRole"></dropdown>
      <br>

      <button :disabled=isInputDisabled @click.prevent="postUser"> Add {{ registrationType.name }} </button>
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
import dropdown from './Dropdown.vue'

export default {
  data() {
    return {
      // Data structures
      driver: {
        employee_id: "",
        first_name: "",
        last_name: "",
        car_make: "",
        car_image_id: ""
      },
      employee: {
        employee_id: "",
        first_name: "",
        last_name: "",
        address: "",
        job_title: "",
        email: "",
        age: "",
        is_driver: ""
      },
      user: {
        employee_id: "",
        password: "",
        role: ""
      },

      serverResponse: "",
      showServerResponse: false,
      isInputDisabled: false,

      // Props for the Dropdown component
      registrationTypes: [
        {name: "Driver"},
        {name: "Employee"},
        {name: "User"}
      ],
      registrationType: {
        name: "Select Registration Type"
      },
      roles: [
        {name: "Normal"},
        {name: "Admin"}
      ],
      role: {
        name: "Select Role"
      }
    }
  },
  components: {
    "dropdown": dropdown
  },
  methods: {
    postDriver: function() {
      this.postData("drivers", this.driver)
    },
    postEmployee: function() {
      this.postData("employees", this.employee)
    },
    postUser: function() {
      this.postData("users", this.user)
    },
    postData: function(type, data) {
      const server_host = process.env.VUE_APP_SERVER_HOST || '127.0.0.1';
      const server_port = process.env.VUE_APP_SERVER_PORT || '5050';
      const server_url = `http://${server_host}:${server_port}/${type}`

      // Temporarily disable the input fields
      this.isInputDisabled = true;

      axios.post(server_url, data)
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

          // clear the input fields
          this.clearData()

          // Temporarily disable the input fields
          this.isInputDisabled = false;
        })
    },
    selectRegistrationType(payload) {
      this.registrationType = payload;
    },
    selectRole(payload) {
      this.role = payload;
      this.user.role = payload.name;
    },
    clearData() {
      this.driver = {
        employee_id: "",
        first_name: "",
        last_name: "",
        car_make: "",
        car_image_id: ""
      }
      this.employee = {
        employee_id: "",
        first_name: "",
        last_name: "",
        address: "",
        job_title: "",
        email: "",
        age: "",
        is_driver: ""
      }
      this.user = {
        employee_id: "",
        password: "",
        role: ""
      }
    }
  }
}
</script>

<style scoped>
#dropDownTypeSelection {
  margin-top: 0px;
  margin-bottom: 20px;
}
#dropDownRoleSelection {
  margin-top: 0px;
  margin-bottom: 20px;
  margin-right:10px;
}
#addEmployeeInfo * {
  box-sizing: border-box;
}
#addEmployeeInfo {
  margin: 20px auto;
  max-width: 500px;
}
#addDriverInfo * {
  box-sizing: border-box;
}
#addDriverInfo {
  margin: 20px auto;
  max-width: 500px;
}
label {
  display: inline-block;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-right: 20px;
  font-weight: bold;
  max-width: 150px;
  width: 150px;
}
#roleLabel {
  margin-right: 40px;
}
input[type="text"], textarea {
  display: inline-block;
  width: 50%;
  padding: 8px;
}
input[type="password"], textarea {
  display: inline-block;
  width: 50%;
  padding: 8px;
}
button {
  margin-top: 30px;
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
form {
  margin-bottom: 20px;
}

</style>