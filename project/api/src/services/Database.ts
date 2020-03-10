const environment = process.env.NODE_ENV || 'development';
const config = require('../../knexfile.js');
import Knex from 'knex';

export const connection : Knex = Knex(config as Knex.Config);

export const migrate = function() : Promise<void> {
    return connection.migrate.latest();
}

export const rollback = function() : Promise<void> {
    return connection.migrate.rollback();
}