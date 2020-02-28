import * as dotenv from 'dotenv';
dotenv.config();
import Koa from 'koa';
import Router from 'koa-router';
import logger from './services/Logger';
import { migrate } from './services/Database'; 
import { Server } from 'http';

const app : Koa = new Koa();
const router : Router = new Router();

const port = process.env.PORT || 3000;

router.get('/', async ctx => {
    ctx.body = {status: "OK"};
    ctx.status = 200;
})

app.use(router.routes()).use(router.allowedMethods());

logger.info("Migrating database to latest version.");
migrate();
logger.info("Done!");

export const server : Server = app.listen(port, async () => {
    logger.info(`Server running on port ${port}.`)
});