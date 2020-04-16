
<template>
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
                <div class="object-center">
                    <label for="silent" class="text-gray-500 font-bold"
                    >Silent </label>
                    <input v-model="silent" type="radio" id="silent" name="silent" value="silent">
                    <label for="live" class="text-gray-500 font-bold"
                    >Live </label>
                    <input v-model="silent" type="radio" id="live" name="silent" value="live">
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
      /* eslint-disable-next-line */
      console.log(event.target.files[0]);
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
