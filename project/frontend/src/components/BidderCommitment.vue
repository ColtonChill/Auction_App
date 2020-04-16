<template>
  <div>
  <div v-if="this.users.length === 0">
    <p>There have been no bids in this auction yet.</p>
  </div>

    <div v-else>
        <table class="table-auto">
  <tr>
    <th class="px-4 py-2">ID</th>
    <th class="px-4 py-2">Name</th>
    <th class="px-4 py-2">Email</th>
    <th class="px-4 py-2">Total Commitment</th>
  </tr>
  <tr v-for="user in users" :key="user.id">
    <td class="border px-4 py-2">
    {{user.user.id }}
    </td>
    <td class="border px-4 py-2">
    {{user.user.firstName }} {{user.user.lastName }}
    </td>
    <td class="border px-4 py-2">{{user.user.email}}</td>
    <td class="border px-4 py-2">{{user.amount}}</td>

  </tr>
    </table>
    </div>
  </div>
</template>

<script>
import APIError from '../Errors';

export default {
  name: 'BidderCommitment',
  data() {
    return {
      users: [
      ],
    };
  },
  mounted() {
    this.getResults();
  },
  methods: {
    getResults() {
      fetch(`/api/v1/auctions/${this.auctionUrl}/commitment`).then((data) => {
        if (data.ok) {
          return data.json();
        }
        throw new APIError(data.json(), data.status, 'Failed to get auction results.');
      }).then((json) => {
        this.users = this.users.concat(json);
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
