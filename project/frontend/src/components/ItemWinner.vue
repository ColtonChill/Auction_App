<template>
  <div style="width: 600px">
    <table>
      <tr v-for"item in items" :key="item.id">
        <td>{{ item.name }}</td>
        <td>{{ item.winningBid.amount }}</td>
        <td>{{ item.winningBid.user.firstName }}</td>
        <td>{{ item.winningBid.user.lastName }}</td>
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
        { id: 40, price: 501, winningBid: { amount: 5, user: { firstName: 'Hunter', lastName: 'Henrichsen', email: 'hunter.henrichsen@gmail.com' }}, 
        name: 'Book of Uselessness', description: 'A completely useless book.' }
        
      ],
    };
  },
};
</script>
