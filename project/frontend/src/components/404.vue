<template>
  <div id="404">
    <p>
      <!-- <router-link to="/register">Go to RegisterPage</router-link>
      <router-link to="/login">Go to Login!</router-link> -->
    </p>
    <h1 class="font-title text-4xl text-semibold text-center pt-4 text-darkBlue">
      404</h1>
    <h2 class="text-xl text-semibold text-center pt-6 pb-6 text-midBlue">
      We can't find what you're looking for.</h2>
    <router-link to="/">Go back home</router-link>
    <a @click="$router.go(-2)">Or go back</a>
  </div>
</template>


<script lang="ts">

export default {
  name: 'NotFound',
};

</script>

<style src="@/assets/tailwind.css"></style>
<style src="../../public/main.css"></style>
