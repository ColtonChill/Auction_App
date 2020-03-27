const koa = require("koa");
const router = require("koa-router");
const bodyParser = require("koa-bodyparser");
import Bid from "../db/Bid";
import InvalidKeyError from "../db/InvalidKeyError";


/**
 * @TODO Ask Hunter what the heck @me/bid is supost to mean?
 */
router.get('Get a Bid by ID', '/bids/:id', async (ctx:any) => {
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

router.get('Get Bids by Auction', '/bids/:auctionID', async (ctx:any) => {
    if(!ctx.isAuthenticated()) {
        ctx.status = 401;
        ctx.body = {'error': 'You are not logged in.'}
        return Promise.resolve();
    }
    if(ctx.params.auctionID === undefined||ctx.params.auctionID == ""){
        ctx.status=400;
        ctx.body={'error':`'auctionID' is required, Got ${ctx.params.auctionID} instead.`}
        return Promise.resolve();
    }
    try {
        const res = await Bid.fromDatabaseAuction(ctx.params.auctionID);
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

router.get('Get Bids by User', '/bids/users/:userID/', async (ctx:any) => {
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
        const res = await Bid.fromDatabaseUser(ctx.params.userID);
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

router.get('Get Bids by Item', '/bids/auctions/:auctionID/items/:itemID', async (ctx:any) => {
    if(!ctx.isAuthenticated()) {
        ctx.status = 401;
        ctx.body = {'error': 'You are not logged in.'}
        return Promise.resolve();
    }
    if(ctx.params.itemID === undefined||ctx.params.itemID == ""){
        ctx.status=400;
        ctx.body={'error':`'item.id' is required, Got ${ctx.param.itemID} instead.`}
        return Promise.resolve();
    }
    try {
        const res = await Bid.fromDatabaseItem(ctx.params.itemID);
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

router.get('Get Bids by User for an Auction', '/bids/auctions/:auctionID/users/:userID', async (ctx:any) =>{
    if(!ctx.isAuthenticated()) {
        ctx.status = 401;
        ctx.body = {'error': 'You are not logged in.'}
        return Promise.resolve();
    }
    if(ctx.params.auctionID === undefined||ctx.params.auctionID == ""){
        ctx.status=400;
        ctx.body={'error':`'auctionID' is required, Got ${ctx.params.auctionID} instead.`}
        return Promise.resolve();
    }
    if(ctx.params.userID === undefined||ctx.params.userID == ""){
        ctx.status=400;
        ctx.body={'error':`'User' is required, Got ${ctx.params.userID} instead.`}
        return Promise.resolve();
    }
    try {
        const res = await Bid.getDatabaseAuctionUser(ctx.params.auctionID,ctx.params.idUser);
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

router.get('Get Bids by User for an Item', '/bids/auctions/:auctionID/users/:userID/items/itemID/highest', async (ctx:any) =>{
    if(!ctx.isAuthenticated()) {
        ctx.status = 401;
        ctx.body = {'error': 'You are not logged in.'}
        return Promise.resolve();
    }
    if(ctx.params.itemID === undefined||ctx.params.itemID == ""){
        ctx.status=400;
        ctx.body={'error':`'itemID' is required, Got ${ctx.params.itemID} instead.`}
        return Promise.resolve();
    }
    if(ctx.params.userID === undefined||ctx.params.userID == ""){
        ctx.status=400;
        ctx.body={'error':`'User' is required, Got ${ctx.params.userID} instead.`}
        return Promise.resolve();
    }
    try {
        const res = await Bid.DatabaseItemUserFirst(ctx.params.auctionID,ctx.params.itemID);
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

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//
//Ask If the data needs to be in the parameters, or if they are in the ctx object
//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//
router.post('Place bid', '/bid/', async (ctx:any) => {
    if(!ctx.isAuthenticated()) {
        ctx.status = 401;
        ctx.body = {'error': 'You are not logged in.'}
        return Promise.resolve();
    }
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