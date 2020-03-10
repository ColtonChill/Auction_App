
exports.up = function(knex) {
  return knex.schema.createTables("auctions", table =>{
      table.increments("id").unique().unsinged();
      table.string("name").unique();
      table.string("description");
      table.string("locations");
      table.integer("owner").unsigned().references('id').inTable('users');
      table.string("url").unique();
      table.boolean("hidden");
      table.string("inviteCode").unique();
  })
};

exports.down = function(knex) {
    return kenx.schema.dropTable("auctions");
};
