<template>
  <div id="app">
    <ul class="flex bg-darkBlue h-10">
  <li class="mx-6 mt-2 flex-grow-0">
    <router-link to="/" class="text-white hover:text-blue-400">Home</router-link>
  </li>
  <li class="flex-grow-1">
  </li>
  <li v-if="adminOnThisAuction === true" class="mx-6 mt-2 flex-grow-0">
    <a @click="toAdmin()" class="text-white hover:text-blue-400">Admin </a>
  </li>
  <li class="mx-6 mt-2 flex-grow-0">
    <router-link to="/login" class="text-white hover:text-blue-400">Profile </router-link>
  </li>
  <!-- <li class="mx-6 mt-2 flex-grow-0">
    <router-link to="/results" class="text-white hover:text-blue-400">Results </router-link>
  </li>
  <li class="mx-6 mt-2 flex-grow-0">
    <router-link to="/commitment" class="text-white hover:text-blue-400">Commitment </router-link>
  </li>
  <li class="mx-6 mt-2 flex-grow-0">
    <router-link to="/admin" class="text-white hover:text-blue-400">admin </router-link>
  </li> -->
</ul>
    <!-- <router-link to="/register">Register    </router-link>
    <router-link to="/login">Login</router-link> -->
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  data() {
    return {
      adminOnThisAuction: false,
    };
  },
  watch: {
    $route() {
      this.init();
    },
  },
  created() {
    this.init();
  },
  methods: {
    toAdmin() {
      this.$router.push({
        name: 'Dashboard',
      });
    },
    beforeRouteUpdate() {
      this.init();
    },
    init() {
      /* eslint-disable-next-line */
      console.log('Checking for auction...');
      if (this.$route.params.auctionUrl !== undefined) {
        fetch(`/api/v1/auctions/${this.$route.params.auctionUrl}/@me`).then((res) => {
          if (res.ok) {
            return res.json();
          }
          throw new Error();
        })
          .then((json) => {
            this.adminOnThisAuction = json.administrator;
          })
          .catch((err) => {
            this.adminOnThisAuction = false;
          });
      }
    },
  },
};
</script>

<style src="./assets/tailwind.css"></style>
<style src="../public/main.css"></style>
