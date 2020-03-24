
exports.up = function(knex) {
    return Promise.all([
        knex.schema.createTable('live_items', table => {
            table.increments('id').unsigned().unique();
            table.integer('item').unique().unsigned().references('id').inTable('items');
            table.integer('winner').unsigned().nullable().references('id').inTable('users');
            table.integer('winning_price').unsigned();
        }),

        knex.schema.createTable('silent_items', table => {
            table.increments('id').unsigned().unique();
            table.integer('item').unique().unsigned().references('id').inTable('items');
            table.integer('starting_price').unsigned();
            table.integer('bid_increment').unsigned();
        })
    ])
};

exports.down = function(knex) {
    return Promise.all([
        knex.schema.dropTable('live_items'),
        knex.schema.dropTable('silent_items')
    ])
};
