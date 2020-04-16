<template>
      <div v-if="user" class="flex shadow-lg w-64 mx-auto p-4 mb-8 rounded-lg">
          <div class="bidder flex-1 inline">
              {{ this.user.id }}
          </div>
          <div class="amount text-gray-900 font-bold text-1 mb-1 flex-1 inline text-right">
              {{ this.money }}$
          </div>
      </div>
</template>

<script>
export default {
  name: 'ItemBidItem',
  data() {
    return {
      item: undefined,
      user: undefined,
      money: undefined,
      auction: undefined,
    };
  },
  props: {
    id: Number,
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      fetch(`/api/v1/bids/${this.id}`).then(async (res) => {
        if (res.ok) {
          Object.assign(this, await res.json());
        } else {
          this.user = {
            id: `null ${res.status}`,
          };
          this.money = -Infinity;
        }
      });
    },
  },
};
</script>
