<template>
    <div>
        <!-- Page to add an item on if you are an admin-->
        <div class = "shadowlg rounded object-center">
            <h1 class = "max-w-mdfont-bold text-center text-gray-500
             underline text-3xl">
             Add an Item</h1>
            <form action = '/api/v1/item/'>
                <label for = "name">Item Name: </label>
                <input id = "name">
                <br>
                <label for = "description">Description: </label>
                <input id = "description">
                <br>
                <label for = "picture">Picture: </label>
                <input type = 'file' accept = "image/*" id="picture">
                <br>
                <label for = "sBid">Starting Bid</label>
                <input id = "sBid">
            </form>
            <button type="submit" action = "POST">Add Item </button>
        </div>
    </div>
</template>

<script lang="ts">
export default {
  name: 'AddItem',
};
</script>
