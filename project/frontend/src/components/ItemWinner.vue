<template>
  <div style="width: 600px">
    <table class="table-auto">
  <tr>
    <th class="px-4 py-2">Item Name</th>
    <th class="px-4 py-2">Amount</th>
    <th class="px-4 py-2">Name</th>
  </tr>
  <tr v-for="item in items" :key="item.id">
    <td class="border px-4 py-2">{{ item.name }}</td>
    <td class="border px-4 py-2">{{ item.winningBid.amount }}</td>
    <td class="border px-4 py-2">
      {{ item.winningBid.user.firstName }} {{ item.winningBid.user.lastName }}
    </td>
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
        {
          id: 40,
          price: 501,
          winningBid: { amount: 5, user: { firstName: 'Hunter', lastName: 'Henrichsen', email: 'hunter.henrichsen@gmail.com' } },
          name: 'Book of Uselessness',
          description: 'A completely useless book.',
        },
        {
          id: 62,
          price: 503,
          winningBid: { amount: 8, user: { firstName: 'Hunr', lastName: 'Henrichsen', email: 'hunter.henrichsen@gmail.com' } },
          name: ' Uselessness',
          description: 'A coseless book.',
        },
        {
          id: 43,
          price: 551,
          winningBid: { amount: 7, user: { firstName: 'Hunt', lastName: 'Henrichsen', email: 'hunter.henrichsen@gmail.com' } },
          name: ' of Uselessness',
          description: 'A c useless book.',
        },

      ],
    };
  },
};
</script>
