require('dotenv').config();
import { join } from 'path';


const BASE_PATH = join(__dirname, 'db')

export const conn = {
    client: 'pg',
    connection: {
        host: 'auction_db',
        user: 'postgres',
        password: 'postgres',
        database: 'auction'
    }
};