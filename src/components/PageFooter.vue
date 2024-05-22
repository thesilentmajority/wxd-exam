<template>
  <v-footer color="primary" app inset>
    <v-container>
      <v-row justify="center">
        <v-col class="text-center white--text">
          © 2024 
          <a href="https://github.com/thesilentmajority/wxd-exam" target="_blank" class="white--text text-decoration-none">
            Github Repository
          </a>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
export default {
  name: 'PageFooter'
};
</script>

<style scoped>
.text-center {
  text-align: center;
}
.text-decoration-none {
  text-decoration: none;
}
</style>
