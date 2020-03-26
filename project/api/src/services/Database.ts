const environment = process.env.NODE_ENV || 'development';
const config = require('../../knexfile.js');
import Knex from 'knex';

export let connection : Knex = Knex(config as Knex.Config);

export const migrate = function() : Promise<void> {
    return connection.migrate.latest();
}

export const rollback = function() : Promise<void> {
    return connection.migrate.rollback();
}

export const getMigrationVersion = function() : Promise<string> {
    return connection.migrate.currentVersion();
}

export const raw = function(query: string) {
    return connection.raw(query);
}

export const reload = function() {
    connection = Knex(config as Knex.Config);
}