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
</div>
</template>

<script>
import AuctionItem from './AuctionItem.vue';

export default {
  name: 'AuctionList',
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
