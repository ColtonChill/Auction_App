<template>
  <div style="width: 600px">
    <table class="table-auto">
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

      ],
    };
  },
};
</script>
