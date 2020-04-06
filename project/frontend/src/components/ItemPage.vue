<template>
    <div>
    <p>
      <!-- <router-link to="/register">Go to RegisterPage</router-link>
      <router-link to="/login">Go to Login!</router-link> -->
    </p>
    <h2 class="text-4xl text-semibold text-center pt-4 text-darkBlue">
      {{this.itemTitle}}</h2>
    <h3 class="text-xl text-semibold text-center pt-6 pb-6 text-midBlue">
      {{this.props.itemDescription}}</h3>
    <h2 class="text-center"> </h2>
    <div class="row">
        <div class="column p-4 ">
            <img class="w-28 h-28" src="/img/bike.jpg">
        </div>
        <div class="column p-10 "> Current bid: ${{this.currentBid}} <br>
            <div class="pt-8">
            <button id="myButton" type="button" class="center shadow bg-darkBlue hover:bg-blue-300
                focus:shadow-outline focus:outline-none text-white font-bold
                py-2 px-4 rounded mb-4" @click="showModal"
                >Bid ${{this.currentBid + this.bidIncrement}} </button>
            </div>
        </div>
    </div>

    <ConfirmationModal v-show ='isModalVisible' @close="closeModal"
    />

  </div>
</template>


<script>
import ConfirmationModal from './ConfirmationModal.vue';

export default {
  name: 'ItemPage',
  data() {
    return {
      isModalVisible: false,
      currentBid: 15,
      bidIncrement: 5,
      itemTitle: 'Used Road Bicycle',
      itemDescription: 'A lightly used blue bicycle',
    };
  },
  components: {
    ConfirmationModal,
  },

  methods: {
    showModal() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
  },
};

// export default class LandingPage extends Vue {}

</script>

<style src="@/assets/tailwind.css"></style>
<style src="../../public/main.css"></style>
