
exports.up = function(knex) {
    return knex.schema.createTable('users', table => {
        table.increments('id').unique().unsigned();
        table.string('email').unique();
        table.string('first_name');
        table.string('last_name');
        table.string('password_hash');
    }) 
};

exports.down = function(knex) {
    return knex.schema.dropTable('users');
};
