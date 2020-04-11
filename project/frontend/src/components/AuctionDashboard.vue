<template>
    <div class="mx-auto shadow-lg rounded
    object-center my-2 md:items-center">
        <h1 class="font-title text-4xl text-semibold
        text-center pt-4 text-darkBlue">Auction Dashboard</h1>
        <h2 class="text-xl text-semibold text-center
        pt-6 pb-6 text-midBlue">{{this.$route.params.auctionUrl}}</h2>
        <div class="md:items-center align-content:center">
            <router-link to="/auctions/{{this.$route.params.auctionUrl}}/addItem"
            tag="button" class="bg-blue-400 text-white folnt-bold
            rounded px-4 py-2 mb-4 items-center mx-auto center"
            >Add Item</router-link>
        </div>
    </div>
</template>
<script>
export default {
  name: 'AuctionDashboard',
  methods: {
  },
};
</script>

<style src="@/assets/tailwind.css"></style>
