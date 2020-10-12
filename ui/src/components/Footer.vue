<template>
  <footer>
    <p> Copyright &copy; 2020, {{ title }} </p>
  </footer>
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
  }
}
</script>

<style scoped>
footer{
  background: #222;
  padding: 10px 20px;
}
p{
  color: lightgreen;
  text-align: center;
  font-weight: bold;
}

</style>