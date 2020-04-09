import Router from 'koa-router';
import Item from '../db/Item';
import Auction from '../db/Auction';
import User from '../db/User';
import Bid from '../db/Bid';
import slugify from 'slugify';
import logger from '../services/Logger';
import multer from '@koa/multer';
import AuctionMembership from '../db/AuctionMembership';
import fs from 'fs';
import path from 'path';
import mt from 'mime-types';

const router = new Router();
const upload = multer();

const auctionExists = async function(ctx: any) : Promise<boolean> {
    if(!ctx.isAuthenticated()) {
        ctx.status = 401;
        ctx.body = {'error': 'You are not logged in.'}
        return Promise.resolve(false);
    }
    const user = ctx.state.user;
    let auction;
    try{
        auction = await Auction.fromDatabaseURL(ctx.params.auction);
    }
    catch(ex) {
        ctx.status = 404;
        ctx.body = {'error': 'An auction with that URL does not exist.'};
        return Promise.resolve(false);
    }
    const membership = await AuctionMembership.getMembership(user, auction);
    if(auction.hidden && (membership === undefined || membership.banned === true)) {
        ctx.status = 403;
        ctx.body = {'error': 'You do not have access to that auction.'};
        return Promise.resolve(false);
    }
    return Promise.resolve(true);
}

const auctionPermCheck = async function (ctx: any) : Promise<boolean> {
    if(!ctx.isAuthenticated()) {
        ctx.status = 401;
        ctx.body = {'error': 'You are not logged in.'}
        return Promise.resolve(false);
    }
    const user = ctx.state.user;
    let auction;
    try{
        auction = await Auction.fromDatabaseURL(ctx.params.auction);
    }
    catch(ex) {
        ctx.status = 404;
        ctx.body = {'error': 'An auction with that URL does not exist.'};
        return Promise.resolve(false);
    }
    // TODO: Perm Check.
    if(auction.owner.id !== user.id) {
        ctx.status = 403;
        ctx.body = {'error': 'You are not allowed to modify this auction.'};
        return Promise.resolve(false);
    }
    ctx.state.auction = auction;
    return Promise.resolve(true);
}

//create auction
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
    const url = slugify(ctx.request.body.url, {
        lower: true,
        remove: /[^\w ]/g
    }) || slugify(ctx.request.body.name, {
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

/**@TODO Finish this fromdatabasepublicaustions() method
 */
//get list of public auctions
router.get('Public Auctions', '/', async (ctx: any) => {
    const objects = await Auction.fromDatabasePublicAuctions();
    const json = objects.map(it => it.toJsonPublic());
    ctx.body = [...json];
    ctx.status = 200;
    return Promise.resolve();
});

router.get('My Auctions', '/@mine', async (ctx: any) => {
    if(!ctx.isAuthenticated()) {
        ctx.status = 401;
        ctx.body = {'error': 'You are not logged in.'}
        return Promise.resolve();
    }
    const user : User = ctx.state.user;
    const memberships = await AuctionMembership.getUserMemberships(user);
    logger.info(memberships);
    const auctions = memberships.map(it => it.auction.toJsonPublic());
    ctx.body = auctions;
    ctx.status = 200;
    return Promise.resolve();
});

/** @TODO add error handeling
*/
//get auction info
router.get('Get Auction', '/:auction', async (ctx: any) => {
    if(!auctionExists(ctx)) {
        return Promise.resolve();
    }
    ctx.body = ctx.state.auction.toJson();
    ctx.status = 200;
    return Promise.resolve();
});

//check if @me is administator of auction
router.get('/:auction/@me', async (ctx: any) => {
    if(!ctx.isAuthenticated()) {
        ctx.status = 401;
        ctx.body = {'error': 'You are not logged in.'}
        return Promise.resolve();
    }
    const auction = await Auction.fromDatabaseURL(ctx.params.auction);
    ctx.body = {'administrator': ctx.req.user.id === auction.owner.id}
    ctx.status = 200;
    return Promise.resolve();
});

//List all the items of an auction
router.get('Item List', '/:auction/items', async (ctx: any) => { //I have to declare this so ts is happy.
    // const objects = await Auction.fromDatabasePublicAuctions();
    // const json = objects.map(it => it.toJson());
    // ctx.body = [...json];
    // ctx.status = 200;
    // return Promise.resolve();
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
    console.log("item size from route: "+items.length);
    console.log(items);
    const json = items.map(it => it.toJson());
    ctx.body = [...json];
    ctx.status = 200;
    return Promise.resolve()
});

//List the details of an auction
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

router.post('Auction Toggle Privacy', '/:auction/toggle-privacy', async (ctx: any) => {
    if(!(await auctionPermCheck(ctx))) {
        return Promise.resolve();
    }
    const auction : Auction = ctx.state.auction;
    console.log(auction);
    await auction.togglePrivacy();
    await auction.save();
    ctx.body = auction.toJson();
    ctx.status = 200;
    return Promise.resolve();
});

router.post('Auction Regen Invite Code', '/:auction/regen-code', async (ctx: any) => {
    if(!(await auctionPermCheck(ctx))) {
        return Promise.resolve();
    }
    const auction : Auction = ctx.state.auction;
    await auction.resetPin();
    await auction.save();
    ctx.body = auction.toJson();
    ctx.status = 200;
    return Promise.resolve();
})

router.put('Auction Edit', '/:auction', async (ctx: any) => {
    if(!(await auctionPermCheck(ctx))) {
        return Promise.resolve();
    }
    const auction: Auction = ctx.state.auction;
    const data = ctx.request.body;
    if(data.name !== undefined && data.name !== auction.name) {
        auction.name = data.name;
    }
    if(data.description !== undefined && data.description !== auction.description) {
        auction.description = data.description;
    }
    if(data.location !== undefined && data.location !== auction.location) {
        auction.location = data.location;
    }
    const url = data.url !== undefined ? slugify(data.url, {
        lower: true,
        remove: /[^\w ]/g,
    }) : undefined;
    if(url !== undefined && url !== auction.url) {
        auction.url = data.url;
    }
    await auction.save();
    ctx.body = auction.toJson();
    ctx.status = 200;
    return Promise.resolve();
});

//
router.get('Auction membership','/:auction/member/@me/', async (ctx:any)=>{
    if(!ctx.isAuthenticated()) {
        ctx.status = 401;
        ctx.body = {'error': 'You are not logged in.'}
        return Promise.resolve();
    }
    if(Auction.urlExists(ctx.params.auction)){
        try {
        const auction = await Auction.fromDatabaseURL(ctx.params.auction);
        const membership = await AuctionMembership.getMembership(ctx.req.user,auction);
        ctx.status = 400;
        ctx.body = membership.toJson();
        return Promise.resolve();
        } catch (error) {
            ctx.status = 401;
            ctx.body = {'error': 'No membership found: '+error}
            return Promise.resolve();
        }
    }else{
        ctx.status = 401;
        ctx.body = {'error': 'Auction is not found'}
        return Promise.resolve();
    }
    
});

router.post('/:auction/member/@me/', async (ctx:any)=>{
    if(!ctx.isAuthenticated()) {
        ctx.status = 401;
        ctx.body = {'error': 'You are not logged in.'}
        return Promise.resolve();
    }
    if(Auction.urlExists(ctx.params.auction)){
        const auction = await Auction.fromDatabaseURL(ctx.params.auction);
        if(auction.hidden){
            console.log("LOG_body: "+ctx.request.body.pin);
            if(ctx.request.body.pin == undefined){
                ctx.status = 401;
                ctx.body = {'error': 'No password provided'}
                return Promise.resolve();
            }
            console.log(auction.pin);
            if(ctx.request.body.pin != auction.pin){
                ctx.status = 401;
                ctx.body = {'error': 'Invalid password'}
                return Promise.resolve();
            }
        }
        const exitsingMembership = await AuctionMembership.getMembership(ctx.req.user,auction);
        if(exitsingMembership == undefined){
            const membership = await AuctionMembership.createMembership(ctx.req.user,auction);
            ctx.status = 201;
            ctx.body = membership.toJson();
            return Promise.resolve();
        }else{
            ctx.status = 400;
            ctx.body = {'error': 'User already a member of auction'}
            return Promise.resolve();
        }
    }else{
        ctx.status = 404;
        ctx.body = {'error': 'Auction is not found'}
        return Promise.resolve();
    }
    
});

router.post('Add Item Image', '/:auction/item-image', upload.single('image'), async (ctx: any) => {
    const item = await Item.fromDatabaseId(ctx.request.body['itemId']);
    if(item.auction.url !== (ctx.params.auction)) {
        ctx.status = 404;
        ctx.body = {'error': 'An item does not exist with that ID on this auction.'}
        return Promise.resolve();
    }
    fs.mkdirSync(path.join('/user', item.auction.url));
    fs.writeFileSync(path.join('/user', item.auction.url, ctx.request.body['itemId'] + "." + mt.extension(ctx.request.file.mimetype)), ctx.file.buffer);
    ctx.status = 200;
});

router.get('Item Detail', '/:auction/items/:item', async (ctx: any) => {
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
    const item = await Item.fromDatabaseId(ctx.params.item);
    if(item.auction.url !== (ctx.params.auction)) {
        ctx.status = 404;
        ctx.body = {'error': 'An item does not exist with that ID on this auction.'}
        return Promise.resolve();
    }
    ctx.body = await item.toJsonDetailed();
    ctx.status = 200;
    return Promise.resolve()
});

router.post('Create Item', '/:auction/items', async (ctx: any) => {
    if(!ctx.isAuthenticated()) {
        ctx.status = 401;
        ctx.body = {'error': 'You are not logged in.'}
        return Promise.resolve();
    }
    const user = ctx.state.user;
    let auction;
    try {
        auction = await Auction.fromDatabaseURL(ctx.params.auction);
    } catch (ex) {
        if(ex.name === "InvalidKeyError") {
            ctx.status = 404;
            ctx.body = {'error': "No auction exists with that ID."};
            return Promise.resolve();
        }
    }
    // TODO: Perm Check.
    if(ctx.req.user.id != auction.owner.id) {
        ctx.status = 403;
        ctx.body = {'error': 'You are not allowed to create items on this auction.'};
        return Promise.resolve();
    }
    //TODO: Validate.
    console.log(ctx.request.body.silent);
    if(ctx.request.body.silent) {
        const item = await auction.addSilentItem(ctx.request.body.name, ctx.request.body.description, ctx.request.body.imagePath, ctx.request.body.startingPrice, ctx.request.body.bidIncrement);
        console.log(item);
        ctx.set('Location', ctx.request.url + '/' + item.id);
    }
    else {
        const item = await auction.addLiveItem(ctx.request.body.name, ctx.request.body.description, ctx.request.body.imagePath, 0)
        console.log(item);
        ctx.set('Location', ctx.request.url + '/' + item.id);
    }
    ctx.status = 200;
    return Promise.resolve()
});

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\//\\//\\//\//\\//\\//\\//
router.get('Get Bids by Auction', '/:auctionURL/bids', async (ctx:any) => {
    console.log("FIRST option");
    if(!ctx.isAuthenticated()) {
        ctx.status = 401;
        ctx.body = {'error': 'You are not logged in.'}
        return Promise.resolve();
    }
    if(ctx.params.auctionURL === undefined||ctx.params.auctionURL == ""){
        ctx.status=400;
        ctx.body={'error':`'auctionID' is required, Got ${ctx.params.auctionURL} instead.`}
        return Promise.resolve();
    }
    try {
        const dbAuction = await Auction.fromDatabaseURL(ctx.params.auctionURL)
        const res = await Bid.fromDatabaseAuction(dbAuction.id);
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

router.get('Get Bids by User for an Item', '/:auctionURL/items/:itemID/bids/highest', async (ctx:any) =>{
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
    if(ctx.req.user.id === undefined||ctx.req.user.id == ""){
        ctx.status=400;
        ctx.body={'error':`'User' is required, Got ${ctx.params.userID} instead.`}
        return Promise.resolve();
    }
    try {
        console.log("try block");
        const res = await Bid.DatabaseItemUserFirst(ctx.params.itemID,ctx.req.user.id);
        if(res !== undefined) {
            ctx.body = res;
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

router.post('Place bid', '/:auction/items/:item/bid', async (ctx:any) => {
    if(!ctx.isAuthenticated()) {
        ctx.status = 401;
        ctx.body = {'error': 'You are not logged in.'}
        return Promise.resolve();
    }
    const data = ctx.request.body;
    console.log("auction "+ctx.params.auction);
    console.log("user "+ctx.req.user);
    console.log("item "+ctx.params.item);
    console.log("money "+data.money);
    if(data === undefined) {
        ctx.status = 400;
        ctx.body = {'error': 'No data sent.'};
        return Promise.resolve();
    }
    if(ctx.params.auction == undefined) {
        ctx.status = 400;
        ctx.body = {'error': 'No Auction specified.'};
        return Promise.resolve();
    }
    if(ctx.req.user == undefined) {
        ctx.status = 400;
        ctx.body = {'error': 'No User specified.'}
        return Promise.resolve();
    }
    if(ctx.params.item == undefined) {
        ctx.status = 400;
        ctx.body = {'error': 'No Item specified.'}
        return Promise.resolve();
    }

    try {
        var dbAuction = await Auction.fromDatabaseURL(ctx.params.auction);
    } catch (error) {
        ctx.status = 400;
        ctx.body = {'error': `${error}`};
        return Promise.resolve();
    }
    let auction = dbAuction.id;
    let user = parseInt(ctx.req.user.id);
    let item = parseInt(ctx.params.item);
    let money = 0;

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
    if(data.money === undefined) {//TODO: how do I check if it is a SilentItem
        ctx.status = 400;
        ctx.body = {'error': 'No Money specified.'}
        return Promise.resolve();
    }else{
        money = parseInt(data.money);
    }
    if (money === NaN) {
        ctx.status = 400;
        ctx.body = {'error': 'Invalid number format for money.'};
        return Promise.resolve();
    }
    const membership = await AuctionMembership.isMember(user,auction);
    if(!membership){
        ctx.status = 400;
        ctx.body = {'error': "Not a member of this auction"};
        return Promise.resolve();   
    }
    try {
        console.log("bid auction: "+typeof(auction)+auction)
        console.log("bid user: "+typeof(user)+user)
        console.log("bid item: "+typeof(item)+item)
        console.log("bid money: "+typeof(money)+money);
        
        const bid = await Bid.createBid(auction,user,item,money);
        ctx.set('bid', `${ctx.request.url}/${bid.id}`);
        ctx.status = 201;        
    } catch (error) {
        ctx.status = 400;
        ctx.body = {'error': error};
        return Promise.resolve();   
    }
});


router.delete('Delete Item', '/:auction/items/:item', async (ctx: any) => {
    if(!ctx.isAuthenticated()) {
        ctx.status = 401;
        ctx.body = {'error': 'You are not logged in.'}
        return Promise.resolve();
    }
    const user = ctx.state.user;
    const auction = await Auction.fromDatabaseURL(ctx.params.auction);
    // TODO: Perm Check.
    if(auction.owner.id !== user.id) {
        ctx.status = 403;
        ctx.body = {'error': 'You are not allowed to modify items on this auction.'};
        return Promise.resolve();
    }
    const item = await Item.fromDatabaseId(ctx.params.item);
    if(item.auction.id !== ctx.params.auction) {
        ctx.status = 404;
        ctx.body = {'error': 'An item does not exist with that ID on this auction.'}
        return Promise.resolve();
    }
    await item.delete()
    ctx.status = 200;
    return Promise.resolve()
});

router.put('Modify Item', '/:auction/items/:item', async (ctx: any) => {
    if(!ctx.isAuthenticated()) {
        ctx.status = 401;
        ctx.body = {'error': 'You are not logged in.'}
        return Promise.resolve();
    }
    const user = ctx.state.user;
    const auction = await Auction.fromDatabaseURL(ctx.params.auction);
    // TODO: Perm Check.
    if(auction.owner.id !== user.id) {
        ctx.status = 403;
        ctx.body = {'error': 'You are not allowed to modify items on this auction.'};
        return Promise.resolve();
    }
    const item = await Item.fromDatabaseId(ctx.params.item);
    if(item.auction.id !== ctx.params.auction) {
        ctx.status = 404;
        ctx.body = {'error': 'An item does not exist with that ID on this auction.'}
        return Promise.resolve();
    }
    const data = ctx.request.body;
    if(data['name'] !== undefined && data['name'] !== "") {
        item.name = data.name;
    } 
    if(data.description !== undefined && data.description !== "") {
        item.description = data.description;
    }
    if(data.imagePath !== undefined && data.imagePath !== "") {
        item.imageName = data.imageName;
    }
    await item.save();
    ctx.body = await item.toJsonDetailed();
    ctx.status = 200;
    return Promise.resolve()
});

export default router;