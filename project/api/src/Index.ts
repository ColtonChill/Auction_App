import * as dotenv from 'dotenv';
dotenv.config();
import Koa from 'koa';
import logger from './services/Logger';
import { migrate } from './services/Database'; 
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

app.use(bodyParser());

app.use(passport.initialize());
app.use(passport.session());

app.use(indexRouter.routes()).use(indexRouter.allowedMethods());

logger.info("Migrating database to latest version.");
migrate();
logger.info("Done!");

export const server : Server = app.listen(port, async () => {
    logger.info(`Server running on port ${port}.`)
});