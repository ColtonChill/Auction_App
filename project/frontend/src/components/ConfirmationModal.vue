<script>
export default {
  name: 'ConfirmationModal',
  methods: {
    close() {
      this.$emit('close');
    },
    handleBidIncrement() {
      /* eslint-disable */
      if (this.$parent.current_bid.money === undefined) {
        console.log("$parents currentbid.money before: " + this.$parent.current_bid.money)
        this.$parent.current_bid.money = this.bidIncrement;
        console.log("$parents currentbid.money after: " + this.$parent.current_bid.money)
      }
      else {
      this.$parent.current_bid.money += this.bidIncrement;
      }
      this.sendBidToApi(this.$parent.current_bid.money);
      this.close();
    },
    async sendBidToApi(newBid) {
      const url = `/api/v1/auctions/${this.$parent.auction.url}/items/${this.$parent.id}/bid`;
      const data = {
        money: newBid,
      };
      fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data),
      }).then(async (response) => {
        if(!response.ok) {
          this.$parent.error = await response.json().error;
          return;
        }
        this.$parent.getItemDetails();
      }).catch((_) => {});
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
                py-2 px-4 ml-4 mr-4 rounded" @click="handleBidIncrement"
                >Yes, bid ${{currentBid + bidIncrement}} </button>
            <button type="button" class="center shadow bg-darkBlue hover:bg-blue-300
                focus:shadow-outline focus:outline-none text-white font-bold
                py-2 px-4 ml-4 mr-4 rounded" @click="close"
                >Nevermind </button>
        </slot>
      </footer>
    </div>
  </div>
</template>
