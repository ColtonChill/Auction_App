import * as dotenv from 'dotenv';
dotenv.config();
import Koa from 'koa';
import Router from 'koa-router';
import logger from './logger';

const app = new Koa();
const router = new Router();

const port = process.env.PORT || 3000;

router.get('/', async ctx => {
    ctx.body = "Hello!";
})

app.use(router.routes()).use(router.allowedMethods());

app.listen(port, async () => {
    logger.info(`Server running on port ${port}.`)
});