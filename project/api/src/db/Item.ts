import Auction from "./Auction";
import { connection } from "../services/Database";
import InvalidKeyError from "./InvalidKeyError";
import User from "./User";
import Bid from "./Bid";
import logger from "../services/Logger";

/**
 * A class that represents Items in our database.
 * 
 * @author Hunter Henrichsen
 */
export default class Item {
    private _dirty: boolean;

    /**
     * Constructor.
     * 
     * @param _id The database id of this item.
     * @param _auction The auction this item is associated with.
     * @param _name The name of the item.
     * @param _description The description of the item.
     * @param _imageName The path to the image (not including the /user/:auctionID) for this item. Normally the same as the item ID.
     */
    protected constructor(protected _id: number, private _auction: Auction, private _name: string, private _description: string, private _imageName: string) {
        this._dirty = false;
    }

    public static async createItem(auction: Auction, name: string, description: string, imageName: string) : Promise<Item> {
        return connection('items').insert({
            'auction': auction.id,
            'name': name,
            'description': description,
            'image_name': imageName
        }).returning('*').then(it => this.fromObject(it[0]));
    }

    /**
     * Gets an item out of the database based on its ID.
     * 
     * @param id The ID of the item to lookup.
     */
    public static async fromDatabaseId(id: number) : Promise<Item> {
        const res = await connection('items').where({id})
        if(res.length !== 1) {
            return Promise.reject(new InvalidKeyError(`No Item exists with the id ${id}.`))
        }
        return Promise.resolve(this.fromObject(res[0]));
    }

    /**
     * Get a list of all items associated with an auction.
     *  
     * @param auction The auction to look items up on.
     */
    public static async fromDatabaseAuction(auction: number) : Promise<Item[]> {
        return connection('items')
            .where({'auction': auction})
            .then(objects => Promise.all(objects.map(this.fromObject)));
    }

    /**
     * Looks up a list of 'size' items from the given auction, with a page * number. 
     * 
     * @param auction The auction to look items up on.
     * @param page The page number. Defaults to 1.
     * @param size The size of each page. Defaults to 10.
     */
    public static async fromDatabaseAuctionPaginated(auction: number, page: number = 1, size: number = 10) : Promise<Item[]> {
        if(page < 1) {
            return Promise.resolve([]);
        }
        if(size < 1) {
            return Promise.resolve([])
        }
        const objects = await connection('items').orderBy('id').limit(size).offset((page - 1) * size).where({'id': auction});
        return Promise.all(objects.map(this.fromObject));
    }
    /**
    * Adds an Bid to this auction.
    * 
    * @param Auction The perticular auction.
    * @param user The user making the bid.
    * @param money The amount of the bid.
    */
   public async addBid(auction: Auction, user: User, money: number) : Promise<Bid> {
       return Bid.createBid(auction.id, user.id, this.id, money);
   }
    
    /**
     * Internal method to generate an Item object from a database response.
     * 
     * @param object The database object to generate based on.
     */
    protected static async fromObject(object: Object) : Promise<Item> {
        const auction = await Auction.fromDatabaseID(object['auction']);
        const item = new Item(object['id'], auction, object['name'], object['description'], object['image_name'])
        const liveItem = await LiveItem.fromDatabaseItem(item);
        if(liveItem !== null) {
            return liveItem;
        }
        const silentItem = await SilentItem.fromDatabaseItem(item);
        if(silentItem !== null) {
            return silentItem;
        }
        return item;
    }

    public toJson() {
        return {
            'id': this._id,
            'auction': this._auction.id,
            'name': this._name,
            'description': this._description,
            'imageName': this._imageName,
        }
    }

    public async toJsonDetailed() {
        let winningBid;
        try {
            winningBid = (await Bid.getWinningBid(this._id)).toJson()
        }
        catch (ex) {
            if (ex.name === "InvalidKeyError") {
                winningBid = null;
            }
        }

        return {
            'id': this._id,
            'auction': this._auction.toJson(),
            'name': this._name,
            'description': this._description,
            'imageName': this._imageName,
            'winningBid': winningBid
        }
    }

    /**
     * Saves an Item to the database.
     */
    public async save() : Promise<void> {
        if(!this._dirty) {
            return Promise.resolve();
        }
        await connection('items').where({'id': this._id}).update({
            'name': this._name,
            'description': this._description,
            'image_name': this._imageName
        }).then(() => {this._dirty = false});
        return Promise.resolve();
    }

    /**
     * Loads data from the database into this object.
     */
    public async load() : Promise<void> {
        return connection('items').where({'id': this._id}).first().then(async dbObject => {
            this._auction = await Auction.fromDatabaseID(dbObject['auction']);
            this._name = dbObject['name'];
            this._description = dbObject['description'];
            this._imageName = dbObject['image_name'];
            this._dirty = false;
        }).catch(err => {
            this._auction = null;
            this._name = null;
            this._description = null;
            this._imageName = null;
            this._dirty = false;
            logger.warn(`Loading a deleted object: Item with ID ${this._id}.`);
        });
    }

    /**
     * Deletes this object in the database.
     */
    public async delete() : Promise<void> {
        return connection('items').where({'id': this._id}).limit(1).delete();
    }

    public get id() : number {
        return this._id;
    }

    public get auction() : Auction {
        return this._auction;
    }

    public get name() : string {
        return this._name;
    }

    public get description() : string {
        return this._description;
    }
    
    public get imageName() : string {
        return this._imageName;
    }

    public set name(name: string) {
        if(name === this._name) {
            return;
        }
        this._name = name;
        this._dirty = true;
    }

    public set description(description: string) {
        if(description === this._description) {
            return;
        }
        this._description = description;
        this._dirty = true;
    }

    public set imageName(imageName: string) {
        if(imageName === this._imageName) {
            return;
        }
        this._imageName = imageName;
        this._dirty = true;
    }
}

interface LiveItemAssignable {
    _winner: User;
    _winningPrice: number;
    _extId: number;
}

export class LiveItem extends Item {
    private _extDirty: boolean;

    protected constructor(other: Item, private _extId: number, private _winner: User, private _winningPrice: number) {
        super(other.id, other.auction, other.name, other.description, other.imageName);
        this._extDirty = false;
    }

    public static async createLiveItem(auction: Auction, name: string, description: string, imageName: string, winningPrice: number, winner?: User) : Promise<LiveItem> {
        const item = await super.createItem(auction, name, description, imageName);
        const dbObject = (await connection('live_items').insert({
            'item': item.id,
            'winner': winner?.id,
            'winning_price': winningPrice
        }).returning('*'))[0];
        return Promise.resolve(new LiveItem(item, dbObject['id'], dbObject['winner'], dbObject['winning_price']));
    }

    public static async fromDatabaseExtId(id: number) : Promise<LiveItem> {
        const dbObject = await connection('live_items')
            .select('live_items.id AS ext_id', 'live_items.winner AS winner', 'live_items.winning_price AS winning_price', 
                    'items.id AS id', 'items.name AS name', 'items.description AS description', 'items.auction AS auction', 'items.image_name AS image_name')
            .where({ 'ext_id': id })
            .leftJoin('items', 'items.id', '=', 'silent_items.item')
            .first();
        if(dbObject === undefined) {
            return Promise.resolve(null);
        }
        return Promise.resolve(new LiveItem(await Item.fromObject(dbObject), dbObject['ext_id'], dbObject['winner'] !== null ? await User.fromDatabaseId(dbObject['winner']) : null, dbObject['bid_increment']))
    }

    protected static async mapFromDBColumns(object: Object) : Promise<LiveItemAssignable> {
        return {
            '_extId': object['id'],
            '_winner': object['winner'] !== undefined && object['winner'] !== null ? await User.fromDatabaseId(object['winner']) : null,
            '_winningPrice': object['winning_price']
        }
    }

    public static async fromDatabaseItem(item: Item) : Promise<LiveItem> {
        const dbObject = await connection('live_items').where({ 'item': item.id }).first();
        if(dbObject === undefined) {
            return Promise.resolve(null);
        }
        return Promise.resolve(new LiveItem(item, dbObject['id'], dbObject['winner'] !== null ? await User.fromDatabaseId(dbObject['winner']) : null, dbObject['winning_price']));
    }

    public toJson() {
        const parent = super.toJson();
        return {
            ...parent,
            'winner': this._winner?.id,
            'winningPrice': this._winningPrice
        }
    }

    public async toJsonDetailed() {
        const parent = await super.toJsonDetailed();
        return {
            ...parent,
            'winner': this._winner?.toJson(),
            'winningPrice': this._winningPrice
        }
    }

    public async save() : Promise<void> {
        await super.save();
        if(!this._extDirty) {
            return Promise.resolve();
        }
        await connection('live_items').update({
            'winner': this._winner?.id,
            'winning_price': this._winningPrice
        }).where({'id': this._extId});
        this._extDirty = false;
        return Promise.resolve();
    }

    public async load() : Promise<void> {
        await super.load();
        const dbObject = await connection('live_items').where({'id': this._extId}).first();
        if(dbObject === undefined) {
            this._extId = null;
            this._winner = null;
            this._winningPrice = null;
            this._extDirty = false;
            logger.warn(`Loading a deleted object: LiveItem with ID ${this._extId} based on Item with ID ${this._id}`);
            return Promise.resolve();
        }
        Object.assign(this, await LiveItem.mapFromDBColumns(dbObject));
    }

    public async delete() : Promise<void> {
        await connection('live_items').delete().where({'id': this._extId}).limit(1);
        await super.delete();
        return Promise.resolve();
    }

    public set winner(winner: User) {
        if (this._winner.id === winner.id) {
            return;
        }
        this._winner = winner;
        this._extDirty = true;
    }

    public set winningPrice(winningPrice: number) {
        if(this._winningPrice === winningPrice) {
            return;
        }
        this._winningPrice = winningPrice;
        this._extDirty = true;
    }
    
    public get liveID() {
        return this._extId;
    }

    public get winner() : User {
        return this._winner;
    }

    public get winningPrice() : number {
        return this._winningPrice;
    }
}
interface SilentItemAssignable {
    _startingPrice: number;
    _bidIncrement: number;
    _extId: number;
}

export class SilentItem extends Item {

    private _extDirty: boolean;

    protected constructor(other: Item, private _extId: number, private _startingPrice: number, private _bidIncrement: number) {
        super(other.id, other.auction, other.name, other.description, other.imageName);
        this._extDirty = false;
    }

    public static async createSilentItem(auction: Auction, name: string, description: string, imageName: string, startingPrice: number, bidIncrement: number) : Promise<SilentItem> {
        const item = await super.createItem(auction, name, description, imageName);
        const dbObject = (await connection('silent_items').insert({
            'item': item.id,
            'starting_price': startingPrice,
            'bid_increment': bidIncrement
        }).returning('*'))[0];
        return Promise.resolve(new SilentItem(item, dbObject['id'], dbObject['starting_price'], dbObject['bid_increment']));
    }

    public static async fromDatabaseExtId(id: number) : Promise<SilentItem> {
        const dbObject = await connection('silent_items')
            .select('silent_items.id AS ext_id', 'silent_items.starting_price AS starting_price', 'silent_items.bid_increment AS bid_increment', 
                    'items.id AS id', 'items.name AS name', 'items.description AS description', 'items.auction AS auction', 'items.image_name AS image_name')
            .where({ 'ext_id': id })
            .leftJoin('items', 'items.id', '=', 'silent_items.item')
            .first();
        if(dbObject === undefined) {
            return Promise.resolve(null);
        }
        return Promise.resolve(new SilentItem(await Item.fromObject(dbObject), dbObject['id'], dbObject['starting_price'], dbObject['bid_increment']))
    }

    protected static async mapFromDBColumns(object: Object) : Promise<SilentItemAssignable> {
        return {
            '_extId': object['id'],
            '_startingPrice': object['starting_price'],
            '_bidIncrement': object['bid_increment']
        }
    }

    public static async fromDatabaseItem(item: Item) : Promise<SilentItem> {
        const dbObject = await connection('silent_items').where({ 'item': item.id }).first();
        if(dbObject === undefined) {
            return Promise.resolve(null);
        }
        return Promise.resolve(new SilentItem(item, dbObject['id'], dbObject['starting_price'], dbObject['bid_increment']))
    }

    public toJson() {
        const parent = super.toJson();
        return {
            ...parent,
            'starting_price': this._startingPrice,
            'bid_increment': this._bidIncrement,
        }
    }

    public async toJsonDetailed() {
        const parent = await super.toJsonDetailed();
        return {
            ...parent,
            'starting_price': this._startingPrice,
            'bid_increment': this._bidIncrement
        }
    }

    public async save() : Promise<void> {
        await super.save();
        if(!this._extDirty) {
            return Promise.resolve();
        }
        await connection('silent_items').update({
            'starting_price': this._startingPrice,
            'bid_increment': this._bidIncrement
        }).where({'id': this._extId});
        this._extDirty = false;
        return Promise.resolve();
    }

    public async load() : Promise<void> {
        await super.load();
        const dbObject = await connection('silent_items').where({'id': this._extId}).first();
        if(dbObject === undefined) {
            this._extId = null;
            this._bidIncrement = null;
            this._startingPrice = null;
            this._extDirty = false;
            logger.warn(`Loading a deleted object: LiveItem with ID ${this._extId} based on Item with ID ${this._id}`);
            return Promise.resolve();
        }
        Object.assign(this, await SilentItem.mapFromDBColumns(dbObject));
        this._extDirty = false;
        return Promise.resolve();
    }

    public async delete() : Promise<void> {
        await connection('silent_items').delete().where({'id': this._extId}).limit(1);
        await super.delete();
        return Promise.resolve();
    }

    public set startingPrice(startingPrice: number) {
        if(Math.floor(startingPrice) === this._startingPrice) {
            return;
        }
        this._startingPrice = Math.floor(startingPrice);
        this._extDirty = true;
    }

    public set bidIncrement(bidIncrement: number) {
        if(Math.floor(bidIncrement) === this._bidIncrement) {
            return;
        }
        this._bidIncrement = Math.floor(bidIncrement);
        this._extDirty = true;
    }

    public get silentId() {
        return this._extId;
    }

    public get startingPrice() {
        return this._startingPrice;
    }

    public get bidIncrement() {
        return this._bidIncrement;
    }
}