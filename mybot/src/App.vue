
<template>
<div id="app">
  <Title :titulo="'TibBot Encripto monedas!'" />
  <nav class="navbar navbar-light bg-light">
  <span class="navbar-brand mb-0 h1">XYZ Encriptomendas</span>
  </nav>

    <table class="table" v-if="datos.length > 0">
      <thead>
        <tr>
          <th scope="col">Id</th>
          <th scope="col">Titulo</th>
          <th scope="col">Contenido</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(dato, index) in datos" :key="index">
          <td>{{ dato.id }}</td>
          <td>{{ dato.title }}</td>
          <td>{{ dato.body }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Si no se cumple la condición, mostramos un texto indicando que no hay registros. -->
    <div v-else>
      <p>No hay datos disponibles para mostrar.</p>
    </div>

  </div>
</template>

<script>

import axios from 'axios'

export default {
  name: "App",

  components: {
  },

  data() {
    return {
      //mostrar: false,
      //edad: 0,
      datos: [],
    };
  },

  created() {
    console.log("En la creación del componente!");
  },

  mounted() {
    console.log(this.datos);
    this.getData();
  },

  //  Vue devtools
  methods: {
    getData() {
      const url = "https://app-tibbot.herokuapp.com/usuarios";

      axios
        .get(url)
        .then((res) => {
          this.datos = res.data;
          console.log(res.data);
        })
        .catch((error) => console.log(error));
    },
  },
};
</script>

<style>
</style>