<template>
    <div>
        <!-- Page to add an item on if you are an admin --> 
        <h1>Add an Item</h1>
        <form action = '/api/v1/item/'>
            <label for = "name">Item Name: </label>
            <input id = "name">
            
            <label for = "description">Description: </label>
            <input id = "description">

            <label for = "picture">Picture: </label>
            <input type = 'file' accept = "image/*" id="picture">  

            <label for = "sBid">Starting Bid</label>
            <input id = "sBid">
        </form>
        <button type="submit" action = "POST">Add Item </button>
    </div>
</template>
