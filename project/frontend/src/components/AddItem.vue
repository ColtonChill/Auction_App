<template>
    <div class="flex col">
        <!-- Page to add an item on if you are an admin-->
        <div class = "mx-12 max-w-md shadow-lg rounded object-center my-2 mx-auto md:items-center">
            <h1 class = "font-bold text-center text-gray-500
             underline text-3xl">
             Add an Item</h1>
            <h2 class = "font-bold text-center text-gray-500
             text-2xl">{{ $route.params.auctionUrl }}</h2>
             <br>
            <!-- The addition of the items api is needed here
            we still need whether it is a silent or a live auction
            and the bid increment item /items-->
            <!--<form class="mx-12" action =
            "/api/v1/auctions/{{ $route.params.auctionUrl }}+/items">-->
                <div class = "md:items-center">
                    <label for = "name" class="text-gray-500 font-bold">Item Name: </label>
                    <input v-model="nm" id = "name" name="name" class="border-2 bg-gray-200"
                    maxlength="70"
                    size="30">
                </div>
                <br>
                <div class="object-center center">
                    <label for = "description"
                    class="block text-gray-500 font-bold"
                    >Description: </label>
                    <textarea v-model="dsc" rows='5' cols="45" id = "description"
                    class="border-2 bg-gray-200" size ="50"
                    name="description"
                    >Enter your description Here!</textarea>
                </div>
                <br>
                <!--Have to figure out something besides v-model for this one.-->
                <div class="object-center">
                    <label for = "picture" class="text-gray-500 font-bold">Picture: </label>
                    <input type = 'file' accept = "image/*" id="picture" name="picture"
                    class="bg-green-400">
                </div>
                <br>
                <div class="object-center">
                    <label for = "startingPrice" class="text-gray-500 font-bold"
                    >Starting Bid: </label>
                    <input v-model="sbid" id = "startingPrice" type="number" name="startingPrice"
                    class="border-2 bg-gray-200 font-bold" size = 35>
                </div>
                <br>
                <div class="object-center">
                    <label for="bidIncrement" class="text-gray-500 font-bold"
                    >Bid Increment: </label>
                    <input v-model="binc" id = "bidIncrement" type="number" name="bidIncrement"
                    class="border-2 bg-gray-200 font-bold" size = 35>
                </div>
                <br>
                <div class="object-center">
                    <label for="silentA" class="text-gray-500 font-bold"
                    >Silent </label>
                    <input v-model="sil" type="radio" id = "silentA" name="silent"
                    checked value=true>
                    <label for="live" class="text-gray-500 font-bold"
                    >Live </label>
                    <input v-model="sil" type="radio" id="live" name="silent" value=false>
                </div>
                <br>
                <div class="object-center md:items-center">
                    <!--<p name="buLabel" id="buLabel" class="text-red-500 font-bold"
                    >{{$route.params}}</p>-->
                    <button class ="md:items-center center
                    bg-blue-400 text-white font-bold rounded
                    px-4 py-2 mb-4"
                    type="button"
                    v-on:click="addItem(`/api/v1/item`,nm,dsc,
                    sbid,binc,sil)"
                    >Add Item </button>
                </div>
            <!--</form>-->
        </div>
    </div>
</template>

<!--How do I add code that checks itself? -->
<script lang="ts">
export default {
  name: 'AddItem',
  methods: {
    async addItem(url = '', nm = '', descrip = '', startBid = '', bidInc = '', silence = '') {
      const data = {
        name: nm,
        description: descrip,
        // pic: "",
        startingPrice: startBid,
        bidIncrement: bidInc,
        silent: silence,
      };
      const response = await fetch(url, {
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
      });
      console.log(response);
      return response.json();
    },
  },
};
</script>
