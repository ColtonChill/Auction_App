<template>
  <div>

  <h2 class="pl-8">My Auctions</h2>
    <AuctionItem
        v-for="auction in auctions"
        :key="auction.id"
        :id="auction.id"
        :auction="auction" />

        <!-- I thought this object-center would center it... but no....  -->
        <div class="flex col">
          <button class="mx-auto text-md object-center mb-6">Load More...</button>
        </div>

<!-- signUp/login form...  -->
<div class="flex col">
<div class="max-w-md w-full rounded overflow-hidden shadow-lg my-2 object-center mx-auto">
<form class="w-full max-w-sm">
  <div class="md:flex md:items-center mb-6 mt-4">
    <div class="md:w-1/3">
      <label class="block text-gray-500 font-bold
      md:text-right mb-1 md:mb-0 pr-4" for="inline-email">
        Email
      </label>
    </div>
    <div class="md:w-2/3">
      <input class="bg-gray-200 appearance-none border-2
      border-gray-200 rounded w-full py-2 px-4 text-gray-700
      leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
      id="inline-email" type="text" value="Jane Doe">
    </div>
  </div>
  <div class="md:flex md:items-center mb-6">
    <div class="md:w-1/3">
      <label class="block text-gray-500 font-bold md:text-right
      mb-1 md:mb-0 pr-4" for="inline-username">
        Password
      </label>
    </div>
    <div class="md:w-2/3">
      <input class="bg-gray-200 appearance-none border-2 border-gray-200
      rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none
      focus:bg-white focus:border-purple-500" id="inline-username"
      type="password" placeholder="******************">
    </div>
  </div>
  <div class="md:flex md:items-center">
    <div class="md:w-1/3"></div>
    <div class="md:w-2/3">
      <button class="center shadow bg-blue-400 hover:bg-blue-600
      focus:shadow-outline focus:outline-none text-white font-bold
      py-2 px-4 rounded mb-4" type="button">
        Sign Up
      </button>
    </div>
  </div>
</form>
</div>
</div>

</div>
</template>

<script>
import AuctionItem from './AuctionItem.vue';

export default {
  data() {
    return {
      isLoading: false,
      auctions: [
        {
          name: 'auction1',
          description: 'cool',
          id: 1,
          location: 'Logan',
        },
        {
          name: 'auction2',
          description: 'cooler',
          id: 2,
          location: 'Florida',
        },
        {
          name: 'auction3',
          description: 'coolest',
          id: 3,
          location: 'New York',
        },
        {
          name: 'auction4',
          description: 'lame',
          id: 4,
          location: 'Hawaii',
        },
      ],
      more: true,
      page: 1,
    };
  },
  components: {
    AuctionItem,
  },
  mounted() {
    this.getAuctions();
  },
  methods: {
    getAuctions() {
      if (!this.more) {
        return;
      }
      if (this.isLoading) {
        return;
      }
      this.isLoading = true;
      // return this.auctions;
    },
  },
};
</script>
