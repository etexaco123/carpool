<template>
<div>
    <h2>Logging out...</h2>
</div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      url: "http://localhost:5050/logout"
    }
  },
  methods: {
    logoutfromServer: function() {      
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
        })
    }
  },
  mounted: function(){
    // Run the log out function as soon as the component is mounted
    // (After the logout event)
    this.logoutfromServer();
    setTimeout(() => {
        this.$router.push({name: 'Home'});
    },3000);    
  }
}
</script>

<style scoped>
#logout * {
  box-sizing: border-box;
}
#logout {
  margin: 20px auto;
  max-width: 500px;
}
h2 {
  display: block;
  margin-top: 10px;
  margin-bottom: 100px;
  color: #b85;
}

</style>