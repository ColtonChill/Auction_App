<template>
  <div>
  <div v-if="this.items.length === 0">
    <p>There have been no bids in this auction yet.</p>
  </div>

  <div v-else>
    <table class="table-auto">
  <tr>
    <th class="px-4 py-2">Item Name</th>
    <th class="px-4 py-2">Amount</th>
    <th class="px-4 py-2">Name</th>
  </tr>
  <tr v-for="item in items" :key="item.id">
    <td class="border px-4 py-2">{{ item.item.name }}</td>
    <td class="border px-4 py-2">{{ item.money }}</td>
    <td class="border px-4 py-2">
      {{ item.user.firstName }} {{ item.user.lastName }}
    </td>
  </tr>
</table>
  </div>
  </div>
</template>

<script>
import APIError from '../Errors';

export default {
  name: 'ItemWinnerList',
  data() {
    return {
      items: [
      ],
    };
  },
  mounted() {
    this.getResults();
  },
  methods: {
    getResults() {
      fetch(`/api/v1/auctions/${this.auctionUrl}/results`).then((data) => {
        if (data.ok) {
          return data.json();
        }
        throw new APIError(data.json(), data.status, 'Failed to get auction results.');
      }).then((json) => {
        this.items = this.items.concat(json);
      }).catch((ignored) => {
        this.items = undefined;
      });
    },
  },
  props: {
    auctionUrl: {
      required: true,
    },
  },
};
</script>
