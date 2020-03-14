
exports.up = function(knex) {
  return knex.schema.createTable("auctions", table =>{
      table.increments("id").unique().unsigned();
      table.string("name").unique();
      table.string("description");
      table.string("location");
      table.integer("owner").unsigned().references('id').inTable('users');
      table.string("url").unique();
      table.boolean("hidden");
      table.string("invite_code").unique();
  })
};

exports.down = function(knex) {
    return knex.schema.dropTable("auctions");
};
