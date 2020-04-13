<template>
    <div>
    <h2 class="text-4xl text-semibold text-center pt-4 text-darkBlue">
      {{this.name}}</h2>
    <h3 class="text-xl text-semibold text-center pt-6 pb-6 text-midBlue">
      {{this.description}}</h3>
    <h2 class="text-center"> </h2>
    <div class="row">
        <div class="column p-4 ">
            <img class="w-28 h-28" src="/img/bike.jpg">
        </div>
        <div class="column p-10 "> Current bid: $
          {{ this.current_bid.money === undefined ? this.starting_price
          : this.current_bid.money }}<br>
            <div class="pt-8">
            <button id="myButton" type="button" class="center shadow bg-darkBlue hover:bg-blue-300
                focus:shadow-outline focus:outline-none text-white font-bold
                py-2 px-4 rounded mb-4" @click="showModal"
                >Bid ${{this.current_bid.money === undefined ? this.starting_price +
                this.bid_increment : this.current_bid.money + this.bid_increment}}
                </button>
            </div>
        </div>
    </div>

    <div v-if="this.current_bid.money === undefined">
      <ConfirmationModal v-show ='isModalVisible' @close="closeModal"
      v-bind:currentBid=starting_price v-bind:bidIncrement=bid_increment
      />
    </div>
    <div v-else>
      <ConfirmationModal v-show ='isModalVisible' @close="closeModal"
      v-bind:currentBid=current_bid.money v-bind:bidIncrement=bid_increment
      />
       </div>


  </div>
</template>


<script>
import ConfirmationModal from './ConfirmationModal.vue';

export default {
  name: 'ItemPage',
  data() {
    return {
      /* eslint-disable */
      isModalVisible: false,
      id: undefined,
      auction: undefined,
      name: undefined,
      description: undefined,
      imageName: undefined,
      type: undefined,
      starting_price: undefined,
      bid_increment: undefined,
      current_bid: {
        id: undefined,
        auction: undefined,
        user: undefined,
        item: undefined,
        money: undefined,
        time: undefined
      },
    };
  },
  components: {
    ConfirmationModal,
  },
  mounted() {
    this.getItemDetails();
  },
  methods: {
    showModal() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
    getItemDetails() {
      const auctionString = this.$route.params.auctionUrl;
      const itemString = this.$route.params.itemId;
      /* eslint-disable */
      fetch(`/api/v1/auctions/${auctionString}/items/${itemString}`).then((data) => data.json()).then((json) => {
      console.table(json);
      Object.assign(this, json)
      });
    },
  },
};

</script>

<style src="@/assets/tailwind.css"></style>
<style src="../../public/main.css"></style>
