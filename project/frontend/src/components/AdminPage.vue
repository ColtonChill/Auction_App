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
      id="name" type="text">
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
      Public
      </label>
    </div>
    <div class="flex-1">
      <input v-model="checkbox" id="public" type="checkbox">
    </div>
  </div>

  <div class="md:flex md:items-center mb-6 mt-4">
    <div class="w-32 flex-0">
      <label class="block text-gray-600 font-bold
       mb-1 md:mb-0 pr-4" for="url">
        URL
      </label>
    </div>
    <div class="w-full flex-1">
      <input v-model="url" class="bg-gray-200 appearance-none border-2
      border-gray-200 rounded w-full py-2 px-4 text-gray-700
      leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
      id="url" type="text" value="">
    </div>
  </div>
  <div class="md:flex md:items-center">
    <div class="w-32 flex-0">
      <label class="block text-gray-600 font-bold
      mb-1 md:mb-0 pr-4" for="code">
        Join Code
      </label>
    </div>
    <div class="w-full flex-1">
      <router-link to="/">
      <button type="button" class="center shadow bg-blue-400 hover:bg-blue-600
      focus:shadow-outline focus:outline-none text-white font-bold
      py-2 px-8 rounded mb-4" @click="handleReg('api/v1/auth/register', first, last, eml, pass)"
      >Regen Code</button>
      </router-link>
    </div>
  </div>
  <div class="md:flex md:items-center">
    <div class="md:w-1/2"></div>
    <div class="md:w-2/3">
      <router-link to="/">
      <button type="button" class="center shadow bg-blue-400 hover:bg-blue-600
      focus:shadow-outline focus:outline-none text-white font-bold
      py-2 px-4 rounded mb-4"
      >Save</button>
      </router-link>
    </div>
  </div>
  </form>
</div>
</div>

</template>

<script lang="ts">

export default {
  name: 'AuctionSettings',
  data() {
    return {
      name: '',
      description: '',
      location: '',
      checkbox: '',
      url: '',
      code: '',
    };
  },
  methods: {
    async handleSave(url = '', first = '', last = '', eml = '', pass = '') {
      /* eslint-disable */
      console.log(first, last, eml, pass);
      const data = {
        firstName: first,
        lastName: last,
        email: eml,
        password: pass,
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
      return response.json();
    },
    async regenCode()
  },
};
</script>