<template>
  <div>
    <div v-if="this.users.length === 0">
      <p>There are no members of this auction.</p>
    </div>
    <div v-else>
      <table class="table-auto">
        <tr>
          <th class="px-4 py-2">ID</th>
          <th class="px-4 py-2">Name</th>
          <th class="px-4 py-2">Email</th>
          <th class="px-4 py-2">Actions</th>
        </tr>
        <tr v-for="user in users" :key="user.id">
          <td class="border px-4 py-2">
            {{user.id }}
          </td>
          <td class="border px-4 py-2">
            {{user.firstName }} {{user.lastName }}
          </td>
          <td class="border px-4 py-2">{{user.email}}</td>
          <td class="border px-4 py-2">
            <button @click="kick(user)">Kick</button>
          </td>
          <td class="border px-4 py-2">
            <button @click="ban(user)">Ban</button>
          </td>
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
      fetch(`/api/v1/auctions/${this.auctionUrl}/members`).then((data) => {
        if (data.ok) {
          return data.json();
        }
        throw new APIError(data.json(), data.status, 'Failed to get auction results.');
      }).then((json) => {
        this.users = this.users.concat(json);
      }).catch(() => {
        this.items = undefined;
      });
    },
    kick(user) {
      fetch(`/api/v1/auctions/${this.auctionUrl}/members/${user.id}/kick`, {
        method: 'POST',
      }).then((data) => {
        if (data.ok) {
          this.users = this.users.filter((it) => it.id !== user.id);
        }
      });
    },
    ban(user) {
      fetch(`/api/v1/auctions/${this.auctionUrl}/members/${user.id}/ban`, {
        method: 'POST',
      }).then((data) => {
        if (data.ok) {
          this.users = this.users.filter((it) => it.id !== user.id);
        }
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
