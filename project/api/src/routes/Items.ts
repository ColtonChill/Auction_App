const Router = require('koa-router');
const router = new Router();

//This file is made only for testing 
//It prints out the post requests sent to it
router.post('/', async ctx =>{
    ctx.body = ctx.request.body;
    console.log("Hey this is your body: \n");
    console.log(ctx.request.body);
    return Promise.resolve();

})

export default router;