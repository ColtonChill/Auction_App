<template>

<!-- signUp/login form...  -->
<div class="flex col">
<div class="max-w-md rounded overflow-hidden shadow-lg my-2 object-center mx-auto">
<form class="mx-12">

  <div class="md:flex md:items-center mb-6 mt-4">
    <div class="">
      <label class="block text-gray-600 font-bold
      md:text-right mb-1 md:mb-0 pr-4" for="first-name">
        Have a code for {{ $route.params.auctionUrl }}??
        Enter it here:
      </label>
    </div>
    <div class="">
      <input v-model="code" class="bg-gray-200 appearance-none border-2
      border-gray-200 rounded w-full py-2 px-4 text-gray-700
      leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
      id="first" type="text">
    </div>
  </div>

  <div class="md:flex md:items-center">
    <div class="md:w-1/3"></div>
    <div class="md:w-2/3">
      <button type="button" class="center shadow bg-blue-400 hover:bg-blue-600
      focus:shadow-outline focus:outline-none text-white font-bold
      py-2 px-4 rounded mb-4" @click="sendJoinToApi(code)"
      >Join!</button>
    </div>
  </div>
</form>
<h3 class="text-red"> {{this.joinFailureText}}</h3>
</div>
</div>

</template>

<script>

export default {
  name: 'JoinPage',
  data() {
    return {
      joinFailureText: '',
    };
  },
  mounted() {
    this.checkIfLoggedIn();
    this.updateQueryCode();
  },

  methods: {
    checkIfLoggedIn() {
      /* eslint-disable */
      fetch('/api/v1/auth/@me').then((response) => {   
        if (response.status === 401) {
          console.log(this.userIsLoggedIn);
          this.$router.push('/login');
          //probably need a way to tell the login page that they were
          //trying to join so it redirects them there after... 
        }
  });
},
    updateQueryCode() {
        if (this.$route.query.code != undefined){
            this.sendJoinToApi(this.$route.query.code);
        }
    },
    async sendJoinToApi(joinCode) {
      const url = `/api/v1/auctions/${this.$route.params.auctionUrl}/member/@me/`;
      const data = {
        pin: joinCode,
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
      console.log("the response for join code is: " + response.status);
      if (response.status === 201){
          alert("successful join");
          this.$router.push(`/auctions/${this.$route.params.auctionUrl}`);
      }
      else {
          alert("Invalid join code.");
      }
    //   return response.json();
    },
}
}
</script>
