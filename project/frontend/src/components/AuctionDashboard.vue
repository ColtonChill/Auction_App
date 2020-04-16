<template>
    <div v-if="this.auction" class="mx-auto
    object-center my-2 md:items-center">
        <h1 class="text-4xl text-semibold
        text-center pt-4 text-darkBlue">Admin Dashboard</h1>
        <p class="text-center text-md text-darkBlue">for</p>
        <h2 class="text-xl text-semibold text-center
        pt-2 pb-4 text-blue-500">{{auction.name}}</h2>
        <div class="flex sm:flex-col md:flex-row md:items-center content-center">
            <button v-on:click="toEdit()"
            tag="button" class="sm:mt-4 mx-4 bg-blue-400 text-white font-bold
            rounded px-4 py-2 mb-4 items-center mx-auto center md:items-center content-center"
            >Edit auction details</button>
            <button v-on:click="openAuction()"
            tag="button" class="sm:mt-4 mx-4 bg-blue-400 text-white font-bold
            rounded px-4 py-2 mb-4 items-center mx-auto center md:items-center content-center"
            >{{this.auction.open ? "Close Bidding" : "Open Bidding"}}</button>
            <button v-on:click="toItem()"
            tag="button" class="sm:mt-4 mx-4 bg-blue-400 text-white font-bold
            rounded px-4 py-2 mb-4 items-center mx-auto center md:items-center content-center"
            >Add Item</button>
        </div>
        <div style="text-align: center">
        <qrcode-vue style="position: relative; display: block; margin: 0px"
        :value="value" :size="size" level="H"></qrcode-vue>
        </div>
        <hr>
        <div class="mx-auto">
        <p class="text-lg text-darkBlue underline"> Commitments by user: </p>
      <BidderCommitment class="mt-2 mb-6" v-bind:auctionUrl=this.$route.params.auctionUrl />
      </div>
        <div class="mx-auto">
        <p class="text-lg text-darkBlue underline"> Winners by item: </p>
      <ItemWinnerList class="mt-2 mb-6" v-bind:auctionUrl=this.$route.params.auctionUrl />
      </div>
    </div>
</template>
<script>
import QrcodeVue from 'qrcode.vue';
import BidderCommitment from './BidderCommitment.vue';
import ItemWinnerList from './ItemWinner.vue';
import APIError from '../Errors';

export default {
  name: 'AuctionDashboard',
  components: {
    BidderCommitment,
    ItemWinnerList,
    QrcodeVue,
  },
  computed: {
    value() {
      return `${window.hostname}/auctions/${this.auction.url}
      /join?code=${this.auction.inviteCode}`;
    },
  },
  data() {
    return {
      auction: undefined,
      size: 140,
    };
  },
  created() {
    fetch(`/api/v1/auctions/${this.$route.params.auctionUrl}`).then((res) => {
      if (res.ok) {
        return res.json();
      }
      throw new APIError(res.json(), res.status);
    }).then((json) => {
      if (json.inviteCode === undefined) {
        this.$router.push({ name: 'AuctionPage' });
      }
      this.auction = json;
    }).catch((err) => {
      if (err.status === 404) {
        this.$router.push('404');
      } else if (err.status === 403) {
        this.$router.push({
          name: 'JoinPage',
          params: { auctionUrl: this.$route.params.auctionUrl },
        });
      }
    });
  },
  methods: {
    toItem() {
      this.$router.push({ name: 'AddItem' });
    },
    toEdit() {
      this.$router.push({ name: 'AdminPage' });
    },
    openAuction() {
      fetch(`/api/v1/auctions/${this.auction.url}/open`, {
        method: 'POST',
        body: JSON.stringify({
          open: !this.auction.open,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(async (res) => {
        if (res.ok) {
          this.auction = await res.json();
        }
      });
    },
  },
};
</script>
<!--Is there a reason I can't dynamic route inside of html?
Is there a way to use vue to get to that page withour this?
Why is it adding the weird digit!?!?!?!?-->
<style src="@/assets/tailwind.css"></style>
