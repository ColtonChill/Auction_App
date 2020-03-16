
exports.up = function(knex) {
    return knex.schema.createTable('auction_members', table => {
        table.increments('id').unsigned().unique();
        table.integer('user').unsigned().references('id').inTable('users');
        table.integer('auction').unsigned().references('id').inTable('auctions');
        table.boolean('banned').default('false');
        table.unique(['user', 'auction']);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('auction_members');
};
