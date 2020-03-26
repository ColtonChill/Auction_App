<template>
  <div style="width: 600px">
    <b-table hover :items="items"></b-table>
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
