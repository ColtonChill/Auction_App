import { connection } from '../services/Database';
import { genPin, evalPin } from '../services/AuctionPin';
import InvalidKeyError from './InvalidKeyError';
import User from './User';
import AuctionMembership from './AuctionMembership';
import Item, {LiveItem, SilentItem} from './Item';
import Bid from "./Bid";
import logger from '../services/Logger';

/**
 * This thingy is more or less (no... take that back, definitly less) of a
 * representation of the Auction instances and all their data
 */

export default class Auction {
    private _id: number;
    private _name: String;
    private _description: String;
    private _location: String;
    private _owner: User;
    private _url: string;
    private _hidden: boolean;
    private _inviteCode: String;
    private _dirty: boolean;

    private constructor(id: number, name: String, description: String, location: String, owner: User, url: string, hidden: boolean, inviteCode: String, private _open: boolean) {
        this._id = id;
        this._name = name;
        this._description = description;
        this._location = location;
        this._owner = owner;
        this._url = url;
        this._hidden = hidden;
        this._inviteCode = inviteCode;
        this._dirty = false;
    }

    static async createAuction(name: String, description: String, location: String, owner: User, url: String, hidden: boolean): Promise<Auction> {
        const pin = await genPin();
        const dbObject = await connection("auctions").insert({
            "name": name,
            "invite_code": pin,
            "owner": owner.id,
            "url": url,
            "hidden": hidden,
            "description": description,
            "location": location
        }).returning("*");
        const auction = await this.fromObject(dbObject[0]);
        await AuctionMembership.createMembership(owner, auction);
        logger.info(`Creating auction ${auction}.`)
        return auction;
    }

    static async fromDatabaseID(id: Number): Promise<Auction> {
        const dbObject = await connection("auctions").where({ id }).first();
        if (dbObject === undefined) {
            return Promise.reject(new InvalidKeyError(`No auction exists with this id: ${id}.`))
        }
        return Auction.fromObject(dbObject);
    }

    static async fromDatabaseName(name: String): Promise<Auction> {
        const dbObject = await connection("auctions").where({ name }).first();
        if (dbObject === undefined) {
            return Promise.reject(new InvalidKeyError(`No auction exists with this name: ${name}.`))
        }
        return Auction.fromObject(dbObject);
    }

    static async fromDatabaseInviteCode(pin: String): Promise<Auction> {
        const dbObject = await connection("auctions").where({ "invite_code": pin }).first();
        if (dbObject === undefined) {
            return Promise.reject(new InvalidKeyError(`No auction exists with this code: ${pin}.`))
        }
        return Auction.fromObject(dbObject);
    }

    static async fromDatabaseURL(url: String): Promise<Auction> {
        const dbObject = await connection("auctions").where({ "url": url }).first();
        if (dbObject === undefined) {
            return Promise.reject(new InvalidKeyError(`No auction exists with this url: ${url}.`))
        }
        return Auction.fromObject(dbObject);
    }

    static async urlExists(url: String) : Promise<boolean> {
        const dbObject = await connection("auctions").where({ "url": url });
        if(dbObject.length !== 1) {
            return Promise.resolve(false);
        }
        return Promise.resolve(true);
    }

    static async fromDatabaseAllAuctions(): Promise<Auction[]> {
        const dbObject = await connection("auctions");
        if (dbObject === undefined) {
            return Promise.reject(new InvalidKeyError(`No auction exists`))
        }
        const auctions = dbObject.map(it => Auction.fromObject(it));
        return Promise.all(auctions);
    }

    public static async fromDatabasePublicAuctions(): Promise<Auction[]> {
        const dbObject = await connection("auctions").where({ 'hidden': false });
        if (dbObject === undefined) {
            return Promise.reject(new InvalidKeyError(`No auction exists`))
        }
        const auctions = dbObject.map(it => Auction.fromObject(it));
        return Promise.all(auctions);

    }

    private static async fromObject(object: Object): Promise<Auction> {
        const user = await User.fromDatabaseId(object["owner"]);
        const auction = new Auction(object["id"], object["name"], object["description"], object["location"],
            user, object["url"], object["hidden"], object["invite_code"], object["open"]);
        return auction;
    }

    public toJson(): Object {
        return {
            "name": this._name,
            "inviteCode": this._inviteCode,
            "owner": this._owner.toJsonPublic(),
            "url": this._url,
            "hidden": this._hidden,
            "description": this._description,
            "location": this._location,
            "open": this._open,
        }
    }

    public toJsonPublic() : Object {
        return {
            "name": this._name,
            "owner": this._owner.toJsonPublic(),
            "url": this._url,
            "hidden": this._hidden,
            "description": this._description,
            "location": this._location,
            "open": this._open,
        }
    }

    public async save(): Promise<void> {
        if (this._dirty) {
            await connection('auctions').where({ "id": this._id }).update({
                "name": this._name,
                "invite_code": this._inviteCode,
                "owner": this._owner.id,
                "url": this._url,
                "hidden": this._hidden,
                "description": this._description,
                "location": this._location,
                "open": this._open,
            }).then(_ => this._dirty = false);
        } else {
            return Promise.resolve();
        }
    }

    //Method toggles the privacy of the auction.
    public async togglePrivacy(): Promise<void> {
        if (this._hidden === true) {
            this._hidden = false;
            this._dirty = true;
        }
        else {
            await this.resetPin();
            this._hidden = true;
            this._dirty = true;
        }
    }

    //Method where an "Admin" can kick a user from an auction
    public async kick(target: User): Promise<void> {
        if (target.id == this.owner.id) {
            return Promise.resolve();
        }
        const membership = await AuctionMembership.getMembership(target, this)
        if (membership === null) {
            return Promise.resolve();
        }
        return membership.delete();
    }

    //Method where an "Admin" can ban a user from all auctions
    public async ban(target: User): Promise<void> {
        if (target.id == this.owner.id) {
            return Promise.resolve();
        }
        let membership = await AuctionMembership.getMembership(target, this)
        if (membership === null) {
            membership = await AuctionMembership.createMembership(target, this);
        }
        return membership.setBanned(true);
    }

    public async load(): Promise<void> {
        const dbObject = await connection("auctions").where({ "id": this._id }).first();
        this._name = dbObject["name"];
        this._inviteCode = dbObject["invite_code"];
        this._owner = await User.fromDatabaseId(dbObject["owner"]);
        this._url = dbObject["url"];
        this._hidden = dbObject["hidden"];
        this._description = dbObject["description"];
        this._location = dbObject["location"];
        this._dirty = false;
    }

    public async resetPin(): Promise<String> {
        const pin = genPin();
        this._inviteCode = pin;
        this._dirty = true;
        return pin;
    }

    public async addMember(user: User): Promise<void> {
        await AuctionMembership.createMembership(user, this);
        return Promise.resolve();
    }

    /**
     * Adds an item to this auction.
     * 
     * @param name The name of the item.
     * @param description The description of the item.
     * @param imagePath The path to the image of this item.
     */
    public async addItem(name: string, description: string, imagePath: string) : Promise<Item> {
        return Item.createItem(this, name, description, imagePath)
    }

    public async addLiveItem(name: string, description: string, imagePath: string, winningPrice: number, winner?: User) {
        return LiveItem.createLiveItem(this, name, description, imagePath, winningPrice, winner);
    }

    public async addSilentItem(name: string, description: string, imagePath: string, startingPrice: number, bidIncrement: number) {
        return SilentItem.createSilentItem(this, name, description, imagePath, startingPrice, bidIncrement);
    }

    /**
    * Adds an Bid to this auction.
    * 
    * @param User The user making the bid.
    * @param Item The item.
    * @param money The amount of the bid.
    */
   public async addBid(user: User, item: Item, money: number) : Promise<Bid> {
       return Bid.createBid(this.id, user.id, item.id, money);
   }

    public set name(value: String) {
        this._name = value;
        this._dirty = true;
    }
    public set description(value: String) {
        this._description = value;
        this._dirty = true;
    }
    public set location(value: String) {
        this._location = value;
        this._dirty = true;
    }
    public set owner(value: User) {
        this._owner = value;
        this._dirty = true;
    }
    public set url(value: string) {
        this._url = value;
        this._dirty = true;
    }
    public set hidden(value: boolean) {
        if (!this._hidden && value) {
            this.resetPin;
        }
        this._hidden = value;
        this._dirty = true;
    }
    public set open(value: boolean) {
        if(value !== this._open) {
            this._open = value;
            this._dirty = true;
        }
    }

    public get pin() {
        return this._inviteCode;
    }
    public get id() {
        return this._id;
    }
    public get name() {
        return this._name;
    }
    public get members() {
        return AuctionMembership.getAuctionMembers(this);
    }
    public get description() {
        return this._description;
    }
    public get url() {
        return this._url;
    }
    public get location() {
        return this._location;
    }
    public get owner() {
        return this._owner;
    }
    public get hidden() {
        return this._hidden;
    }
    public get open() {
        return this._open;
    }
}