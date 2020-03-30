<template>

<!-- signUp/login form...  -->
<div class="flex col">
<div class="max-w-md rounded overflow-hidden shadow-lg my-2 object-center mx-auto">
<form class="mx-12">

  <div class="md:flex md:items-center mb-6 mt-4">
    <div class="">
      <label class="block text-gray-600 font-bold
      md:text-right mb-1 md:mb-0 pr-4" for="first-name">
        First Name
      </label>
    </div>
    <div class="">
      <input v-model="first" class="bg-gray-200 appearance-none border-2
      border-gray-200 rounded w-full py-2 px-4 text-gray-700
      leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
      id="first" type="text">
    </div>
  </div>

    <div class="md:flex md:items-center mb-6 mt-4">
    <div class="">
      <label class="block text-gray-600 font-bold
      md:text-right mb-1 md:mb-0 pr-4" for="last-name">
        Last Name
      </label>
    </div>
    <div class="">
      <input v-model="last" class="bg-gray-200 appearance-none border-2
      border-gray-200 rounded w-full py-2 px-4 text-gray-700
      leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
      id="last" type="text" value="">
    </div>
  </div>

  <div class="md:flex md:items-center mb-6 mt-4">
    <div class="">
      <label class="block text-gray-600 font-bold
      md:text-right mb-1 md:mb-0 pr-4 mr-10" for="email">
        Email
      </label>
    </div>
    <div class="">
      <input v-model="eml" class="bg-gray-200 appearance-none border-2
      border-gray-200 rounded w-full py-2 px-4 text-gray-700
      leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
      id="eml" type="text" value="">
    </div>
  </div>
  <div class="md:flex md:items-center mb-6">
    <div class="">
      <label class="block text-gray-600 font-bold md:text-right
      mb-1 md:mb-0 pr-4 mr-2" for="password">
        Password
      </label>
    </div>
    <div class="md:w-2/3">
      <input v-model="pass" class="bg-gray-200 appearance-none border-2 border-gray-200
      rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none
      focus:bg-white focus:border-blue-500" id="pass"
      type="password" placeholder="************">
    </div>
  </div>
  <div class="md:flex md:items-center">
    <div class="md:w-1/3"></div>
    <div class="md:w-2/3">
      <router-link to="/">
      <button type="button" class="center shadow bg-blue-400 hover:bg-blue-600
      focus:shadow-outline focus:outline-none text-white font-bold
      py-2 px-4 rounded mb-4" @click="handleReg('api/v1/auth/register', first, last, eml, pass)"
      >Sign Up</button>
      </router-link>
    </div>
  </div>
</form>
</div>
</div>

</template>

<script lang="ts">

export default {
  name: 'RegisterPage',
  data() {
    return {
      first: '',
      last: '',
      eml: '',
      pass: '',
    };
  },
  methods: {
    async handleReg(url = '', first = '', last = '', eml = '', pass = '') {
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
  },
};
</script>
