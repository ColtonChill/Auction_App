const koa = require("koa");
const bodyParser = require("koa-bodyparser");
const Router =  require('koa-router');
import Bid from "../db/Bid";
import InvalidKeyError from "../db/InvalidKeyError";
const router = new Router();


/**
 * @TODO Ask Hunter what the heck @me/bid is supost to mean?
 */
router.get('Get a Bid by ID', '/ID/', async (ctx:any) => {
    if(!ctx.isAuthenticated()) {
        ctx.status = 401;
        ctx.body = {'error': 'You are not logged in.'}
        return Promise.resolve();
    }
    if(ctx.params.id === undefined||ctx.params.id == ""){
        ctx.status=400;
        ctx.body={'error':`'id' is required, Got ${ctx.params.id} instead.`}
        return Promise.resolve();
    }
    try {
        const res = await Bid.fromDatabaseId(ctx.params.id);
        if(res !== undefined) {
            ctx.body = res.toJson();
            ctx.status = 200;
            return Promise.resolve();
        }else{
            ctx.status = 404;
            ctx.body = {'error': 'Quiry returned undefined.'}
            return Promise.resolve();
        }
    } catch (error) {
        ctx.status = 404;
        ctx.body = {'error': `Quiry failed with error: ${error}`}
        return Promise.resolve();
    }
    
});

router.get('Get Bids by User', '/@me', async (ctx:any) => {
    console.log("Test log")
    if(!ctx.isAuthenticated()) {
        ctx.status = 401;
        ctx.body = {'error': 'You are not logged in.'}
        return Promise.resolve();
    }
    if(!ctx.isAuthenticated()) {
        ctx.status = 401;
        ctx.body = {'error': 'You are not logged in.'}
        return Promise.resolve();
    }
    const user = ctx.req.user;
    // catch(error=>{
    //     ctx.status = 400;
    //     ctx.message = `@me must be defined as a user, not: ${error}`;  
    //    // ctx.redirect('/login/failure');
    //     return Promise.resolve();
    // })
    try {
        const res = await Bid.fromDatabaseUser(ctx.req.user.id);
        if(res !== undefined) {
            ctx.body = res.map(it => it.toJson());
            ctx.status = 200;
            return Promise.resolve();
        }else{
            ctx.status = 404;
            ctx.body = {'error': 'Quiry returned undefined.'}
            return Promise.resolve();
        }
    } catch (error) {
        ctx.status = 404;
        ctx.body = {'error': `Quiry failed with error: ${error}`}
        return Promise.resolve();
    }
});




router.get('Get paged Bids for a User', '/bids/users/:userID', async (ctx:any) =>{
    if(!ctx.isAuthenticated()) {
        ctx.status = 401;
        ctx.body = {'error': 'You are not logged in.'}
        return Promise.resolve();
    }
    if(ctx.params.userID === undefined||ctx.params.userID == ""){
        ctx.status=400;
        ctx.body={'error':`'userID' is required, Got ${ctx.params.userID} instead.`}
        return Promise.resolve();
    }
    try {
        const res = await Bid.fromDatabaseUserPaginated(ctx.params.userID);
        if(res !== undefined) {
            ctx.body = res.map(it => it.toJson());
            ctx.status = 200;
            return Promise.resolve();
        }else{
            ctx.status = 404;
            ctx.body = {'error': 'Quiry returned undefined.'}
            return Promise.resolve();
        }
    } catch (error) {
        ctx.status = 404;
        ctx.body = {'error': `Quiry failed with error: ${error}`}
        return Promise.resolve();
    }
});

export default router;