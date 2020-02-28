import * as dotenv from 'dotenv';
dotenv.config();
import Koa from 'koa';
import Router from 'koa-router';
import logger from './services/Logger';
import { migrate } from './services/Database'; 

const app = new Koa();
const router = new Router();

const port = process.env.PORT || 3000;

router.get('/', async ctx => {
    ctx.body = "Hello!";
})

app.use(router.routes()).use(router.allowedMethods());

logger.info("Migrating database to latest version.");
migrate();
logger.info("Done!");

app.listen(port, async () => {
    logger.info(`Server running on port ${port}.`)
});