import Router from 'koa-router';
const router : Router = new Router();

router.get('/', async ctx => {
    ctx.body = {status: "OK"};
    ctx.status = 200;
})

export default router;