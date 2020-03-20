
exports.up = function(knex) {
    return knex.schema.createTable('items', table => {
        table.increments('id').unsigned().unique();
        table.integer('auction').unsigned().references('id').inTable('auctions');
        table.string('name').notNull();
        table.text('description');
        table.string('image_name');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('items');
};
