import * as dotenv from 'dotenv';
dotenv.config();
import Koa from 'koa';
import logger from './services/Logger';
import { migrate } from './services/Database'; 
import { Server } from 'http';
import indexRouter from './routes/Routes';

const app : Koa = new Koa();

const port = process.env.PORT || 3000;

router.get('/', async ctx => {
    ctx.body = {status: "OK"};
    ctx.status = 200;
})

app.use(indexRouter.routes()).use(indexRouter.allowedMethods());

logger.info("Migrating database to latest version.");
migrate();
logger.info("Done!");

export const server : Server = app.listen(port, async () => {
    logger.info(`Server running on port ${port}.`)
});