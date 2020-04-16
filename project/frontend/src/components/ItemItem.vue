<template>
  <div v-if="item" class="flex px-6 pb-2">
  <router-link :to="'/auctions/' + auctionIBelongTo + '/items/' + item.id"
    class="sm:w-10/12 lg:w-768 mx-auto">
    <div class="bg-white shadow-lg
    rounded-t rounded-b lg:rounded-b-none lg:rounded-r p-4 flex row
    justify-between leading-normal w-full">
   <div class="flex-shrink-0 flex-grow-0 h-12">
      <img class="w-12 h-12 rounded-full mr-4" :src=imageLocation>
      </div>
    <div class="flex-shrink-1 flex-grow-4">
      <div class="text-gray-900 font-bold text-l mb-1">
        {{ item.name }}
        <!-- <svg class=" svg text-gray-500 w-3 h-3 mr-2"
        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M4 8V6a6 6 0 1 1 12 0v2h1a2 2 0 0 1 2 2v8a2
          2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h1zm5
          6.73V17h2v-2.27a2 2 0 1 0-2 0zM7 6v2h6V6a3 3 0 0 0-6 0z" />
        </svg> -->
      </div>
      <!-- <p class="text-gray-900 leading-none text-xs">{{ aucti }}</p> -->
      <p class="text-gray-700 text-xs"> {{ item.description }} </p>
    </div>
  </div>
  </router-link>
</div>
</template>

<script>
export default {
  computed: {
    imageLocation() {
      if (this.item.imageName !== null) {
        return `/user/${this.auctionIBelongTo}/${this.item.imageName}`;
      }
      return '/static/noimage.png';
    },
  },
  props: {
    id: {
      // type: String,
      required: true,
    },
    item: {
      type: Object,
      required: false,
    },
    auctionIBelongTo: {
      required: true,
    },
  },
  methods: {
  },
};
</script>
