<template>
  <div class="lg:flex px-6 pb-2" >
    <div class="bg-white rounded-t rounded-b lg:rounded-b-none lg:rounded-r p-4 flex row
    justify-between leading-normal shadow-md">
   <div class="flex-shrink-0 flex-grow-1 h-12 ">
      <img class="w-12 h-12 mr-4" src="/static/auction.png">
      </div>
    <div class="flex-shrink-1 flex-grow-4">
      <div class="text-gray-900 font-bold text-l mb-1">
        {{ auction.name }}
        <svg v-if="auction.hidden" class=" svg text-gray-500 w-3 h-3 mr-2"
        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M4 8V6a6 6 0 1 1 12 0v2h1a2 2 0 0 1 2 2v8a2
          2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h1zm5
          6.73V17h2v-2.27a2 2 0 1 0-2 0zM7 6v2h6V6a3 3 0 0 0-6 0z" />
        </svg>
      </div>
      <p class="text-gray-900 leading-none text-xs">{{ auction.location }}</p>
      <p class="text-gray-700 text-xs"> {{ auction.description }} </p>
    </div>
      <button id="myButton" type="button" class="center shadow bg-blue-400 hover:bg-blue-600
      focus:shadow-outline focus:outline-none text-white font-bold
      py-2 px-4 rounded mb-4" v-on:click="handleJoin(auction.url)"
      >Join!</button>
  </div>
</div>
</template>

<script>
export default {
  data() {
    return {
      isLoggedIn: false,
    };
  },
  props: {
    id: {
      // type: String,
      required: true,
    },
    auction: {
      type: Object,
      required: false,
    },
  },
  methods: {
    /* eslint-disable */
  //   checkIfLoggedIn() {
  //     fetch('/api/v1/auth/@me').then((response) => {
  //       if (response.status === 401) {
  //         this.isLoggedIn = false;
  //         alert("You must log in before joining an auction");
  //         this.$router.push('/login');
  //   }
  //   });
  // },
  //  200 if they're a member, 201 if they're new,
  //  and 400 if they're banned/entered a wrong code.
  //  401 if not logged in, 404 if bad auction.

    handleJoin(auctionUrl) {
    // this.checkIfLoggedIn();
    this.sendJoinToApi(auctionUrl);
    },
    async sendJoinToApi(auctionUrl) {
      const url = `/api/v1/auctions/${auctionUrl}/member/@me/`;
      const data = {};
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
      // console.log("the response for join is: " + response.status);
      if (response.status === 201 || response.status === 200){
        if(this.$route.query.redir) {
          this.$router.push(redir);
        }
          // alert("Successful join");
          this.$router.push(`/auctions/${auctionUrl}`);
      }
      else if (response.status === 400 || response.status === 404) {
          alert(response.json().error);
          this.$router.push('/');
      }
      else if (response.status === 401) {
        // alert("You must be logged in to join an auction");
        this.$router.push('/login');
      }
      else {
        alert(response.json().error);
        this.$router.push('/');
      }
    //   return response.json();
    },
  }
}
</script>
