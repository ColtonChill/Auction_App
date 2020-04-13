<template>
      <div id="profile">
    <h1 class="text-4xl text-semibold text-center pt-4 text-darkBlue">
      Welcome to your profile {{ this.firstName}} {{this.lastName}}</h1>
    <h2 class="text-xl text-semibold text-center pt-6 pb-6 text-midBlue">
      Your email is: {{ this.email }}</h2>
      <hr>
  </div>
</template>

<script>

export default {
  name: 'ProfilePage',
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
      fetch('api/v1/auth/@me').then((data) => data.json()).then((json) => {
      console.table(json);
      Object.assign(this, json)
      });
      }
  }
};

</script>

<style src="@/assets/tailwind.css"></style>
<style src="../../public/main.css"></style>
