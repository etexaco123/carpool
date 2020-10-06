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
export default {
  data() {
    return {
      username: "",
      password: "",
      stayloggedin: false
    }
  },
  methods: {
    postLogin: function() {
      //this.$http.post('http://0.0.0.0/login')
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