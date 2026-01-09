<template>
  <v-container class="fill-height d-flex justify-center align-center">
    <v-card class="pa-8 text-center" elevation="4">
      <v-icon icon="mdi-flask" size="64" color="primary" class="mb-4"></v-icon>
      <h1 class="text-h4 font-weight-bold mb-2">Test Page</h1>
      <p class="text-body-1 text-medium-emphasis mb-6">
        This is a test route to verify the router configuration.
      </p>
      <v-btn color="primary" to="/" size="large" prepend-icon="mdi-home">
        Go Back Home
      </v-btn>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'TestView'
}
</script>