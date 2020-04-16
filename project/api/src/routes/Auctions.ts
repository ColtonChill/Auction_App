import Router from 'koa-router';
import Item, { LiveItem, SilentItem } from '../db/Item';
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
    let auction;
    try{
        auction = await Auction.fromDatabaseURL(ctx.params.auction);
    }
    catch(ex) {
        ctx.status = 404;
        ctx.body = {'error': `An auction with the URL ${ctx.params.auction} does not exist.`};
        return Promise.resolve(false);
    }
    if(!ctx.isAuthenticated()) {
        ctx.status = 401;
        ctx.body = {'error': 'You are not logged in.'}
        return Promise.resolve(false);
    }
    const user = ctx.state.user;
    ctx.state.auction = auction;
    const membership = await AuctionMembership.getMembership(user, auction);
    ctx.state.membership = membership;
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
    const url = ctx.request.body.url ? slugify(ctx.request.body.url, {
        lower: true,
        remove: /[^\w ]/g
    }) : slugify(ctx.request.body.name, {
        lower: true,
        remove: /[^\w ]/g
    });
    const existing = await Auction.urlExists(url);
    if(existing) {
        ctx.body = {'error': `An auction with url ${url} already exists.`};
        ctx.status = 400;
        return Promise.resolve();
    }
    const newAuction = await Auction.createAuction(name, ctx.request.body.description, location, ctx.state.user, url, ctx.request.body.hidden !== undefined ? ctx.request.body.hidden : true)
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
    if(!(ctx.isAuthenticated())) {
        ctx.status = 401;
        ctx.body = {'error': 'You are not logged in.'}
        return Promise.resolve();
    }
    const user : User = ctx.state.user;
    const memberships = await AuctionMembership.getUserMemberships(user);
    logger.info(memberships);
    const auctions = memberships.reduce((a, it) => {
        if(it.banned !== true) {
            a.push(it.auction.toJsonPublic());
        }
        return a;
    }, []);
    ctx.body = auctions;
    ctx.status = 200;
    return Promise.resolve();
});

/** @TODO add error handeling
*/
//get auction info
router.get('Get Auction', '/:auction', async (ctx: any) => {
    if(!(await auctionExists(ctx))) {
        return Promise.resolve();
    }
    const auction = ctx.state.auction;
    ctx.body = auction.toJson();
    ctx.status = 200;
    return Promise.resolve();
});

router.get('Auction Members', '/:auction/members', async (ctx: any) => {
    if(!(await auctionPermCheck(ctx))) {
        return Promise.resolve();
    }
    let members = AuctionMembership.getAuctionMembers(ctx.state.auction);
    let individuals = (await members).reduce((a: Object[], i: AuctionMembership) => {
        if(!i.banned) {
            a.push(i.user.toJson());
        }
        return a;
    }, []);
    ctx.body = individuals;
    ctx.status = 200;
    return Promise.resolve();
});

router.post('Kick Member', '/:auction/members/:memberId/kick', async (ctx: any) => {
    if(!(await auctionPermCheck(ctx))) {
        return Promise.resolve();
    }
    let member = await User.fromDatabaseId(parseInt(ctx.params.memberId));
    let auction : Auction = ctx.state.auction;
    await auction.kick(member);
    ctx.status = 200;
});

router.post('Ban Member', '/:auction/members/:memberId/ban', async (ctx: any) => {
    if(!(await auctionPermCheck(ctx))) {
        return Promise.resolve();
    }
    let member = await User.fromDatabaseId(parseInt(ctx.params.memberId));
    let auction : Auction = ctx.state.auction;
    await auction.ban(member);
    ctx.status = 200;
});

//check if @me is administator of auction
router.get('/:auction/@me', async (ctx: any) => {
    if(!(await auctionExists(ctx))) {
        return Promise.resolve();
    }
    const auction = ctx.state.auction;
    ctx.body = {'administrator': ctx.req.user.id === auction.owner.id}
    ctx.status = 200;
    return Promise.resolve();
});

router.get('Auction Results', '/:auction/results', async (ctx: any) => {
    if(!(await auctionPermCheck(ctx))) {
        return Promise.resolve();
    }
    const auction = ctx.state.auction;
    const results = await Bid.fromDatabaseWinningBids(auction.id);
    ctx.body = results.map(it => it.toJsonDetailed());
    ctx.status = 200;
    return Promise.resolve(); 
})

router.get('Auction Commitment', '/:auction/commitment', async (ctx: any) => {
    if(!(await auctionPermCheck(ctx))) {
        return Promise.resolve();
    }
    const auction = ctx.state.auction;
    const results = await Bid.fromDatabaseCommitment(auction.id);
    ctx.body = results;
    ctx.status = 200;
    return Promise.resolve(); 
})

//List all the items of an auction
router.get('Item List', '/:auction/items', async (ctx: any) => { //I have to declare this so ts is happy.
    // const objects = await Auction.fromDatabasePublicAuctions();
    // const json = objects.map(it => it.toJson());
    // ctx.body = [...json];
    // ctx.status = 200;
    // return Promise.resolve();
    if(!(await auctionExists(ctx))) {
        return Promise.resolve();
    }
    const auction = ctx.state.auction;
    const user = ctx.state.user;
    const member = ctx.state.membership !== undefined;
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
    if(!(await auctionExists(ctx))) {
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
    const json = items.map(it => it.toJson());
    ctx.body = [...json];
    ctx.status = 200;
    return Promise.resolve()
});

//List the details of an auction
router.get('Auction Detail', '/:auction', async (ctx: any) => {
    if(!(await auctionExists(ctx))) {
        return Promise.resolve();
    }
    ctx.body = ctx.state.auction.toJsonPublic();
    ctx.status = 200;
    return Promise.resolve();
});

router.post('Auction Toggle Privacy', '/:auction/toggle-privacy', async (ctx: any) => {
    if(!(await auctionPermCheck(ctx))) {
        return Promise.resolve();
    }
    const auction : Auction = ctx.state.auction;
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

router.post('Auction Open', '/:auction/open', async (ctx:any) => {
    if(!(await auctionPermCheck(ctx))) {
        return Promise.resolve();
    }
    const auction: Auction = ctx.state.auction;
    const data = ctx.request.body;
    if(data.open === undefined) {
        ctx.status = 400;
        ctx.body = {'error': '\'open\' is required.'};
        return Promise.resolve();
    }
    auction.open = data.open;
    await auction.save();
    ctx.status = 200;
    ctx.body = auction.toJson();
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

//join auction
router.post('Join auction','/:auction/member/@me/', async (ctx:any)=>{
    if(!ctx.isAuthenticated()) {
        ctx.status = 401;
        ctx.body = {'error': 'You are not logged in.'}
        return Promise.resolve();
    }
    if(await Auction.urlExists(ctx.params.auction)){
        const auction = await Auction.fromDatabaseURL(ctx.params.auction);
        if(auction.hidden){
            if(ctx.request.body.pin == undefined){
                ctx.status = 400;
                ctx.body = {'error': 'No code provided'}
                return Promise.resolve();
            }
            if(ctx.request.body.pin != auction.pin){
                ctx.status = 400;
                ctx.body = {'error': 'Invalid code'}
                return Promise.resolve();
            }
        }
        const exitsingMembership = await AuctionMembership.getMembership(ctx.req.user,auction);
        if(exitsingMembership === undefined || exitsingMembership === null){
            const membership = await AuctionMembership.createMembership(ctx.req.user,auction);
            ctx.status = 201;
            ctx.body = membership.toJson();
            return Promise.resolve();
        }else{
            if(exitsingMembership.banned === true) {
                ctx.status = 400;
                ctx.body = {'error': 'You are banned from this auction.'}
                return Promise.resolve();
            } else {
                ctx.status = 200;
                return Promise.resolve();
            }
        }
    }else{
        ctx.status = 404;
        ctx.body = {'error': 'Auction is not found'}
        return Promise.resolve();
    }
    
});

// //join auction via QR code
// router.post('Join auction','/:auction/join', async (ctx:any)=>{
//     // console.log("log: "+ctx.query.code);
//     // ctx.status = 401;
//     // ctx.body = {'error': `${ctx.request.code}`}
//     // return Promise.resolve();
//     if(!ctx.isAuthenticated()) {
//         ctx.status = 401;
//         ctx.body = {'error': 'You are not logged in.'}
//         return Promise.resolve();
//     }
//     if(await Auction.urlExists(ctx.params.auction)){
//         const auction = await Auction.fromDatabaseURL(ctx.params.auction);
//         if(auction.hidden){
//             if(ctx.request.body.pin == undefined){
//                 ctx.status = 401;
//                 ctx.body = {'error': 'No password provided'}
//                 return Promise.resolve();
//             }
//             if(ctx.query.code != auction.pin){
//                 ctx.status = 401;
//                 ctx.body = {'error': 'Invalid password'}
//                 return Promise.resolve();
//             }
//         }
//         const exitsingMembership = await AuctionMembership.getMembership(ctx.req.user,auction);
//         if(exitsingMembership == undefined){
//             const membership = await AuctionMembership.createMembership(ctx.req.user,auction);
//             ctx.status = 201;
//             ctx.body = membership.toJson();
//             return Promise.resolve();
//         }else{
//             ctx.status = 400;
//             ctx.body = {'error': 'User already a member of auction'}
//             return Promise.resolve();
//         }
//     }else{
//         ctx.status = 404;
//         ctx.body = {'error': 'Auction is not found'}
//         return Promise.resolve();
//     }
// });

router.post('Add Item Image', '/:auction/item-image', upload.single('image'), async (ctx: any) => {
    const item = await Item.fromDatabaseId(ctx.request.body['itemId']);
    if(item.auction.url !== (ctx.params.auction)) {
        ctx.status = 404;
        ctx.body = {'error': 'An item does not exist with that ID on this auction.'}
        return Promise.resolve();
    }
    if(!fs.existsSync(path.join('/user', item.auction.url))) {
        fs.mkdirSync(path.join('/user', item.auction.url));
    }
    fs.writeFileSync(path.join('/user', item.auction.url, ctx.request.body['itemId'] + "." + mt.extension(ctx.request.file.mimetype)), ctx.file.buffer);
    item.imageName = item.id + '.' + mt.extension(ctx.request.file.mimetype);
    await item.save();
    ctx.status = 200;
});

router.get('Item Detail', '/:auction/items/:item', async (ctx: any) => {
    if(!(await auctionExists(ctx))) {
        return Promise.resolve();
    }
    const user : User = ctx.state.user;
    const auction = ctx.state.auction;
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
    if(!(await auctionExists(ctx))) {
        return Promise.resolve();
    }
    const user : User = ctx.state.user;
    const auction = ctx.state.auction;
    //TODO: Validate.
    if(ctx.request.body.silent) {
        const item = await auction.addSilentItem(ctx.request.body.name, ctx.request.body.description, ctx.request.body.imagePath, ctx.request.body.startingPrice, ctx.request.body.bidIncrement);
        ctx.body = item.toJson();
        ctx.set('Location', ctx.request.url + '/' + item.id);
    }
    else {
        const item = await auction.addLiveItem(ctx.request.body.name, ctx.request.body.description, ctx.request.body.imagePath, 0)
        ctx.body = item.toJson();
        ctx.set('Location', ctx.request.url + '/' + item.id);
    }
    ctx.status = 200;
    return Promise.resolve()
});

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\//\\//\\//\//\\//\\//\\//
router.get('Get Bids by Auction', '/:auctionURL/bids', async (ctx:any) => {
    if(!(await auctionExists(ctx))) {
        return Promise.resolve();
    }
    const user : User = ctx.state.user;
    const auction = ctx.state.auction;
    const res = await Bid.fromDatabaseAuction(auction.id);
    if(res !== undefined) {
        ctx.body = res.map(it => it.toJson());
        ctx.status = 200;
        return Promise.resolve();
    }else{
        ctx.status = 404;
        ctx.body = {'error': 'Query returned undefined.'}
        return Promise.resolve();
    }
});

router.get('Get Bids by Item', '/:auction/items/:itemID/bids', async (ctx:any) => {
    if(!(await auctionExists(ctx))) {
        return Promise.resolve();
    }
    const auction = ctx.state.auction;
    const user = ctx.state.user;
    if(ctx.params.itemID === undefined||ctx.params.itemID == ""){
        ctx.status=400;
        ctx.body={'error':`'item.id' is required, Got ${ctx.param.itemID} instead.`}
        return Promise.resolve();
    }
    const item = await Item.fromDatabaseId(ctx.params.itemID);
    if(item.auction.id !== auction.id) {
        ctx.status = 404;
        ctx.body = {'error': 'An item with that ID does not exist on this auction.'}
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
            ctx.body = {'error': 'Query returned undefined.'}
            return Promise.resolve();
        }
    } catch (error) {
        ctx.status = 404;
        ctx.body = {'error': `Query failed with error: ${error}`}
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
    const isAuction = await Auction.urlExists(ctx.params.auctionURL)
    if(!isAuction){
        ctx.status=400;
        ctx.body={'error':`'Auction "${ctx.params.auctionURL}" is not found`}
        return Promise.resolve();
    }
    const auction = await Auction.fromDatabaseURL(ctx.params.auctionURL);
    try {
        const res = await Bid.DatabaseItemFirst(ctx.params.itemID,auction.id);
        if(res !== undefined) {
            ctx.body = res;
            ctx.status = 200;
            return Promise.resolve();
        }else{
            ctx.status = 404;
            ctx.body = {'error': 'Query returned undefined.'}
            return Promise.resolve();
        }
    } catch (error) {
        ctx.status = 404;
        ctx.body = {'error': `Query failed with error: ${error}`}
        return Promise.resolve();
    }
});

router.post('Place bid', '/:auction/items/:item/bid', async (ctx:any) => {
    if(!(await auctionExists(ctx))) {
        return Promise.resolve();
    }
    const data = ctx.request.body;
    if(data === undefined) {
        ctx.status = 400;
        ctx.body = {'error': 'No data sent.'};
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

    const auction = ctx.state.auction;
    if(!auction.open) {
        ctx.status = 400;
        ctx.body = {'error': 'You cannot bid on this auction because it is closed.'}
        return Promise.resolve();
    }
    let user = parseInt(ctx.req.user.id);
    let item = parseInt(ctx.params.item);
    let money = 0;

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
    if(data.money === undefined) {
        //look up bid increment
        const itemOb = await Item.fromDatabaseId(item);
        if(itemOb.auction.id !== auction.id) {
            ctx.status = 404;
            ctx.body = {'error': 'An item with that ID does not exist on this auction.'};
            return Promise.resolve();
        }
        const amount = itemOb.toJson()['bid_increment'];
        const highest = (await Bid.DatabaseItemFirst(item,auction.id)).money;
        const bid = await Bid.createBid(auction.id,user,item,amount+highest);
        ctx.set('bid', `${ctx.request.url}/${bid.id}`);
        ctx.body = {"responce" : `Auto bid, ${amount+highest} implemented`};
        ctx.status = 201;        
        return Promise.resolve();
        // try {
        //     console.log("Log silentItem: atempted");
        //     const itemOb = await SilentItem.fromDatabaseId(item);
        //     console.log("Log silentItem: Passed");
        //     console.log(itemOb.toJson());
        // } catch (error) {// ctx.request.body.bidIncrement
        //     try {
        //         console.log("Log silentItem: Failed");    
        //         console.log("Log liveItem: atempted");
        //         const itemOb = await SilentItem.fromDatabaseId(item);
        //         console.log("Log liveItem: Passed");   
        //         console.log(itemOb.toJson());   
        //     } catch (error) {
        //         ctx.status = 400;
        //         ctx.body = {'error': 'No Money specified and no item found.'}
        //         return Promise.resolve();
        //     }        
        // }

        // try {
        //     console.log("Log liveItem: atempted");
        //     const itemOb = await LiveItem.fromDatabaseId(item);
        //     console.log("Log liveItem: Passed");
        //     console.log(itemOb.toJson());   
        // } catch (error) {// ctx.request.body.bidIncrement
        //     try {
        //         console.log("Log liveItem: Failed"); 
        //         console.log("Log silentItem: atempted");
        //         const itemOb = await SilentItem.fromDatabaseId(item);
        //         console.log("Log silentItem: Passed");
        //         console.log(itemOb.toJson());   
        //     } catch (error) {
        //         ctx.status = 400;
        //         ctx.body = {'error': 'No Money specified and no item found.'}
        //         return Promise.resolve();
        //     }        
        // }
    }else{
        money = parseInt(data.money);
    }
    if (money === NaN) {
        ctx.status = 400;
        ctx.body = {'error': 'Invalid number format for money.'};
        return Promise.resolve();
    }
    const membership = await AuctionMembership.isMember(user,auction.id);
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
        
        const bid = await Bid.createBid(auction.id,user,item,money);
        ctx.set('bid', `${ctx.request.url}/${bid.id}`);
        ctx.status = 201;        
    } catch (error) {
        ctx.status = 400;
        ctx.body = {'error': error};
        return Promise.resolve();   
    }
});


router.delete('Delete Item', '/:auction/items/:item', async (ctx: any) => {
    if(!(auctionPermCheck(ctx))) {
        return Promise.resolve();
    }
    const user = ctx.state.user;
    const auction = ctx.state.auction;
    const item = await Item.fromDatabaseId(ctx.params.item);
    if(item.auction.url !== ctx.params.auction) {
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
    if(item.auction.url !== (ctx.params.auction)) {
        ctx.status = 404;
        ctx.body = {'error': 'An item does not exist with that ID on this auction.'}
        return Promise.resolve();
    }
    // @ts-ignore
    const live = item.winner !== undefined ? true : false;
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
    if(live && typeof data.winner === 'number' && data.winner !== undefined) {
        const user = await User.fromDatabaseId(data.winner);
        let membership: AuctionMembership = undefined;
        try {
            membership = await AuctionMembership.getMembership(user, auction);
        }
        catch (_) { }
        if(membership !== undefined && membership !== null) {
            // @ts-ignore
            item.winner = user;
        }
    }
    await item.save();
    ctx.body = await item.toJsonDetailed();
    ctx.status = 200;
    return Promise.resolve()
});

export default router;