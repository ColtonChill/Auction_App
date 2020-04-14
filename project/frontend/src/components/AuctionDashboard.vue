<template>
    <div class="mx-auto shadow-lg rounded
    object-center my-2 md:items-center">
        <h1 class="font-title text-4xl text-semibold
        text-center pt-4 text-darkBlue">Auction Dashboard</h1>
        <h2 class="text-xl text-semibold text-center
        pt-6 pb-6 text-midBlue">{{this.$route.params.auctionUrl}}</h2>
        <div class="md:flex md:items-center align-content:center">
            <button v-on:click="toItem()"
            tag="button" class="bg-blue-400 text-white font-bold
            rounded px-4 py-2 mb-4 items-center mx-auto center md:items-center align-content:center"
            >Add Item</button>
        </div>
    </div>
</template>
<script>
export default {
  name: 'AuctionDashboard',
  methods: {
    toItem() {
      this.$router.push({ name: 'AddItem' });
    },
  },
};
</script>
<!--Is there a reason I can't dynamic route inside of html?
Is there a way to use vue to get to that page withour this?
Why is it adding the weird digit!?!?!?!?-->
<style src="@/assets/tailwind.css"></style>
