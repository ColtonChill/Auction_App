<template>
    <router-link v-if="this.item && this.auction" :to="{ name: 'ItemPage',
        params: { itemId: this.item.id, auctionUrl: this.auction.url }}">
        <div class="flex shadow-lg w-64 mx-auto p-4 mb-8 rounded-lg">
            <div class="bidder flex-1 inline">
                {{ this.item.name }}
            </div>
            <div class="amount text-gray-900 font-bold text-1 mb-1 flex-1 inline text-right">
                {{ this.money }}$
            </div>
        </div>
    </router-link>
</template>

<script>
export default {
  name: 'BidItem',
  props: {
    id: Number,
  },
  data() {
    return {
      user: undefined,
      money: undefined,
      auction: undefined,
      item: undefined,
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      fetch(`/api/v1/bids/${this.id}`).then((res) => res.json())
        .then((json) => {
          this.user = json.user;
          this.money = json.money;
          this.auction = json.auction;
          this.item = json.item;
        });
    },
  },
};
</script>
