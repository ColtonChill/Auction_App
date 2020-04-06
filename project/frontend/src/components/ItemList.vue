<template>
  <div>

  <h2 class="pl-8">All items</h2>
  <h2> for auction {{auctionIBelongTo}} </h2>

    <ItemItem v-bind:auctionIBelongTo=auctionIBelongTo
        v-for="item in items"
        :key="item.id"
        :id="item.id"
        :item="item" />

        <div class="flex col">
          <button class="mx-auto text-md object-center mb-6">Load More...</button>
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
      items: [{
        title: 'item1', description: 'a cool item', id: 1, currentBid: 5, bidIncrement: 5,
      },
      {
        title: 'item2', description: 'a cooler item', id: 2, currentBid: 10, bidIncrement: 5,
      },
      {
        title: 'item3', description: 'the coolest item', id: 3, currentBid: 15, bidIncrement: 5,
      },
      ],
      more: true,
      page: 1,
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

//   mounted() {
//     this.getItems();
//   },
//   methods: {
//     getItems() {
//       if (!this.more) {
//         return;
//       }
//       if (this.isLoading) {
//         return;
//       }
//       this.isLoading = true;
//       return this.items;
//     },
//   },
};
</script>
