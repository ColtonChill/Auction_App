<template>

<!-- signUp/login form...  -->
<div v-if="!userIsLoggedIn">
<div v-if="error" class="ml-8 mr-8">
  <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
  role="alert">
  <span class="block sm:inline"> Invalid username or password.</span>
  <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
    <svg class="fill-current h-6 w-6 text-red-500" role="button" @click="changeErrorShow()"
    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title>
    <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0
    1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10
    8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2
    1.2 0 0 1 0 1.698z"/></svg>
  </span>
</div>
</div>
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
      <input v-model="eml" class="bg-gray-200 appearance-none border-2
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
      <input v-model="pass" class="bg-gray-200 appearance-none border-2 border-gray-200
      rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none
      focus:bg-white focus:border-blue-500" id="password"
      type="password" placeholder="************">
    </div>
  </div>
  <div class="md:flex md:items-center">
    <div class="md:w-1/3"></div>
    <div class="md:w-2/3">
      <button id="myButton" type="button" class="center shadow bg-blue-400 hover:bg-blue-600
      focus:shadow-outline focus:outline-none text-white font-bold
      py-2 px-4 rounded mb-4" v-on:click="handleLogin('api/v1/auth/login', eml, pass)"
      >Log in!</button>
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
</div>

</template>


<script>

export default {
  name: 'LoginPage',
  data() {
    return {
      userIsLoggedIn: false,
      error: false,
    };
  },
  mounted() {
    this.checkIfLoggedIn();
  },
  methods: {
    checkIfLoggedIn() {
      /* eslint-disable */
      fetch('/api/v1/auth/@me').then((response) => {   
        if (response.status === 401) {
          console.log(this.userIsLoggedIn);
        }
        else{
          console.log('user is logged in... should go to profile..')
          this.userIsLoggedIn = true;
          this.$router.push('/profile');
        }
  });
},
    changeErrorShow() {
      this.error = !this.error;
    },
    async handleLogin(url = 'coo', eml = '', pass = '') {
      /* eslint-disable */
      console.log(eml, pass);
      const data = {
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
      if (response.status != 200){
        this.error = true;
      }
      if (response.status == 200) {
        this.$router.push('/');
      }
      return response.json();
    },
  },
};
</script>
