<template>
  <div id="search">
      <form>
      <label> Starting point: </label>
      <input type="text" v-model.lazy="point1" required placeholder="From.." />
      <label> Destination: </label>
      <input type="text" v-model.lazy="point2" required placeholder="Towards.."/>
      <button @click.prevent="postSearch"> Search route </button>
    </form>

    <iframe width="425" height="350" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://www.openstreetmap.org/export/embed.html?bbox=-17.709960937500004%2C46.42271253466719%2C18.984375000000004%2C57.868131763328826&amp;layer=mapnik" style="border: 1px solid black"></iframe><br/><small><a href="https://www.openstreetmap.org/#map=6/52.516/0.637">View Larger Map</a></small>
    <p>© 2020 - Group6 WaCC</p>
  </div>
    
</template>

<script>
export default {
    data(){
      return {
        point1:"",
        point2:""
      }
    }
}
</script>

<style scoped>
  #search * {
    box-sizing: border-box;
  }
  #search {
    margin: 20px auto;
    max-width: 500px;
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
  input[type="password"], textarea {
  display: block;
  width: 100%;
  padding: 8px;
  }
  button {
    margin-top: 20px;
    margin-bottom: 20px;
    padding: 10px;
  }
 
</style>