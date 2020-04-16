
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
    <div class="flex col">
        <!-- Page to add an item on if you are an admin-->
        <div class = "max-w-md shadow-lg rounded object-center my-2 mx-auto md:items-center">
            <h1 class = "font-bold text-center text-gray-500 text-3xl">
             Edit an Item</h1>
             <br>
             <div class = "mx-12">
            <!-- The addition of the items api is needed here
            we still need whether it is a silent or a live auction
            and the bid increment item /items-->
            <!--<form class="mx-12" action =
            "/api/v1/auctions/{{ $route.params.auctionUrl }}+/items">-->
                <div class = "md:items-center">
                    <label for = "name" class="text-gray-500 font-bold">Item Name: </label>
                    <input v-model="name" id = "name" name="name" class="border-2 bg-gray-200"
                    maxlength="70"
                    size="30">
                </div>
                <br>
                <div class="object-center center">
                    <label for = "description"
                    class="block text-gray-500 font-bold"
                    >Description: </label>
                    <textarea v-model="description" rows='5' cols="45" id = "description"
                    class="border-2 bg-gray-200" size ="50"
                    name="description"
                    >Enter your description Here!</textarea>
                </div>
                <br>
                <!--Have to figure out something besides v-model for this one.-->
                <div class="object-center">
                    <label for = "picture" class="text-gray-500 font-bold">Picture: </label>
                    <input type = 'file' accept = "image/*" id="picture" name="picture"
                    @change="setImage($event)" class="bg-green-400">
                </div>
                <br>
                <div class="object-center">
                    <label for = "startingPrice" class="text-gray-500 font-bold"
                    >Starting Bid: </label>
                    <input v-model="startingBid" id = "startingPrice" type="number"
                    name="startingPrice" class="border-2 bg-gray-200 font-bold" size = 35>
                </div>
                <br>
                <div class="object-center">
                    <label for="bidIncrement" class="text-gray-500 font-bold"
                    >Bid Increment: </label>
                    <input v-model="bidIncrement" id = "bidIncrement" type="number"
                    name="bidIncrement" class="border-2 bg-gray-200 font-bold" size = 35>
                </div>
                <br>
                <div v-if="type === 'live'" class="object-center">
                    <label for="winner" class="text-gray-500 font-bold"
                    >Winner: </label>
                    <input v-model="winner" id = "winner" type="number"
                    name="winner" class="border-2 bg-gray-200 font-bold" size = 35>
                </div>
                <br>
                <div class="object-center md:items-center">
                    <!--<p name="buLabel" id="buLabel" class="text-red-500 font-bold"
                    >{{$route.params}}</p>-->
                    <button class ="md:items-center center
                    bg-blue-400 text-white font-bold rounded
                    px-4 py-2 mb-4"
                    type="button"
                    v-on:click="addItem()"
                    >Add Item </button>
                    <button class ="md:items-center center
                    bg-red-400 text-white font-bold rounded
                    px-4 py-2 mb-4"
                    type="button"
                    v-on:click="deleteItem()"
                    >Delete Item</button>
                </div>
              </div>
            <!--</form>-->
        </div>
    </div>
    </div>
</template>

<!--How do I add code that checks itself? -->
<script>
import APIError from '../Errors';

export default {
  name: 'EditItem',
  data() {
    return {
      id: undefined,
      name: '',
      description: '',
      startingBid: 1,
      bidIncrement: 1,
      type: 'silent',
      image: {},
      winner: -1,
      error: undefined,
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      fetch(`/api/v1/auctions/${this.$route.params.auctionUrl}/items/${this.$route.params.itemId}`).then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new APIError(res.json(), res.status);
      })
        .then((json) => {
          Object.assign(this, json);
        })
        .catch((err) => {
          if (err.status === 404) {
            this.$router.push({ name: 'Dashboard' });
          }
          if (err.status === 403) {
            this.$router.push({ name: 'AuctionHome' });
          }
          if (err.status === 401) {
            this.$router.push({ name: 'Login' });
          }
        });
    },
    changeErrorShow() {
      this.error = undefined;
    },
    deleteItem() {
      fetch(`/api/v1/auctions/${this.$route.params.auctionUrl}/items/${this.id}`, {
        method: 'DELETE',
      }).then((res) => {
        if (res.ok) {
          this.$router.push({ name: 'AuctionHome' });
        }
        throw new APIError(res.json(), res.status);
      });
    },
    setImage(event) {
      if (event.target.files[0].size > 1000000) {
        this.error = 'That file is too large.';
        return;
      }
      /* eslint-disable-next-line */
      this.image = event.target.files[0];
    },
    addItem() {
      const data = {
        name: this.name,
        description: this.description,
      };
      if (this.type === 'silent') {
        data.startingPrice = this.startingBid;
        data.bidIncrement = this.bidIncrement;
        data.silent = true;
      } else {
        data.silent = false;
      }
      fetch(`/api/v1/auctions/${this.$route.params.auctionUrl}/items/${this.id}`, {
        method: 'PUT',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data),
      }).then(async (res) => {
        if (res.status === 200) {
          const json = await res.json();
          const fd = new FormData();
          fd.append('image', this.image);
          fd.append('itemId', json.id);
          fetch(`/api/v1/auctions/${this.$route.params.auctionUrl}/item-image`, {
            method: 'POST',
            body: fd,
          }).then((ignored) => {
            this.$router.push({ name: 'AuctionHome' });
          });
        }
      });
    },
  },
};
// You just switched it to the real api, just test it
</script>
