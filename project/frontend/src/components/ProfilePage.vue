<template>
  <div id="profile">
    <h1 class="text-4xl text-semibold text-center pt-4 text-darkBlue">
      Welcome to your profile {{ this.firstName}} {{this.lastName}}
    </h1>
    <div class="flex items-center">
      <button id="logout" type="button" class="center shadow bg-blue-400 hover:bg-blue-600
      focus:shadow-outline focus:outline-none text-white font-bold
      py-2 px-4 rounded mb-4 inline mx-auto" v-on:click="logout()"
      >Logout</button>
    </div>
    <hr/>
    <BidList></BidList>
  </div>
</template>

<script>
import BidList from './BidList.vue';

export default {
  name: 'ProfilePage',
  components: {
    BidList,
  },
  data() {
    return {
      id: undefined,
      firstName: undefined,
      lastName: undefined,
      email: undefined,
    };
  },
  mounted() {
    this.getUserInfo();
  },
  methods: {
    getUserInfo() {
      /* eslint-disable */
      fetch('/api/v1/auth/@me').then((data) => data.json()).then((json) => {
      console.table(json);
      Object.assign(this, json)
      console.log(this);
      });
    },
    logout() {
      fetch('/api/v1/auth/logout').then(() => {
        this.$router.push('/login')
      })
    }
  },
};

</script>

<style src="@/assets/tailwind.css"></style>
<style src="../../public/main.css"></style>
