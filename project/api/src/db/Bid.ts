import Auction from "./Auction";
import User from "./User";
import Item from "./Item";
import AuctionMembership from "./AuctionMembership";
import { connection } from "../services/Database";
import InvalidKeyError from "./InvalidKeyError";

interface Commitment {
    user: Object,
    amount: number
};

/**
 * some way to represent a "bid" in our database.
 * 
 * @author Hunter Henrichsen
 */
export default class Bid {
    private _id: number;
    private _auction: Auction;
    private _user: User;
    private _item: Item;
    private _money: number;
    private _time: number;
    private _dirty: boolean;

    /**
     * Constructor.
     * 
     * @param id The database id of this item.
     * @param auction The auction to which this bid is associated with.
     * @param user The name of the User who placed the bid.
     * @param money The amount the bid was place at.
     * @param time The time the bid was placed.
     */
    private constructor(id: number, auction: Auction, user: User, item: Item, money: number, time: number) {
        this._id = id;
        this._auction = auction;
        this._user = user;
        this._item = item;
        this._money = money;
        this._time = time;
        this._dirty = false;
    }

    public static async createBid(id_auction: number, id_user: number, id_item: number, money: number) : Promise<Bid> {
        const auction = await Auction.fromDatabaseID(id_auction);
        const user = await User.fromDatabaseId(id_user);
        const item = await Item.fromDatabaseId(id_item); 
        const isMember = await AuctionMembership.isMember(user.id,auction.id);
        const dbReturn = await connection('bids').where({'item': item.id}).select('money').orderBy("time","desc").first();
        //const dbReturn = await connection('bids').where({'item': item.id}).select('item','money').orderBy("time").first();
        if(!isMember){
            return Promise.reject(new InvalidKeyError(`Invalid membership, user ${user.id} is not a member of ${auction.id} auction.`))
        }
        if(dbReturn === undefined||dbReturn['money']<money){
            let d = new Date();
            const dbObject = await connection('bids').insert({
                'auction': auction.id,
                'user' : user.id,
                'item' : item.id,
                'money' : money,
                'time' : d.valueOf()
            }).returning('*');
            return this.fromObject(dbObject[0]);
        }
        return Promise.reject(new InvalidKeyError(`Invalid bid, please increase the amount`))
    }


    //\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//
    //  Queires
    //\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//
   
    /**
     * Gets an bid out of the database based on its ID.
     * 
     * @param id The ID of the bid to lookup.
     */
    public static async fromDatabaseId(id: number) : Promise<Bid> {
        const res = await connection('bids').where({id})
        if(res.length !== 1) {
            return Promise.reject(new InvalidKeyError(`No Item exists with the id ${id}.`))
        }
        return Promise.resolve(this.fromObject(res[0]));
    }

    public static async fromDatabaseWinningBids(auction: number) : Promise<Bid[]> {
        const res = await connection('bids').where({auction}).orderBy('money', 'desc');
        let uniqueItems = Array<number>();
        let results = [];
        for (let it of res) {
            if(uniqueItems.indexOf(it.item) === -1) {
                uniqueItems.push(it.item);
                results.push((await this.fromObject(it)));
            }
        }
        return results;
    }
    
    public static async fromDatabaseCommitment(auction: number) : Promise<Commitment[]> {
        const res = await connection('bids').where({auction}).orderBy('money', 'desc');
        let uniqueItems = Array<number>();
        let results = {};
        for (let it of res) {
            if(uniqueItems.indexOf(it.item) === -1) {
                uniqueItems.push(it.item);
                if(results[it.user] !== undefined) {
                    results[it.user] += it.money;
                }
                else {
                    results[it.user] = it.money;
                }
            }
        }
        return Promise.all(Object.keys(results).map(async it => {
            return {
                user: await (await User.fromDatabaseId(parseInt(it))).toJson(),
                amount: results[it]
            }
        }));
    }
    /**
     * Get the bid of all items associated with an auction.
     *  
     * @param auction The auction to look bids up on.
     */
    public static async fromDatabaseAuction(id: Number) : Promise<Bid[]> {
        const auction = await Auction.fromDatabaseID(id); 
        return connection('bids')
            .where({'auction': auction.id})
            .then(objects => Promise.all(objects.map(this.fromObject)));
    }

    /**
     * Get the bids of all items associated with a user.
     *  
     * @param user The user to look bids up on.
     */
    public static async fromDatabaseUser(id: Number) : Promise<Bid[]> {
        const user = await User.fromDatabaseId(id);
        return connection('bids')
            .where({'user': user.id})
            .then(objects => Promise.all(objects.map(this.fromObject)));
    }

    /**
     * Get the bid of an items.
     * @param item The item to look bids up on.
     */
    public static async fromDatabaseItem(id: number) : Promise<Bid[]> {
        const item = await Item.fromDatabaseId(id);
        return connection('bids')
            .where({'item': item.id})
            .then(objects => Promise.all(objects.map(this.fromObject)));
    }

    public static async getWinningBid(itemId: number) : Promise<Bid> {
        const dbObject = await connection('bids')
            .where({'item': itemId})
            .orderBy('money', 'desc')
            .first();
        if(dbObject !== undefined) {
            return this.fromObject(dbObject);
        }
        throw new InvalidKeyError(`No bids exist on this object.`);
    }

     /**
     * Get the bids of a user on an auction
     * @param user The user to lookup.
     * @param auction The auction to lookup.
     * @returns A bid between the two if it exists.
     */
    public static async getDatabaseAuctionUser(id_auction: Number, id_user: Number) : Promise<Bid[]> {
        const auction = await Auction.fromDatabaseID(id_auction);
        const user = await User.fromDatabaseId(id_user);
        return await connection('bids')
            .where({'user': user.id, 'auction': auction.id})
            .then(objects => Promise.all(objects.map(this.fromObject)))
    }

     /**
     * Get the bids of a user on an item
     * @param user The user to lookup.
     * @param item The auction to lookup.
     * @returns A bid between the two if it exists.
     */
    public static async getDatabaseItemUser(id_item: number, id_user: Number) : Promise<Bid[]> {
        const item = await Item.fromDatabaseId(id_item);
        const user = await User.fromDatabaseId(id_user);
        return await connection('bids')
            .where({'user': user.id, 'item': item.id})
            .then(objects => Promise.all(objects.map(this.fromObject)));
    }

     /**
     * Get the bids of a user on an item
     * @param user The user to lookup.
     * @param item The auction to lookup.
     * @returns A bid between the two if it exists.
     */
    public static async DatabaseItemUserFirst(id_item: number, id_user: Number) : Promise<Bid> {
        const item = await Item.fromDatabaseId(id_item);
        const user = await User.fromDatabaseId(id_user);
        return await connection('bids')
            .where({'user': user.id, 'item': item.id})
            .orderBy("money",'desc').first();
    }

         /**
     * Get the bids of a user on an item
     * @param item The auction to lookup.
     * @returns A bid between the two if it exists.
     */
    public static async DatabaseItemFirst(id_item: number,id_auction: number) : Promise<Bid> {
        const item = await Item.fromDatabaseId(id_item);
        const auction = await Auction.fromDatabaseID(id_auction);
        return await connection('bids')
            .where({'auction': auction.id, 'item': item.id})
            .orderBy("money",'desc').first();
    }

    /**@DOTO Ask Hunter if this is even necessary for the admin page, and if so, do we need an auction wide search as well?
     */ 
    /**
     * Looks up a list of 'size' bid from the given auction, with a page * number. 
     * 
     * @param auction The auction to look items up on.
     * @param page The page number. Defaults to 1.
     * @param size The size of each page. Defaults to 10.
     */
    public static async fromDatabaseUserPaginated(id_user: Number, page: number = 1, size: number = 10) : Promise<Bid[]> {
        const user = await User.fromDatabaseId(id_user);
        if(page < 1) {
            return Promise.resolve([]);
        }
        if(size < 1) {
            return Promise.resolve([])
        }
        const objects = await connection('bids').orderBy('id').limit(size).offset((page - 1) * size).where({'id': user.id});
        return Promise.all(objects.map(this.fromObject));
    }
    
    /**
     * Internal method to generate an Bid object from a database response.
     * 
     * @param object The database object to generate based on.
     */
    private static async fromObject(object: Object) : Promise<Bid> {
        const auction = await Auction.fromDatabaseID(object['auction']);
        const user = await User.fromDatabaseId(object['user']);
        const item = await Item.fromDatabaseId(object['item']);
        return Promise.resolve(new Bid(object['id'], auction, user, item, object['money'], object['time']));
    }

    /**
     * Saves an bid to the database.
     */
    public async save() : Promise<void> {
        if(!this._dirty) {
            return Promise.resolve();
        }
        await connection('bids').where({'id': this._id}).update({
            'money': this._money,
            'time': this._time
        }).then(() => {this._dirty = false});
        return Promise.resolve();
    }

    /**
     * Loads data from the database into this object.
     */
    public async load() : Promise<void> {
        return connection('bids').where({'id': this._id}).first().then(async dbObject => {
            this._auction = await Auction.fromDatabaseID(dbObject['auction']);
            this._user = await User.fromDatabaseId(dbObject['user']);
            this._money = dbObject['money'];
            this._time = dbObject['time'];
            this._dirty = false;
        });
    }
    
    public toJson() : Object {
        return {
            'id': this._id,
            'auction': this._auction.id,
            'user': this._user.id,
            'item': this._item.id,
            'money': this._money,
            'time': this._time,
        }
    }

    public toJsonDetailed() : Object {
        return {
            'id': this._id,
            'auction': this._auction.toJsonPublic(),
            'user': this._user.toJsonPublic(),
            'item': this._item.toJson(),
            'money': this._money,
            'time': this._time,
        }
    }

    /**
     * Deletes this object in the database.
     */
    public async delete() : Promise<void> {
        return connection('bids').where({'id': this._id}).delete();
    }

    public get id() : number {
        return this._id;
    }

    public get auction() : Auction {
        return this._auction;
    }

    public get user() : User {
        return this._user;
    }

    public get money() : number {
        return this._money;
    }
    
    public get time() : number {
        return this._time;
    }

    public set money(m: number) {
        if(m === this._money) {
            return;
        }
        this._money = m;
        this._dirty = true;
    }

    public set time(time: number) {
        if(time === this._time) {
            return;
        }
        this._time = time;
        this._dirty = true;
    }
}