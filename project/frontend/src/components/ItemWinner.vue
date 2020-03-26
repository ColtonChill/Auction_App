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
        { id: 40, price: '501', winnerFirstname: 'thedude', winnerLastName: 'stuff' },
        { id: 21, price: '23', winnerFirstname: 'me', winnerLastName: 'stuff'},
        { id: 89, price: '24', winnerFirstname: 'you', winnerLastName: 'stuff'},
        { id: 38, price: '454', winnerFirstname: 'her', winnerLastName: 'stuff'},
      ],
    };
  },
};
</script>
