<template> 
<div>

  <div>
    <app-header v-bind:title="title" @changetitleheader="updateTitle($event)"></app-header>
    <h2 id="subtitle" @click="changeSubtitle"> {{ subtitle }} </h2>
  </div>
  
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/test">Test</router-link> |
    <router-link to="/register">Register</router-link> |
    <router-link to="/login">Login</router-link> |
    <router-link to="/chat">Chat</router-link> |
    <router-link to="/logout">Logout</router-link>
  </div>

  <router-view v-slot="{ Component }" @showresult="showResponse($event)">
    <component :is="Component" />
  </router-view>

  <div id="serverResponse" v-if="isResponseShowable">
    <p> SERVER RESPONSE: {{ response }} </p>
  </div>

  <div>
    <app-footer v-bind:title="title"> </app-footer>
  </div>

</div>
</template>


<script>
import Header from './components/Header.vue'
import Home from './components/Home.vue'
import Test from './components/Test.vue'
import Register from './components/Register.vue'
import Login from './components/Login.vue'
import Logout from './components/Logout.vue'
import Chat from './components/Chat.vue'
import Footer from './components/Footer.vue'

export default {
  components: {
    'app-header': Header,
    'app-home': Home,
    'app-test': Test,
    'app-register': Register,
    'app-login': Login,
    'app-logout': Logout,
    'app-chat': Chat,
    'app-footer': Footer
  },
  data() {
    return {
      title: 'Corporate Carpooling as a Service',
      title_orig: 'Corporate Carpooling as a Service',
      subtitle: 'RUG project',
      subtitle_rug: 'RUG project',
      subtitle_wacc: 'WaCC project',
      toggle: true,
      toggle2: false,
      response: "",
      isResponseShowable: false
    }
  },
  methods: {
    updateTitle: function(updatedTitle) {
      if (this.toggle)
        this.title = this.title_orig + ' ' + updatedTitle
      else
        this.title = this.title_orig

      this.toggle = !this.toggle
    },
    changeSubtitle: function() {
      if (this.toggle2)
        this.subtitle = this.subtitle_rug
      else
        this.subtitle = this.subtitle_wacc

      this.toggle2 = !this.toggle2
    },
    showResponse: function(result) {
      this.response = result
      console.log(`RECEIVED RESULT: ${result}`)

      //// Don't show it just yet at the parent level
      //if (this.response) {
      //  this.isResponseShowable = true
      //}
    }
  }
}
</script>

<style>
body {
    display: -ms-flexbox;
    display: -webkit-box;
    display: flex;
    -ms-flex-align: center;
    -ms-flex-pack: center;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    padding-top: 10px;
    padding-bottom: 10px;
    background: #43C6AC;  /* fallback for old browsers */
    background: -webkit-linear-gradient(to left, #035BA8, #43C6AC);  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to left, #035BA8, #43C6AC); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;
  margin-bottom: 10px;
}

h1 {
  color: red;
}

#subtitle {
  color: #b85;
  margin: 20px;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42e983;
}

</style>
