<template>
      <div id="landing">
    <p>
      <!-- <router-link to="/register">Go to RegisterPage</router-link>
      <!-- <router-link to="/ItemWinner">Go to ItemWinner</router-link>
      <router-link to="/login">Go to Login!</router-link> -->
    </p>
    <h1 class="font-title text-4xl text-semibold text-center pt-4 text-darkBlue">
      Welcome to Awection!</h1>
    <h2 class="text-xl text-semibold text-center pt-6 pb-6 text-midBlue">
      Select an auction from below:</h2>

    <AuctionList/>
  </div>
</template>


<script lang="ts">
import AuctionList from './AuctionList.vue';

export default {
  name: 'LandingPage',
  components: {
    AuctionList,
  },
};

// export default class LandingPage extends Vue {}

</script>

<style src="@/assets/tailwind.css"></style>
<style src="../../public/main.css"></style>
