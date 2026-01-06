<template>
  <main>
    <!-- <NodoObject /> -->
    <Analyzer />
  </main>
</template>

<script>
// import NodoObject from './components/NodoObject.vue';
import Analyzer from './components/Analyzer.vue';
export default {
  name: 'App',
  components: {
    // NodoObject,
    Analyzer
  }
};
</script>

<style>
:root {
  --bg-color: #070a0c;
}

body,
html {
  width: 100vw;
  height: 100vh;
  margin: 0;
}

main {
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