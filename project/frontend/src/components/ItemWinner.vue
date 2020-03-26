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
    <td class="border px-4 py-2">{{ item.winningBid.money }}</td>
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
          id: 40, winningBid: { money: 6, user: { firstName: 'Hunter1', lastName: 'Henrichsen', email: 'hunter.henrichsen@gmail.com' } }, name: 'Book of Uselessness', description: 'A completely useless book.',
        },
        {
          id: 41, winningBid: { money: 7, user: { firstName: 'Hunter2', lastName: 'Henrichsen', email: 'hunter.henrichsen@gmail.com' } }, name: 'hat of Uselessness', description: 'A completely useless book.',
        },
        {
          id: 42, winningBid: { money: 8, user: { firstName: 'Hunter3', lastName: 'Henrichsen', email: 'hunter.henrichsen@gmail.com' } }, name: 'robe of Uselessness', description: 'A completely useless book.',
        },

      ],
    };
  },
};
</script>
