<template>
    <div class="border border-gray-500 lg:border-t lg:border-gray-400 bg-white
    rounded-t rounded-b lg:rounded-b-noone lg:rounded-r p-4 flex row
    justify-between leading-normal">
        <div class="bidder">
             {{ this.user.id }}
        </div>
        <div class="amount text-gray-900 font-bold text-1 mb-1">
            {{ this.money }}
        </div>
    </div>
</template>

<script>
export default {
  name: 'ItemBidItem',
  data() {
    return {
      user: undefined,
      money: undefined,
      auction: undefined,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      fetch(`/api/v1/bids/${this.params.id}`).then((res) => {
        if (res.status === 200) {
          Object.assign(this, res.json());
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
