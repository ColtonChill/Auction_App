<template>
  <div>
    <div v-if="error" class="ml-8 mr-8">
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert">
        <span class="block sm:inline">{{error}}</span>
        <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
            <svg class="fill-current h-6 w-6 text-red-500" role="button"
            @click="changeErrorShow()"
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title>
            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0
            1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10
            8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2
            1.2 0 0 1 0 1.698z"/></svg>
        </span>
        </div>
    </div>
    <div v-if="id">
    <h2 class="text-4xl text-semibold text-center pt-4 text-darkBlue">
      {{this.name}} <a class="text-base text-gray-500" v-if="isAdmin" @click="editItem()">(edit)</a>
    </h2>
    <h3 class="text-xl text-semibold text-center pt-6 pb-6 text-midBlue">
      {{this.description}}</h3>
    <h2 class="text-center"> </h2>
    <div class="row">
        <div class="column p-4 ">
            <img class="w-28 h-28" :src="imageLocation">
        </div>
        <div v-if="starting_price" class="column p-10 "> Current bid: $
          {{ this.current_bid.money === undefined ? 0
          : this.current_bid.money }}<br>
            <div class="pt-8">
            <button id="myButton" type="button" class="center shadow bg-darkBlue hover:bg-blue-300
                focus:shadow-outline focus:outline-none text-white font-bold
                py-2 px-4 rounded mb-4" @click="showModal"
                >Bid ${{this.current_bid.money === undefined ? this.starting_price
                : this.current_bid.money + this.bid_increment}}
                </button>
            </div>
        </div>
        <div v-else class="column p-10 ">
          This is a live item!
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

    <ItemBidList/>
    </div>
  </div>
</template>


<script>
import ConfirmationModal from './ConfirmationModal.vue';
import ItemBidList from './ItemBidList.vue';
import APIError from '../Errors';

export default {
  name: 'ItemPage',
  data() {
    return {
      error: undefined,
      isAdmin: false,
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
    ItemBidList,
  },
  mounted() {
    this.getItemDetails();
  },
  computed: {
    imageLocation() {
      if (this.imageName !== null) {
        return `/user/${this.auction.url}/${this.imageName}`;
      }
      return '/static/noimage.png';
    },
  },
  methods: {
    editItem() {
      this.$router.push({ name: 'EditItem', params: { itemId: this.$route.params.itemId } });
    },
    showModal() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
    getItemDetails() {
      const auctionString = this.$route.params.auctionUrl;
      const itemString = this.$route.params.itemId;
      fetch(`/api/v1/auctions/${auctionString}/@me`).then(async (res) => {
        if (res.ok) {
          return res.json();
        }
        throw new APIError(await res.json(), res.status);
      }).then((json) => {
        this.isAdmin = json.administrator;
      }).catch((err) => {
        if (err.status === 401) {
          this.$router.push({ name: 'LoginPage' });
        }
        if (err.status === 403) {
          this.$router.push({ name: 'JoinPage'});
        }
        if (err.status === 404) {
          this.$router.push({ name: 'LandingPage' });
        }
      })
      /* eslint-disable */
      fetch(`/api/v1/auctions/${auctionString}/items/${itemString}`)
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          throw new APIError(res.json(), res.status);
        })
        .then((json) => {
          Object.assign(this, json)
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
};

</script>

<style src="@/assets/tailwind.css"></style>
<style src="../../public/main.css"></style>
