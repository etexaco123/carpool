<template> 
  <div>
    <app-header v-bind:title="title" v-on:changetitleheader="updateTitle($event)"></app-header>
    <h2 v-on:click="changeSubtitle"> {{ subtitle }} </h2>
  </div>  

  <div>    
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

</template>


<script>
import Header from './components/Header.vue'
import Test from './components/Test.vue'
import Register from './components/Register.vue'
import Login from './components/Login.vue'
import Footer from './components/Footer.vue'

export default {
  components: {
    'app-header': Header,
    'app-test': Test,
    'app-register': Register,
    'app-login': Login,
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

      // buttons selector
      buttonsSelector: 'app-test'
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
</style>
