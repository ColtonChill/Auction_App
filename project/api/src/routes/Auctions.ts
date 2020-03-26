import Router from 'koa-router';
import Item from '../db/Item';
import Auction from '../db/Auction';
import User from '../db/User';
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
})

export default router;