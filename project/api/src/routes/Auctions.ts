import Router from 'koa-router';
import Item from '../db/Item';
import Auction from '../db/Auction';
import User from '../db/User';
import Bid from '../db/Bid';
import slugify from 'slugify';
import logger from '../services/Logger';
import AuctionMembership from '../db/AuctionMembership';

const router = new Router();

//Params: name, description (optional), location, url (optional), hidden (optional)
router.post('/', async (ctx: any) => {
    if(!ctx.isAuthenticated()) {
        ctx.status = 401;
        ctx.body = {'error': 'You are not logged in.'}
        return Promise.resolve();
    }
    const name = ctx.request.body.name;
    if(name === undefined || name === "") {
        ctx.body = {'error': `'name' is required. Got ${name} instead.`}
        ctx.status = 400;
        return Promise.resolve();
    };
    if(name.length > 255) {
        ctx.body = {'error': `'name' is too long. Max length is 255.`}
        ctx.status = 400;
        return Promise.resolve();
    };
    const location = ctx.request.body.location;
    if(location === undefined || location === "") {
        ctx.body = {'error': `'location' is required. Got ${location} instead.`}
    }
    const url = ctx.request.body.url || slugify(ctx.request.body.name, {
        lower: true,
        remove: /[^\w ]/g
    });
    const existing = await Auction.urlExists(url);
    if(existing) {
        ctx.body = {'error': `An auction with url ${url} already exists.`};
        ctx.status = 400;
        return Promise.resolve();
    }
    const newAuction = await Auction.createAuction(name, ctx.request.body.description, location, ctx.state.user, url, ctx.request.body.hidden || true)
    ctx.status = 201;
    ctx.set('Location', ctx.request.url + '/' + newAuction.url);
    return Promise.resolve();
});

router.get('Public Auctions', '/', async (ctx: any) => {
    const objects = await Auction.fromDatabasePublicAuctions();
    const json = objects.map(it => it.toJson());
    ctx.body = [...json];
    ctx.status = 200;
    return Promise.resolve();
});

router.get('/:auction/@me', async (ctx: any) => {
    if(!ctx.isAuthenticated()) {
        ctx.status = 401;
        ctx.body = {'error': 'You are not logged in.'}
        return Promise.resolve();
    }
    const auction = await Auction.fromDatabaseURL(ctx.params.auction);
    ctx.request.body = {'administrator': ctx.user.id === auction.owner.id}
    ctx.status = 200;
    return Promise.resolve();
});

router.get('Item List', '/:auction/items', async (ctx: any) => { //I have to declare this so ts is happy.
    if(!ctx.isAuthenticated()) {
        ctx.status = 401;
        ctx.body = {'error': 'You are not logged in.'}
        return Promise.resolve();
    }
    const user = ctx.state.user;
    const auction = await Auction.fromDatabaseURL(ctx.params.auction);
    const members = await auction.members;
    const member = members.some(it => it.user.id === user.id);
    if(!member && auction.hidden) {
        ctx.status = 403;
        ctx.body = {'error': 'You do not have access to this auction.'}
        return Promise.resolve();
    }
    const items = await Item.fromDatabaseAuctionPaginated(auction.id, ctx.query.page !== undefined ? ctx.query.page : 1);
    ctx.body = items.map(it => it.toJson());
    ctx.status = 200;
    return Promise.resolve()
});

router.get('Auction Detail', '/:auction', async (ctx: any) => {
    let auction : Auction;
    const user : User = ctx.state.user;
    try{
        auction = await Auction.fromDatabaseURL(ctx.params.auction);
    }
    catch(ex) {
        ctx.status = 404;
    }
    if(auction.hidden) {
        if(!ctx.isAuthenticated()) {
            ctx.status = 401;
            ctx.body = {'error': 'You do not have access to this auction.'};
            return Promise.resolve();
        }
        const member = await AuctionMembership.isMember(user.id, auction.id);
        if(!member) {
            ctx.status = 403;
            ctx.body = {'error': 'You do not have access to this auction.'};
            return Promise.resolve();
        }
    }
    const res = auction.toJson();
    // TODO: Perm Check.
    if(user === undefined || user.id !== auction.owner.id) {
        delete res['invite_code'];
    }
    ctx.body = res;
    ctx.status = 200;
    return Promise.resolve();
});

router.get('Item List', '/:auction/items/all', async (ctx: any) => { //I have to declare this so ts is happy.
    if(!ctx.isAuthenticated()) {
        ctx.status = 401;
        ctx.body = {'error': 'You are not logged in.'}
        return Promise.resolve();
    }
    const user : User = ctx.state.user;
    const auction = await Auction.fromDatabaseURL(ctx.params.auction);
    const member = await AuctionMembership.isMember(user.id, auction.id);
    if(!member) {
        ctx.status = 403;
        ctx.body = {'error': 'You do not have access to this auction.'}
        return Promise.resolve();
    }
    const items = await Item.fromDatabaseAuction(auction.id);
    ctx.body = items.map(it => it.toJson());
    ctx.status = 200;
    return Promise.resolve()
});

router.post('Create Item', '/:auction/items', async (ctx: any) => {
    if(!ctx.isAuthenticated()) {
        ctx.status = 401;
        ctx.body = {'error': 'You are not logged in.'}
        return Promise.resolve();
    }
    const user = ctx.request.user;
    const auction = await Auction.fromDatabaseURL(ctx.params.auction);
    // TODO: Perm Check.
    if(auction.owner.id !== user.id) {
        ctx.status = 403;
        ctx.body = {'error': 'You are not allowed to create items on this auction.'};
        return Promise.resolve();
    }
    //TODO: Validate.
    if(ctx.request.body.silent) {
        const item = await auction.addSilentItem(ctx.request.body.name, ctx.request.body.description, ctx.request.body.imagePath, ctx.request.body.startingPrice, ctx.request.body.bidIncrement);
        ctx.set('Location', ctx.request.url + '/' + item.id);
    }
    else {
        const item = await auction.addLiveItem(ctx.request.body.name, ctx.request.body.description, ctx.request.body.imagePath, 0)
        ctx.set('Location', ctx.request.url + '/' + item.id);
    }
    ctx.status = 200;
    return Promise.resolve()
});

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\//\\//\\//\//\\//\\//\\//
router.get('Get Bids by Auction', '/:auctionID/bids', async (ctx:any) => {
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

router.get('Get Bids by Item', '/:auctionID/items/:itemID/bids', async (ctx:any) => {
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

router.get('Get Bids by User for an Auction', '/:auctionID/users/:userID/bids', async (ctx:any) =>{
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

router.get('Get Bids by User for an Item', '/:auctionID/users/:userID/items/:itemID/bids/highest', async (ctx:any) =>{
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


export default router;