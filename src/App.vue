<template>
  <main>
    <NodoObject />
    <Loading />
    <Analyzer />
  </main>
</template>

<script>
import NodoObject from './components/NodoObject.vue';
import Loading from './components/Loading.vue';
import Analyzer from './components/Analyzer.vue';
export default {
  name: 'App',
  components: {
    NodoObject,
    Loading,
    Analyzer
  }
};
</script>

<style>
  :root{
    --header-color: #302f238e;
    --header2-color: #302c238e;
    --bg-color: #070a0c;
    --header-height: 60px;
  }

  body, html {
    width:100vw;
    height:100vh;
    margin:0;
  }

  main{
    width: 100vw;
    height: 100vh;
    background-color: var(--bg-color);
    overflow: hidden !important;
    font-family: 'COD', sans-serif;
  }

  @font-face {
    font-family: "COD";
    src: url("./assets/fonts/Conduit ITC Regular.otf") format("truetype");
  }
</style>