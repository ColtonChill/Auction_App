<template>
    <div style="width: 600px">
        <table class="table-auto">
  <tr>
    <th class="px-4 py-2">Name</th>
    <th class="px-4 py-2">TotalCommitment</th>
  </tr>
  <tr v-for="user in users" :key="item.id">
    
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
        { user: 'joe', totalCommitment: 501 },
        { user: 'momma', totalCommitment: 10 },
        { user: 'thatguy', totalCommitment: 24 },
        { user: 'OhyouKnow', totalCommitment: 454 },
      ],
    };
  },
};
</script>
