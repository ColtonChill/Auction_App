<template>
    <div v-if="bids" id="bid-list" class="mt-8">
        <h2 class="text-bold text-center text-lg">Bid History</h2>
        <div v-for="bid of this.reverseItems" :key="bid.id">
            <ItemBidItem :id="bid.id"/>
        </div>
    </div>
</template>

<script>
import ItemBidItem from './ItemBidItem.vue';

export default {
  name: 'ItemBidList',
  components: {
    ItemBidItem,
  },
  computed: {
    reverseItems() {
      return this.bids?.slice().reverse();
    },
  },
  data() {
    return {
      bids: undefined,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      fetch(`/api/v1/auctions/${this.$route.params.auctionUrl}/items/${this.$route.params.itemId}/bids`).then((res) => res.json()).then((json) => { this.bids = json; });
    },
  },
};
</script>
