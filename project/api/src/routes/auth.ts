//Author: Jace Longhurst 
import Router from 'koa-router';
const router : Router = new Router();

router.get('/', async ctx =>{
    ctx.body = "Welcome to the authorization api!";
    ctx.status = 200; 
})

router.get('/login', async ctx =>{
ctx.request.body.username;
ctx.request.body.password;
})

export default router;