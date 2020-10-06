<template> 
<div>

  <div>
    <app-header v-bind:title="title" v-on:changetitleheader="updateTitle($event)"></app-header>
    <h2 v-on:click="changeSubtitle"> {{ subtitle }} </h2>
  </div>

  <div>
    <app-navbar></app-navbar>
  </div>
  
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/test">Test</router-link> | 
    <router-link to="/register">Register</router-link> | 
    <router-link to="/login">Login</router-link>
  </div>

  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>


  <div>    
    <button v-on:click="buttonsSelector = 'app-home'"> Home </button>
    <button v-on:click="buttonsSelector = 'app-test'"> Test server! </button>
    <button v-on:click="buttonsSelector = 'app-register'"> Register </button>
    <button v-on:click="buttonsSelector = 'app-login'"> Login </button>
    
    <keep-alive>
      <component v-bind:is="buttonsSelector"> </component>
    </keep-alive>

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
import Footer from './components/Footer.vue'
import Navbar from './components/Navbar.vue'

export default {
  components: {
    'app-header': Header,
    'app-home': Home,
    'app-test': Test,
    'app-register': Register,
    'app-login': Login,
    'app-footer': Footer,
    'app-navbar': Navbar
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

      // buttons selector
      buttonsSelector: 'app-home'
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
    padding-top: 40px;
    padding-bottom: 40px;
    /* background-color: #f5f5f5;  */
    background: #43C6AC;  /* fallback for old browsers */
    background: -webkit-linear-gradient(to left, #191654, #43C6AC);  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to left, #191654, #43C6AC); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1 {
  color: red;
}

button {
  margin-top: 10px;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
