<template>
<div id="home">

  <h1 v-bind:style="{marginBottom: welcomeMarginBottom + 'px'}"> {{ showLoginMessage() }} </h1>
  <h3 v-if="id"> ID: {{ id }} </h3>

</div>
</template>

<script>

export default {
  props: {
    isLoggedIn: Boolean,
    userData: Object
  },
  data() {
    return {
      id: "",
      welcomeMarginBottom: 100
    }
  },
  methods: {
    showLoginMessage: function() {
      var message = "Welcome"
      if (this.isLoggedIn && this.userData) {
        if(this.userData.first_name) {
          message += ", " + this.userData.first_name
          if(this.userData.employee_id) {
            this.id = this.userData.employee_id
            this.welcomeMarginBottom = 0
          }
        }
      }
      message += "!"
      return message
    }
  }
}
</script>

<style scoped>
h1 {
  color: #b85;
  margin-top: 50px;
}
h3 {
  color: #b85;
  margin-top: 20px;
  margin-bottom: 100px;
}

</style>