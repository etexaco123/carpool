<template>
  <header>
    <h1 @click="changeTitle"> {{ title }} </h1>
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
  padding: 1px 20px;
}
h1{
  color: #222;
  text-align: center;
  font-weight: bold;
}

</style>