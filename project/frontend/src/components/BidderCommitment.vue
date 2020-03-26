<template>
    <div style="width: 600px">
        <table class="table-auto">
  <tr>
    <th class="px-4 py-2">Name</th>
    <th class="px-4 py-2">Email</th>
    <th class="px-4 py-2">TotalCommitment</th>
  </tr>
  <tr v-for="user in users" :key="user.id">
    <td class="border px-4 py-2">
    {{user.firstName }} {{user.lastName }}
    </td>
    <td class="border px-4 py-2">{{user.email}}</td>
    <td class="border px-4 py-2">{{user.commitment}}</td>

  </tr>
    <table>
    </div>
</template>

<script>
export default {
  name: 'BidderCommitment',
  data() {
    return {
      items: [
        {
          firstName: 'Hunter1', lastName: 'Henrichsen', email: 'hunter1.henrichsen@gmail.com', commitment: 4202134,
        },
        {
          firstName: 'Hunter2', lastName: 'Henrichsen', email: 'hunter2.henrichsen@gmail.com', commitment: 4206234,
        },
        {
          firstName: 'Hunter3', lastName: 'Henrichsen', email: 'hunter3.henrichsen@gmail.com', commitment: 42012,
        },


      ],
    };
  },
};
</script>
