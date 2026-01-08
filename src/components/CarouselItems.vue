<template>
 <v-carousel>
  <v-carousel-item v-for="n in 10" :key="n" src="https://cdn.vuetifyjs.com/images/cards/docks.jpg" cover>
   {{ n }}
  </v-carousel-item>
 </v-carousel>
</template>

<script>
export default {
 name: 'CarouselItems'
}
</script>

<style scoped></style>
