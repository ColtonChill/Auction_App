
exports.up = function(knex) {
    return knex.schema.table('auctions', table => {
        table.boolean('open').default(false);
    });
};

exports.down = function(knex) {
    return knex.schema.table('auctions', table => {
        table.dropColumn('open');
    })
};
