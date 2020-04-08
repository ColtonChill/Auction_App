<template>
      <div id="auction">
    <h1 class="font-title text-4xl text-semibold text-center pt-4 text-darkBlue">
      {{ $route.params.auctionUrl }}</h1>
    <h2 class="text-xl text-semibold text-center pt-6 pb-6 text-midBlue">
      Select items from below to see details:</h2>
    <ItemList v-bind:auctionIBelongTo=$route.params.auctionUrl />
  </div>
</template>

<script lang="ts">

import ItemList from './ItemList.vue';

export default {
  name: 'AuctionPage',
  components: {
    ItemList,
  },
};

</script>

<style src="@/assets/tailwind.css"></style>
<style src="../../public/main.css"></style>
