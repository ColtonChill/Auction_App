require('dotenv').config();
const path = require('path');


const BASE_PATH = path.join(__dirname, 'db')

module.exports = {
    client: 'pg',
    connection: {
        host: 'auction_db',
        user: 'postgres',
        password: 'postgres',
        database: 'auction'
    },
    migrations: {
        directory: path.join(BASE_PATH, 'migrations'),
    }
};