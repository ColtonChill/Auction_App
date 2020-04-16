<template>
    <div class="mx-auto
    object-center my-2 md:items-center">
        <h1 class="text-4xl text-semibold
        text-center pt-4 text-darkBlue">Admin Dashboard</h1>
        <p class="text-center text-md text-darkBlue">for</p>
        <h2 class="text-xl text-semibold text-center
        pt-2 pb-4 text-blue-500">{{this.$route.params.auctionUrl}}</h2>
        <div class="md:flex md:items-center align-content:center">
            <button v-on:click="toEdit()"
            tag="button" class="mx-4 bg-blue-400 text-white font-bold
            rounded px-4 py-2 mb-4 items-center mx-auto center md:items-center align-content:center"
            >Edit auction details</button>
            <button v-on:click="toItem()"
            tag="button" class="mx-4 bg-blue-400 text-white font-bold
            rounded px-4 py-2 mb-4 items-center mx-auto center md:items-center align-content:center"
            >Add Item</button>
        </div>
        <hr>
        <div class="mx-auto">
        <p class="text-lg text-darkBlue underline"> Commitments by user: </p>
      <BidderCommitment class="mt-2 mb-6" v-bind:auctionUrl=this.$route.params.auctionUrl />
      </div>
        <div class="mx-auto">
        <p class="text-lg text-darkBlue underline"> Winners by item: </p>
      <ItemWinnerList class="mt-2 mb-6" v-bind:auctionUrl=this.$route.params.auctionUrl />
      </div>
    </div>
</template>
<script>
import BidderCommitment from './BidderCommitment.vue';
import ItemWinnerList from './ItemWinner.vue';

export default {
  name: 'AuctionDashboard',
  components: {
    BidderCommitment,
    ItemWinnerList,
  },
  methods: {
    toItem() {
      this.$router.push({ name: 'AddItem' });
    },
    toEdit() {
      this.$router.push({ name: 'AdminPage' });
    },
  },
};
</script>
<!--Is there a reason I can't dynamic route inside of html?
Is there a way to use vue to get to that page withour this?
Why is it adding the weird digit!?!?!?!?-->
<style src="@/assets/tailwind.css"></style>
