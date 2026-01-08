<template>
 <v-container class="fill-height d-flex justify-center align-center">
  <GitContributions />
 </v-container>
</template>

<script>
import GitContributions from '../components/GitContributions.vue';
export default {
 name: 'TestView',
 components: {
  GitContributions
 }
}
</script>
