const environment = process.env.NODE_ENV || 'development';
const config = require('../../knexfile.js');
import Knex from 'knex';

export const connection : Knex = Knex(config as Knex.Config);

export const migrate = function(){
    connection.migrate.latest();
}