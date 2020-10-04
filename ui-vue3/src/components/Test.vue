<template>
  <div id="test">
    <form>
      <label> URL: </label>
      <input type="text" v-model.lazy="url" placeholder="http://localhost:5050/test" required />
    </form>
  </div>

  <button v-on:click.prevent="testServer">
    Test
  </button>

  <div>
    <p> Result: </p>
    <p> {{ testResponse }} </p>
  </div>
  
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      url: "",
      testResponse: ""
    }
  },
  methods: {
    testServer: function() {
      axios.get(this.url)
        .then(response => {
          this.testResponse = response.data
        })
        .catch(error => {
          this.testResponse = error.response.data
          console.log(`ERROR: ${error.response.data}`)

          // TODO: Emit response back to parent App and show it on the screen.
        })
    }
  }
}
</script>

<style scoped>
#test * {
  box-sizing: border-box;
}
#test {
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
  margin-bottom: 20px;
  padding: 10px;
}

</style>