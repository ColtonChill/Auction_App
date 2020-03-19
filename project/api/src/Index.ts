import * as dotenv from 'dotenv';
dotenv.config();
import Koa from 'koa';
import logger from './services/Logger';
import { migrate, rollback, raw, getMigrationVersion, reload } from './services/Database'; 
import { Server } from 'http';
import session from 'koa-session';
import bodyParser from 'koa-bodyparser';
import indexRouter from './routes/Routes';
import passport from './services/LocalAuthentication';
import RedisStore from 'koa-redis';

const app : Koa = new Koa();

const port = process.env.PORT || 3000;
const key = process.env.SECRET || "729GkzSAuu0mhJ7RrTfP6WucgEwBM2NV" // Default secret key.

app.keys = [key];
app.use(session({
    store: new RedisStore()
}, app));

app.use(bodyParser);

app.use(passport.initialize());
app.use(passport.session());

app.use(indexRouter.routes()).use(indexRouter.allowedMethods());

export const server : Server = app.listen(port, async () => {
    logger.info(`Server running on port ${port}.`)
    await testConnection(); 
    await doMigrations();
});



async function doMigrations() {
    const startVersion = await getMigrationVersion()
    try {
        logger.info(`Migrating database...`);
        migrate();
        logger.info(`Done!`);
    } catch (ex) {
        const newVersion = await getMigrationVersion()
        if(newVersion !== startVersion) {
            rollback();
        }
        logger.error(`Database migration or connection failed. Quitting.`)
        server.close();
        process.exit();
    }
}

async function testConnection() {
    const maxTries = parseInt(process.env['DB_CONNECT_TRIES'] || '30');
    const interval = parseInt(process.env['DB_CONNECT_INTERVAL'] || '1000');
    let tries = 1;
    let successful = false;
    while(tries <= maxTries && !successful) {
        await raw('SELECT 1 + 1').then(() => {
            successful = true;
            logger.info('Connected to the database.')
        }).catch(async err => {
            logger.verbose(`Failed to connect to database, try ${tries} of ${maxTries}. Retrying in ${interval}ms.`)
            tries++;
            await (async () => new Promise(resolve => setTimeout(resolve, interval)))();
            reload();
        })
    }
    if(!successful) {
        logger.error('Failed to connect to the database. Exiting.')
        server.close();
        process.exit();
    }
}