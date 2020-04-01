<template>
    <div class="flex col">
        <!-- Page to add an item on if you are an admin-->
        <div class = "max-w-md shadow-lg rounded object-center my-2 mx-auto md:items-center">
            <h1 class = "font-bold text-center text-gray-500
             underline text-3xl">
             Add an Item</h1>
            <!-- The addition of the items api is needed here -->
            <form class="mx-12" action = '/api/v1/item/'>
                <div class = "md:items-center">
                    <label for = "name" class="text-gray-500 font-bold">Item Name: </label>
                    <input id = "name" class="border-2 bg-gray-200"
                    size="30">
                </div>
                <br>
                <div class="object-center center">
                    <label for = "description"
                    class="block text-gray-500 font-bold"
                    >Description: </label>
                    <textarea rows='5' cols="45" id = "description"
                    class="border-2 bg-gray-200" size ="50"
                    >Enter your description Here!</textarea>
                </div>
                <br>
                <div class="object-center">
                    <label for = "picture" class="text-gray-500 font-bold">Picture: </label>
                    <input type = 'file' accept = "image/*" id="picture"
                    class="bg-green-400">
                </div>
                <br>
                <div class="object-center">
                    <label for = "sBid" class="text-gray-500 font-bold"
                    >Starting Bid: </label>
                    <input id = "sBid"
                    class="border-2 bg-gray-200 font-bold" size = 35>
                </div>
                <br>
                <div class="object-center md:items-center">
                    <button class ="center
                    bg-blue-400 text-white font-bold rounded px-4 py-2 mb-4"
                    type="submit" formmethod ="POST">Add Item </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script lang="ts">
export default {
  name: 'AddItem',
};
</script>
