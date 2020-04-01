import Router from 'koa-router';
import auth from './Auth';
import auctions from './Auctions'
import items from './Items'
const router : Router = new Router();

router.get('/', async ctx => {
    ctx.body = {status: "OK"};
    ctx.status = 200;
})


router.use('/auth', auth.routes(), auth.allowedMethods());
router.use('/auctions', auctions.routes(), auctions.allowedMethods());
router.use('/item', items.routes(), auctions.allowedMethods());

export default router;