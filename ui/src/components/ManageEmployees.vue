<template>
<div>

  <div id="dropDownSelection">
    <dropdown v-bind:options="arrayOfObjects" :selected="object" v-on:updateoption="methodToRunOnSelect"></dropdown>
  </div>

  <div id="addEmployeeInfo" v-if="object.name=='Employee'">
    <form>
      <label> Employee ID </label>
      <input type="text" v-model.lazy="employee.employee_id" required />
      <br>
      <label> First Name </label>
      <input type="text" v-model.lazy="employee.first_name" required />
      <br>
      <label> Last Name </label>
      <input type="text" v-model.lazy="employee.last_name" required />
      <br>
      <label> Address </label>
      <input type="text" v-model.lazy="employee.address" required />
      <br>
      <label> Job Title </label>
      <input type="text" v-model.lazy="employee.job_title" required />
      <br>
      <label> Age </label>
      <input type="text" v-model.lazy="employee.age" required />
      <br>
      <label> Driver License </label>
      <input type="text" v-model.lazy="employee.driver_license" required />
      <br>

      <button> Add {{ object.name }} </button>
    </form>
  </div>

  <div id="addDriverInfo" v-if="object.name=='Driver'">
    <form>
      <span><label> Employee ID </label></span>
      <input type="text" v-model.lazy="driver.employee_id" required />
      <br>
      <span><label> First Name </label></span>
      <input type="text" v-model.lazy="driver.first_name" required />
      <br>
      <span><label> Last Name </label></span>
      <input type="text" v-model.lazy="driver.last_name" required />
      <br>
      <span><label> Car Model </label></span>
      <input type="text" v-model.lazy="driver.car_model" required />
      <br>
      <span><label> Car Image ID </label></span>
      <input type="text" v-model.lazy="driver.car_image_id" required />
      <br>

      <button> Add {{ object.name }} </button>
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
      employee: {
        employee_id: "",
        first_name: "",
        last_name: "",
        address: "",
        job_title: "",
        age: "",
        driver_license: ""
      },
      driver: {
        employee_id: "",
        first_name: "",
        last_name: "",
        car_model: "",
        car_image_id: ""
      },

      serverResponse: "",
      showServerResponse: false,

      // Props for the Dropdown component
      arrayOfObjects: [
        {name: "Employee"},
        {name: "Driver"}
      ],
      object: {
        name: 'Select Type'
      }
    }
  },
  components: {
    "dropdown": dropdown
  },
  methods: {
    postEmployees: function() {
      const data = `{}`;
      this.postData("employees", data)
    },
    postDrivers: function() {
      const data = `{}`;
      this.postData("drivers", data)
    },
    postData: function(type, data) {
      const server_host = process.env.VUE_APP_SERVER_HOST || '127.0.0.1';
      const server_port = process.env.VUE_APP_SERVER_PORT || '5050';
      const server_url = `http://${server_host}:${server_port}/${type}`

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
        })
    },
    methodToRunOnSelect(payload) {
      this.object = payload;
    }
  }
}
</script>

<style scoped>
#dropDownSelection {
  margin-top: 0px;
  margin-bottom: 0px;
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
input[type="text"], textarea {
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