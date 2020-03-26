import Router from 'koa-router';
import auth from './Auth';
const router : Router = new Router();

router.get('/', async ctx => {
    ctx.body = {status: "OK"};
    ctx.status = 200;
})


router.use('/auth', auth.routes(), auth.allowedMethods() );


export default router;