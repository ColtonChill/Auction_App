<template>
      <div v-if="this.auction" id="auction">
    <h1 class="font-title text-4xl text-semibold text-center pt-4 text-darkBlue">
      {{ this.auction.name }}</h1>
    <h2 class="text-xl text-semibold text-center pt-6 pb-6 text-midBlue">
      Select items from below to see details:</h2>
    <ItemList v-bind:auctionIBelongTo=$route.params.auctionUrl />
  </div>
</template>

<script>

import APIError from '@/Errors';
import ItemList from './ItemList.vue';

export default {
  name: 'AuctionPage',
  components: {
    ItemList,
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      fetch(`/api/v1/auctions/${this.$route.params.auctionUrl}`)
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          throw new APIError(res.json(), res.status);
        })
        .then((json) => {
          this.auction = json;
        })
        .catch((ex) => {
          if (ex.status === 404) {
            this.$router.push('/404');
          } else if (ex.status === 401) {
            this.$router.push('/login');
          } else if (ex.status === 403) {
            this.$router.push(`${this.$route.path}/join`);
          } else {
            /* eslint-disable-next-line */
            console.log(ex);
            this.$router.push('/');
          }
        });
    },
  },
  data() {
    return {
      auction: undefined,
    };
  },
};

</script>

<style src="@/assets/tailwind.css"></style>
<style src="../../public/main.css"></style>
