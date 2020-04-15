<template>
    <div id="bid-list" class="mt-8">
        <h2 class="text-bold text-center text-lg">Bid History</h2>
        <div v-for="bid of this.reverseItems" :key="bid.id">
            <BidItem :id="bid.id"></BidItem>
        </div>
    </div>
</template>

<script>
import BidItem from './BidItem.vue';

export default {
  name: 'BidList',
  components: {
    BidItem,
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
      fetch('/api/v1/bids/@me').then((res) => res.json()).then((json) => { this.bids = json; });
    },
  },
};
</script>
