<template>
  <div>

  <div v-if="auctions.length === 0 || this.unauthorized === true" class="items-center mb-10">
    <hr>
    <h3>No auctions to view...  </h3>
    <!-- the links below do not actually work yet! they are not in router yet -->
    <router-link to="/browse"> <p class="hover:underline text-blue-600">
    Browse public auctions</p> </router-link>
    <!-- <router-link to="/join"> <p class="hover:underline text-blue-600">
    Join with a QR code</p> </router-link> -->
  </div>
  <div v-else>
  <h2 class="pl-8">My Auctions</h2>
  <div v-if="auctions" class="items-center">
    <AuctionItem
        v-for="auction in auctions"
        :key="auction.id"
        :id="auction.id"
        :auction="auction" />

        <!-- I thought this object-center would center it... but no....  -->
        <div class="flex col">
          <p class="mx-auto text-md object-center mb-6">
            Not seeing what you want?
            <button class="text-midBlue" @click="createAuction()">
              Create one.
            </button>
          </p>
        </div>
  </div>
  <div v-else>
    <div class="flex col">
      <p class="mx-auto text-md object-center mb-6">
        You're not a part of any auctions.
        <button class="text-midBlue" @click="createAuction()">
          Create one?
        </button>
      </p>
    </div>
    <!-- the links below do not actually work yet! they are not in router yet -->
    <router-link to="/browsePublic"> <p class="hover:underline text-blue-600">
    Browse public auctions</p> </router-link>
    <!-- <router-link to="/join"> <p class="hover:underline text-blue-600">
    Join with a QR code</p> </router-link> -->
  </div>
</div>
</template>

<script>
import AuctionItem from './AuctionItem.vue';
import APIError from '../Errors';

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
    createAuction() {
      this.$router.push('/create-auction');
    },
    getAuctions() {
      if (!this.more) {
        return;
      }
      if (this.isLoading) {
        return;
      }
      this.isLoading = true;
      fetch('/api/v1/auctions/@mine').then((data) => {
        if (data.ok) {
          return data.json();
        }
        throw new APIError(data.json(), data.status, 'Failed to grab auctions.');
      }).then((json) => {
        this.auctions = this.auctions.concat(json);
      }).catch((ignored) => {
        this.auctions = undefined;
      });
    },
  },
};
</script>
