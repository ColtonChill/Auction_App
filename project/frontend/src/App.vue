<template>
  <div id="app">
    <ul class="flex bg-darkBlue h-10">
      <li class="mx-6 mt-2 flex-grow-0">
        <router-link to="/" class="text-white hover:text-blue-400">Home</router-link>
      </li>
        <li class="flex-grow-1">
      </li>
      <li class="mx-6 mt-2 flex-grow-0">
        <router-link to="/login" class="text-white hover:text-blue-400">Profile </router-link>
      </li>
    </ul>
    <!-- <router-link to="/register">Register    </router-link>
    <router-link to="/login">Login</router-link> -->
    <router-view></router-view>
  </div>
</template>

<script lang="ts">

export default {
  name: 'App',
};
</script>

<style src="./assets/tailwind.css"></style>
<style src="../public/main.css"></style>
