<template>
  <div v-if="this.auction" class="mx-auto
    object-center my-2 md:items-center">
        <h1 class="text-4xl text-semibold
        text-center pt-4 text-darkBlue">{{auction.name}}</h1>
        <div class="flex sm:flex-col md:flex-row md:items-center content-between">
          <div class="flex-1 text-center">
            <button v-on:click="toEdit()"
            tag="button" class="sm:mt-4 mx-4 bg-blue-400 text-white font-bold
            rounded px-4 py-2 mb-4 items-center mx-auto center md:items-center content-center"
            >Edit auction details</button>
          </div>
          <div class="flex-1 text-center">
            <button v-on:click="openAuction()"
            tag="button" class="sm:mt-4 mx-4 bg-blue-400 text-white font-bold
            rounded px-4 py-2 mb-4 items-center mx-auto center md:items-center content-center"
            >{{this.auction.open ? "Close Bidding" : "Open Bidding"}}</button>
          </div>
          <div class="flex-1 text-center">
            <button v-on:click="toItem()"
            tag="button" class="sm:mt-4 mx-4 bg-blue-400 text-white font-bold
            rounded px-4 py-2 mb-4 items-center mx-auto center md:items-center content-center"
            >Add Item</button>
          </div>
          <div class="flex-1 text-center">
            <button v-on:click="goHome()"
            tag="button" class="sm:mt-4 mx-4 bg-blue-400 text-white font-bold
            rounded px-4 py-2 mb-4 items-center mx-auto center md:items-center content-center"
            >Auction Home</button>
          </div>
        </div>
    <div class="content-start row flex-wrap inline items-start">
      <div class="flex-0 rounded-lg shadow-lg p-4 inline m-8" style="text-align: center">
        <p class="text-lg text-darkBlue underline">Join by QR Code:</p>
        <qrcode-vue :value="value" :size="size" :renderAs="svg" level="H"/>
      </div>
      <div class="flex-0 rounded-lg shadow-lg p-4 inline m-8">
        <p class="text-lg text-darkBlue underline">Commitments by user: </p>
        <BidderCommitment class="mt-2 mb-6" v-bind:auctionUrl=this.$route.params.auctionUrl />
      </div>
      <div class="flex-0 rounded-lg shadow-lg p-4 inline m-8">
        <p class="text-lg text-darkBlue underline">Winners by item: </p>
        <ItemWinnerList class="mt-2 mb-6" v-bind:auctionUrl=this.$route.params.auctionUrl />
      </div>
      <div class="flex-0 rounded-lg shadow-lg p-4 inline m-8">
        <p class="text-lg text-darkBlue">All Members: </p>
        <UserList class="mt-2 mb-6" :auctionUrl=this.$route.params.auctionUrl />
      </div>
    </div>
  </div>
</template>
<script>
import QrcodeVue from 'qrcode.vue';
import BidderCommitment from './BidderCommitment.vue';
import ItemWinnerList from './ItemWinner.vue';
import UserList from './UserList.vue';
import APIError from '../Errors';

export default {
  name: 'AuctionDashboard',
  components: {
    BidderCommitment,
    ItemWinnerList,
    QrcodeVue,
    UserList,
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
    goHome() {
      this.$router.push({ name: 'AuctionHome' });
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
