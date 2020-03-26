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
      auctions: [],
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
      fetch('/api/v1/auctions').then((data) => data.json()).then((json) => {
        console.table(json);
        this.auctions = this.auctions.concat(json);
      });
    },
  },
};
</script>
