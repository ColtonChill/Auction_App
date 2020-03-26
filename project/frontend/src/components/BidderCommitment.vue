<template>
  <div style="width: 600px">
  <b-table hover :items="items"></b-table>
   
  </div>
</template>

<script>
  export default {
    name: 'BidderCommitment',  
    data() {
      return {
        items: [
          { user: joe, totalCommitment: '501'},
          { user: momma, totalCommitment: '10' },
          { user: thatguy, totalCommitment: '24',},
          { user: OhyouKnow, totalCommitment: '454',}
        ]
      }
    }
  }
</script>
