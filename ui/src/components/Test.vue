<template>
<div>

  <div id="test">
    <form>
      <label> URL: </label>
      <input type="text" v-model.lazy="url" placeholder="http://localhost:5050/test" required />
    </form>
  </div>

  <div>
    <button @click.prevent="testServer"> Test </button>
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
      url: "",
      serverResponse: "",
      showServerResponse: false
    }
  },
  methods: {
    testServer: function() {
      axios.get(this.url)
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
          // Send the response to the parent App.vue
          this.$emit('showresult', this.serverResponse)
          this.showServerResponse = true
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
  max-width: 400px;
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