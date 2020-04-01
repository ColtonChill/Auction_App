const Router = require('koa-router');
const router = new Router();

router.post('/', async ctx =>{
    ctx.body = ctx.request.body;
})

export default router;