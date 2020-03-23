<template>

<!-- signUp/login form...  -->
<div class="flex col">
<div class="max-w-md rounded overflow-hidden shadow-lg my-2 object-center mx-auto">
<form class="mx-12">

  <div class="md:flex md:items-center mb-6 mt-4">
    <div class="">
      <label class="block text-gray-500 font-bold
      md:text-right mb-1 md:mb-0 pr-4 mr-10" for="email">
        Email
      </label>
    </div>
    <div class="">
      <input class="bg-gray-200 appearance-none border-2
      border-gray-200 rounded w-full py-2 px-4 text-gray-700
      leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
      id="email" type="text">
    </div>
  </div>
  <div class="md:flex md:items-center mb-6">
    <div class="">
      <label class="block text-gray-500 font-bold md:text-right
      mb-1 md:mb-0 pr-4 mr-2">
        Password
      </label>
    </div>
    <div class="md:w-2/3">
      <input class="bg-gray-200 appearance-none border-2 border-gray-200
      rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none
      focus:bg-white focus:border-blue-500" id="password"
      type="password" placeholder="************">
    </div>
  </div>
  <div class="md:flex md:items-center">
    <div class="md:w-1/3"></div>
    <div class="md:w-2/3">
      <router-link to="/">
      <button id="myButton" type="button" class="center shadow bg-blue-400 hover:bg-blue-600
      focus:shadow-outline focus:outline-none text-white font-bold
      py-2 px-4 rounded mb-4" v-on:click="handleLogin('api/v1/auth/login')">Log in!</button>
      </router-link>
    </div>
  </div>
    <div class="mx-auto pb-8 text-center">
        <span> Don't have an account?  </span>
            <span class="text-midBlue">
             <router-link to="/register">Sign up! </router-link>
        </span>
    </div>
</form>
</div>
</div>

</template>


<script lang="ts">

export default {
  name: 'LoginPage',
  methods: {
    async postLogin(url = '', data = {}) {
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
    handleLogin(url = '') {
      // if (document == null) {
      //   throw new Error('document is null');
      // } else if (document.getElementById('email').nodeValue == null ||
      // document.getElementById('password').nodeValue == null) {
      //   throw new Error('document is not null but email or pass is');
      // } else {

      /* eslint-disable */
      const eml = document.getElementById('email')!.nodeValue;
      const pass = document.getElementById('password')!.nodeValue;
      this.postLogin(url, { email: eml, password: pass });
    },
  },
};
</script>
