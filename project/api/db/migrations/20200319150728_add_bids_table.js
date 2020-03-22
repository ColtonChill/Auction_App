
exports.up = function(knex) {
    return knex.schema.createTable("bids", table=>{
        table.increments('id').unique().unsigned();
        table.integer("auction").unsigned().references('id').inTable('auctions');
        table.integer("user").unsigned().references('id').inTable('users');
        table.integer("item").unsigned().references('id').inTable('items');
        table.integer("money").unsigned();
        table.string("time");
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable("bids");
};
