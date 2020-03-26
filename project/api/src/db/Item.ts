import Auction from "./Auction";
import { connection } from "../services/Database";
import InvalidKeyError from "./InvalidKeyError";
import User from "./User";
import Bid from "./Bid";

/**
 * A class that represents Items in our database.
 * 
 * @author Hunter Henrichsen
 */
export default class Item {
    private _id: number;
    private _auction: Auction;
    private _name: string;
    private _description: string;
    private _imageName: string;
    private _dirty: boolean;

    /**
     * Constructor.
     * 
     * @param id The database id of this item.
     * @param auction The auction this item is associated with.
     * @param name The name of the item.
     * @param description The description of the item.
     * @param imageName The path to the image (not including the /user/:auctionID) for this item. Normally the same as the item ID.
     */
    private constructor(id: number, auction: Auction, name: string, description: string, imageName: string) {
        this._id = id;
        this._auction = auction;
        this._name = name;
        this._description = description;
        this._imageName = imageName;
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
    public static async fromDatabaseAuction(auction: Auction) : Promise<Item[]> {
        return connection('items')
            .where({'id': auction.id})
            .then(objects => Promise.all(objects.map(this.fromObject)));
    }

    /**
     * Looks up a list of 'size' items from the given auction, with a page * number. 
     * 
     * @param auction The auction to look items up on.
     * @param page The page number. Defaults to 1.
     * @param size The size of each page. Defaults to 10.
     */
    public static async fromDatabaseAuctionPaginated(auction: Auction, page: number = 1, size: number = 10) : Promise<Item[]> {
        if(page < 1) {
            return Promise.resolve([]);
        }
        if(size < 1) {
            return Promise.resolve([])
        }
        const objects = await connection('items').orderBy('id').limit(size).offset((page - 1) * size).where({'id': auction.id});
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
    private static async fromObject(object: Object) : Promise<Item> {
        const auction = await Auction.fromDatabaseID(object['auction']);
        return Promise.resolve(new Item(object['id'], auction, object['name'], object['description'], object['image_name']));
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
        });
    }

    /**
     * Deletes this object in the database.
     */
    public async delete() : Promise<void> {
        return connection('items').where({'id': this._id}).delete();
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
