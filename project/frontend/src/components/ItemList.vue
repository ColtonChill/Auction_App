<template>
  <div>

  <div v-if="items.length === 0">
  <h3>No items to view... </h3>
  </div>

  <div v-else>
  <h2 class="pl-8">All items</h2>
    <ItemItem v-bind:auctionIBelongTo=auctionIBelongTo
        v-for="item in items"
        :key="item.id"
        :id="item.id"
        :item="item" />

        <div class="flex col">
          <button class="mx-auto text-md object-center mb-6">Load More...</button>
        </div>
  </div>
</div>
</template>

<script>
import ItemItem from './ItemItem.vue';

// these should not be hardcoded!!!!
export default {
  name: 'ItemList',
  data() {
    return {
      isLoading: false,
      more: true,
      page: 1,
      items: [],
    };
  },
  components: {
    ItemItem,
  },
  props: {
    auctionIBelongTo: {
      required: true,
    },
  },
  mounted() {
    this.getItems();
  },
  methods: {
    getItems() {
      if (!this.more) {
        return;
      }
      if (this.isLoading) {
        return;
      }
      this.isLoading = true;
      fetch(`/api/v1/auctions/${this.auctionIBelongTo}/items`).then((data) => data.json()).then((json) => {
        console.table(json);
        this.items = this.items.concat(json);
      });
    },
  },
};
</script>
