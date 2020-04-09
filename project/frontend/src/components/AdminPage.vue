<template>

<!-- Admin form...  -->
<div class="flex col">
<div class="md:w-3/4 sm:w-full rounded overflow-hidden shadow-lg my-2 object-center mx-auto mt-12">

<form class="mx-12">

<div class="md:flex md:items-center mb-6 mt-4">
    <div class="w-32 flex-0">
      <label class="block text-gray-600 font-bold
      lg:text-left mb-1 md:mb-0 pr-4" for="auction-name">
        Auction Name
      </label>
    </div>
    <div class="flex-1">
      <input v-model="name" class="bg-gray-200 appearance-none border-2
      border-gray-200 rounded w-full py-2 px-4 text-gray-700
      leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
      id="name" type="text" @change="updateURL()">
    </div>
  </div>
  <div class="md:flex md:items-center mb-6 mt-4">
    <div class="w-32 flex-0">
      <label class="block text-gray-600 font-thin pr-4" for="url">
        URL
      </label>
    </div>
    <div class="w-full flex-1">
      <p class="block text-gray-600 font-thin">
        {{ this.url }}
      </p>
    </div>
  </div>

  <div class="md:flex md:items-center mb-6 mt-4">
    <div class="w-32 flex-0">
      <label class="block text-gray-600 font-bold
      md:text-left mb-1 md:mb-0 pr-4" for="description">
        Description
      </label>
    </div>
    <div class="flex-1">
      <input v-model="description" class="bg-gray-200 appearance-none border-2
      border-gray-200 rounded w-full py-2 px-4 text-gray-700
      leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
      id="description" type="text">
    </div>
  </div>

  <div class="md:flex md:items-center mb-6 mt-4">
    <div class="w-32 flex-0">
      <label class="block text-gray-600 font-bold
      md:text-left mb-1 md:mb-0 pr-4" for="location">
        Location
      </label>
    </div>
    <div class="flex-1">
      <input v-model="location" class="bg-gray-200 appearance-none border-2
      border-gray-200 rounded w-full py-2 px-4 text-gray-700
      leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
      id="description" type="text" value="">
    </div>
  </div>

  <div class="md:flex md:items-center mb-6 mt-4">
    <div class="w-32 flex-0">
      <label class="block text-gray-600 font-bold mb-1 md:mb-0 pr-4" for="public">
      Private
      </label>
    </div>
    <div class="flex-1">
      <input v-model="hidden" id="public" type="checkbox" @change="togglePrivacy()">
    </div>
  </div>

  <div class="md:flex md:items-center">
    <div class="w-32 flex-0">
      <label class="block text-gray-600 font-bold
      mb-1 md:mb-0 pr-4" for="code">
        Join Code
      </label>
    </div>
    <div class="w-full flex-1 flex items-center">
      <div class="flex-1">{{ this.inviteCode }}</div>
      <div class="flexGrow-2">
      <button type="button" class="center shadow bg-blue-400 hover:bg-blue-600
      focus:shadow-outline focus:outline-none text-white font-bold
      py-2 px-8 rounded mb-4" @click="regenCode()"
      >Regenerate</button>
      </div>
    </div>
  </div>
  <div class="md:flex md:items-center">
    <div class="md:w-1/2"></div>
    <div class="md:w-2/3">
      <button type="button" class="center shadow bg-blue-400 hover:bg-blue-600
      focus:shadow-outline focus:outline-none text-white font-bold
      py-2 px-4 rounded mb-4" @click="handleSave()"
      >Save</button>
    </div>
  </div>
  </form>
</div>
</div>

</template>

<script>
import slugify from 'slugify';

export default {
  name: 'AuctionSettings',
  data() {
    return {
      initUrl: undefined,
      name: undefined,
      description: undefined,
      location: undefined,
      url: undefined,
      hidden: undefined,
      inviteCode: undefined,
    };
  },
  mounted() {
    this.getAuctionData();
  },
  methods: {
    async handleSave() {
      const response = await fetch(`/api/v1/auctions/${this.initUrl}`, {
        method: 'PUT',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify({
          name: this.name,
          description: this.description,
          hidden: this.hidden,
          url: this.url,
          location: this.location,
        }),
      });
      if (this.url !== this.initUrl && response.status === 200) {
        this.$router.push(`/auctions/${this.url}/admin`);
        this.getAuctionData();
      }
    },
    togglePrivacy() {
      fetch(`/api/v1/auctions/${this.initUrl}/toggle-privacy`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
      }).then((response) => {
        if (response.status === 200) {
          fetch(`/api/v1/auctions/${this.initUrl}/`).then((it) => it.json()).then((newData) => {
            this.inviteCode = newData.inviteCode;
            this.hidden = newData.hidden;
          });
        }
      });
    },
    regenCode() {
      fetch(`/api/v1/auctions/${this.initUrl}/regen-code`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',

      }).then((response) => {
        if (response.status === 200) {
          fetch(`/api/v1/auctions/${this.initUrl}/`).then((it) => it.json()).then((newData) => {
            this.inviteCode = newData.inviteCode;
          });
        }
      });
    },
    getAuctionData() {
      /* eslint-disable-next-line */
      fetch(`/api/v1/auctions/${this.$route.params.auctionUrl}`).then(it => it.json()).then(json => {
        Object.assign(this, json);
        this.initUrl = json.url;
      });
    },
    updateURL() {
      this.url = slugify(this.name, {
        lower: true,
        remove: /[^\w ]/g,
      });
    },

  },
};
</script>
