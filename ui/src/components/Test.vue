<template>
<div>

  <div id="test">
    <form>
      <label> URL: </label>
      <input type="text" :disabled=isInputDisabled v-model.lazy="url" placeholder="http://localhost:5050/test" required />
      <button :disabled=isInputDisabled @click.prevent="testServer"> Test </button>
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
      default_url: "http://localhost:5050/test",
      url: "",
      serverResponse: "",
      showServerResponse: false,
      isInputDisabled: false
    }
  },
  methods: {
    testServer: function() {
      if (!this.url) {
        console.log(`Empty URL, using default: ${this.default_url}`)
        this.url = this.default_url
      }

      // Temporarily disable the input fields
      this.isInputDisabled = true;
      this.serverResponse = ""

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
          this.showServerResponse = true

          // re-enable the input fields
          this.isInputDisabled = false;
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