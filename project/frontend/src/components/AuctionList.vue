<template>
  <div>

  <div v-if="auctions.length === 0 || this.unauthorized === true" class="items-center">
    <hr>
    <h3>No auctions to view...   </h3>
    <!-- the links below do not actually work yet! they are not in router yet -->
    <router-link to="/browsePublic"> <p class="hover:underline text-blue-600">
    Browse public auctions</p> </router-link>
    <!-- <router-link to="/join"> <p class="hover:underline text-blue-600">
    Join with a QR code</p> </router-link> -->
  </div>
  <div v-else>
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
      unauthorized: true,
    };
  },
  components: {
    AuctionItem,
  },
  mounted() {
    this.getAuctions();
  },
  methods: {
    /* eslint-disable */
    getAuctions() {
      if (!this.more) {
        return;
      }
      if (this.isLoading) {
        return;
      }
      this.isLoading = true;
      fetch('/api/v1/auctions/@mine').then((data) => {
        if (data.response != 200) {
          this.unauthorized = true;
          console.log("user isn't logged in.")
        }
        return data.json()}).catch((er) => {console.log("uh oh")}).then((json) => {
        // console.table(json);
        this.auctions = this.auctions.concat(json);
      });
    },
  },
};
</script>
