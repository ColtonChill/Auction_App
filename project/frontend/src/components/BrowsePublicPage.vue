<template>
  <div>
      <h2 class="text-xl text-semibold text-center pt-6 pb-6 text-darkBlue">
        Public Auctions </h2>

  <div v-if="auctions.length === 0" class="items-center">
    <hr>
    <h3>No auctions to view...   </h3>
    <!-- the links below do not actually work yet! they are not in router yet -->
  </div>
  <div v-else>
  <h2 class="pl-8">Auctions</h2>
    <AuctionItemWJoin
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
import AuctionItemWJoin from './AuctionItemWJoin.vue';

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
    AuctionItemWJoin,
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
      fetch('/api/v1/auctions/').then((data) => {
        if (data.status != 200) {
          console.log("could not load the public auctions, code: " + data.status);
        }
        return data.json()}).catch((er) => {console.log(er)}).then((json) => {
        // console.table(json);
        this.auctions = this.auctions.concat(json);
      });
    },
  },
};
</script>