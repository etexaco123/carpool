<template>
  <header>
    <h1 v-on:click="changeTitle"> {{ title }} </h1>
  </header>
</template>

<script>
export default {
  props: {
    title: {
      type: String
    }
  },
  data() {
    return {
    }
  },
  methods: {
    changeTitle: function() {
      this.$emit('changetitleheader', 'v2.0')
    }
  }
}
</script>

<style scoped>
header{
  background: lightgreen;
  padding: 6px 20px;
}
h1{
  color: #222;
  text-align: center;
}

</style>