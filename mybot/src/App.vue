<template>
<div id="app">
  <nav class="navbar navbar-light bg-light">
  <span class="navbar-brand mb-0 h1">XYZ encriptomendas</span>
</nav>
  <table class="table" v-if="usuarios.length>0">
  <thead>
    <tr>
      <th scope="col">Id</th>
      <th scope="col">Title</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(user,index) in usuarios" :key="index">
      <td>{{user.id}}</td>
      <td>{{user.nombre}}</td>
      <td>{{user.ciudad}}</td>
      <td>{{user.mail}}</td>
    </tr>
  </tbody>
</table>
<div v-else>
  <p>No hay elementos</p>
</div>

</div>
</template>

<script>
export default {
  name: 'App',
  components: {},
  data() {
    return {
      filtro: 0,
      usuarios: []
    }
  },
  created(){
    console.log()
  },
  mounted(){
    this.getData()
  },

  methods:{
    getData(){
      const url = "https://6d4724972caa.ngrok.io/usuarios"
      this.axios.get(url).then(res => this.usuarios = res.personas).catch(error => console.log(error))
    }
  }
}
</script>

<style>
</style>