const koa = require("koa");
const router = require("koa-router");
const bodyParser = require("koa-bodyparser");
import Bid from "../db/Bid";
import InvalidKeyError from "../db/InvalidKeyError";


/**
 * @TODO Ask Hunter how front end can spesify a get
 */
router.get('Get a Bid by ID', '/:id', async ctx => {
    const res = await Bid.fromDatabaseId(ctx.params.id);
    if(res !== undefined) {
        ctx.body = res.toJson();
        ctx.status = 200;
        return Promise.resolve();
    }
    ctx.status = 404;
});

router.get('Get Bids by Auction', '/auctions/:id', async ctx => {
    const res = await Bid.fromDatabaseAuction(ctx.params.id);
    if(res !== undefined) {
        ctx.body = res.map(it => it.toJson());
        ctx.status = 200;
        return Promise.resolve();
    }
    ctx.status = 404;
});

router.get('Get Bids by User', '/:id', async ctx => {
    const res = await Bid.fromDatabaseUser(ctx.params.id);
    if(res !== undefined) {
        ctx.body = res.map(it => it.toJson());
        ctx.status = 200;
        return Promise.resolve();
    }
    ctx.status = 404;
});

router.get('Get Bids by Item', '/:id', async ctx => {
    const res = await Bid.fromDatabaseItem(ctx.params.id);
    if(res !== undefined) {
        ctx.body = res.map(it => it.toJson());
        ctx.status = 200;
        return Promise.resolve();
    }
    ctx.status = 404;
});

router.get('Get Bids by User for an Auction', '/:idAuction/:idUser', async ctx =>{
    const res = await Bid.getDatabaseAuctionUser(ctx.params.idAuction,ctx.params.idUser);
    if(res !== undefined) {
        ctx.body = res.map(it => it.toJson());
        ctx.status = 200;
        return Promise.resolve();
    }
    ctx.status = 404;
});

router.get('Get Bids by User for an Item', '/:idItem/:idUser', async ctx =>{
    const res = await Bid.getDatabaseAuctionUser(ctx.params.idItem,ctx.params.idUser);
    if(res !== undefined) {
        ctx.body = res.map(it => it.toJson());
        ctx.status = 200;
        return Promise.resolve();
    }
    ctx.status = 404;
});

router.get('Get paged Bids for a User', '/:id/', async ctx =>{
    const res = await Bid.fromDatabaseUserPaginated(ctx.params.id);
    if(res !== undefined) {
        ctx.body = res.map(it => it.toJson());
        ctx.status = 200;
        return Promise.resolve();
    }
    ctx.status = 404;
});

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//
//
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//
router.post('Place bid', '/', async ctx => {
    const data = ctx.request.body;
    console.log(ctx.request);
    console.log(ctx.request.body);
    console.log(data);
    if(data === undefined) {
        ctx.status = 400;
        ctx.body = {'error': 'No data sent.'};
        return Promise.resolve();
    }
    if(data.auction === undefined) {
        ctx.status = 400;
        ctx.body = {'error': 'No Auction specified.'};
        return Promise.resolve();
    }
    if(data.user === undefined) {
        ctx.status = 400;
        ctx.body = {'error': 'No User specified.'}
        return Promise.resolve();
    }
    if(data.item === undefined) {
        ctx.status = 400;
        ctx.body = {'error': 'No Item specified.'}
        return Promise.resolve();
    }
    if(data.money === undefined) {
        ctx.status = 400;
        ctx.body = {'error': 'No Money specified.'}
        return Promise.resolve();
    }
    let auction = parseInt(data.auction);
    let user = parseInt(data.user);
    let item = parseInt(data.item);
    let money = parseInt(data.money);
    if (auction === NaN) {
        ctx.status = 400;
        ctx.body = {'error': 'Invalid number format for auction.'};
        return Promise.resolve();
    }
    if (user === NaN) {
        ctx.status = 400;
        ctx.body = {'error': 'Invalid number format for user.'};
        return Promise.resolve();
    }
    if (item === NaN) {
        ctx.status = 400;
        ctx.body = {'error': 'Invalid number format for item.'};
        return Promise.resolve();
    }
    if (money === NaN) {
        ctx.status = 400;
        ctx.body = {'error': 'Invalid number format for money.'};
        return Promise.resolve();
    }
    try {
        const bid = await Bid.createBid(auction,user,item,money);
        ctx.set('bid', `${ctx.request.url}/${bid.id}`);
        ctx.status = 201;        
    } catch (error) {
        ctx.status = 400;
        ctx.body = {'error': error};
        return Promise.resolve();   
    }
});