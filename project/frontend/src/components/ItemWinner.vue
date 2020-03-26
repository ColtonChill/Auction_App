<template>
  <div style="width: 600px">
    <table>
  <tr v-for"item in items" :key="item.id">
    <td>{{ item.name }}</td>
    <td>{{ item.winningBid.amount }}</td>
    <td>{{ item.winningBid.user.firstName }} {{ item.winningBid.user.lastName }}</td>
  </tr>
<table>
  </div>
</template>

<script>
export default {
  name: 'ItemWinnerList',
  data() {
    return {
      items: [
        { id: 40, price: '501', winner: 'thedude' },
        { id: 21, price: '23', winner: 'me' },
        { id: 89, price: '24', winner: 'you' },
        { id: 38, price: '454', winner: 'her' },
      ],
    };
  },
};
</script>
