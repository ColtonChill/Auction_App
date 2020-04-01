<template>
    <div id="auction">
    <p>
      <!-- <router-link to="/register">Go to RegisterPage</router-link>
      <router-link to="/login">Go to Login!</router-link> -->
    </p>
    <h2 class="text-4xl text-semibold text-center pt-4 text-darkBlue">
      {{this.itemTitle}}</h2>
    <h3 class="text-xl text-semibold text-center pt-6 pb-6 text-midBlue">
      {{this.itemDescription}}</h3>
    <h2 class="text-center"> </h2>
    <div class="row">
        <div class="column p-4 ">
            <img class="w-28 h-28" src="/img/bike.jpg">
        </div>
        <div class="column p-10 "> Current bid: ${{this.currentBid}} <br>
            <div class="pt-8">
            <button id="myButton" type="button" class="center shadow bg-darkBlue hover:bg-blue-300
                focus:shadow-outline focus:outline-none text-white font-bold
                py-2 px-4 rounded mb-4" v-on:click="openConfirmationModal()"
                >Bid ${{this.currentBid + this.bidIncrement}} </button>
            </div>
        </div>
    </div>
    <div id="myModal" class="modal">

  <!-- Modal content -->
  <div class="modal-content">
    <span class="close" v-on:click="closeModal()">&times;</span>
    <div class="items-center">
    <p class="text-center pb-4">Are you sure you want to bid
        ${{this.currentBid + this.bidIncrement}}??</p>
            <button id="imSure" type="button" class="
            center shadow bg-darkBlue hover:bg-blue-300 focus:shadow-outline
            focus:outline-none text-white font-bold
            py-2 px-4 rounded mb-4" v-on:click="handleBidIncrement()"
            >I'm sure!</button>
            <button id="cancel" type="button" class="center
            shadow bg-darkBlue hover:bg-blue-300 focus:shadow-outline focus:outline-none
            text-white font-bold
            py-2 px-4 rounded mb-4" v-on:click="closeModal()"
            >Cancel</button>
    </div>
  </div>

</div>
  </div>
</template>


<script lang="ts">

export default {
  name: 'ItemPage',
  data() {
    return {
      currentBid: 15,
      bidIncrement: 5,
      itemTitle: 'Used Road Bicycle',
      itemDescription: 'A lightly used blue bicycle',
    };
  },
  components: {
  },
  methods: {
    openConfirmationModal() {
      const modal = document.getElementById('myModal');
      modal.style.display = 'block';
    },
    handleBidIncrement() {
      /* eslint-disable */
      console.log("you confirmed your bid")
      this.currentBid = this.currentBid+this.bidIncrement;
      this.closeModal();
    },
    closeModal() {
      const modal = document.getElementById('myModal');
      modal.style.display = 'none';
    },
  },
};

// export default class LandingPage extends Vue {}

</script>

<style src="@/assets/tailwind.css"></style>
<style src="../../public/main.css"></style>
