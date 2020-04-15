exports.up = function(knex) {
    return knex.schema.createTable('permissions', table => {
        table.integer('user').references('id').inTable('users');
        table.integer('auction').references('id').inTable('auctions');
        table.boolean('can_edit_settings').default(false);
        table.boolean('can_view_results').default(false);
        table.boolean('can_edit_items').default(false);
        table.boolean('can_edit_permissions').default(false);
        table.unique(['user', 'auction']);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('permissions');
};