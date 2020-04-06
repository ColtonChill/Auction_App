<script>
export default {
  name: 'ConfirmationModal',
  methods: {
    close() {
      this.$emit('close');
    },
    handleBidIncrement() {
      this.currentBid += this.bidIncrement;
      this.close();
    },
  },
  props: {
    currentBid: {
      required: true,
    },
    bidIncrement: {
      required: true,
    },
  },
};
</script>

<template>
  <div class="modal-backdrop">
    <div class="modal">
      <header >
         <p class="text-darkBlue text-lg"> Confirm Bid</p>
      </header>
      <section class="modal-body">
        <slot name="body">
          Are you sure you want to bid {{currentBid+bidIncrement}}??
        </slot>
       </section>
       <footer class="modal-footer">
          <slot name="footer">
            <button type="button" class="center shadow bg-darkBlue hover:bg-blue-300
                focus:shadow-outline focus:outline-none text-white font-bold
                py-2 px-4 rounded" @click="handleBidIncrement"
                >Yes, bid ${{currentBid + bidIncrement}} </button>
            <button type="button" class="center shadow bg-darkBlue hover:bg-blue-300
                focus:shadow-outline focus:outline-none text-white font-bold
                py-2 px-4 rounded" @click="close"
                >Nevermind </button>
        </slot>
      </footer>
    </div>
  </div>
</template>
