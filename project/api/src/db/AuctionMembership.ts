import User from './User';
import Auction from './Auction';
import { connection } from '../services/Database';

export default class AuctionMembership {
    private _id: Number;
    private _user: User;
    private _auction: Auction;
    private _banned: boolean;

    private constructor(id: Number, user: User, auction: Auction, banned: boolean) {
        this._id = id;
        this._user = user;
        this._auction = auction;
        this._banned = banned;
    }

    /**
     * Creates a membership from a user to an auction.
     * @param user The user to add as a member.
     * @param auction The auction to add the member to.
     * @return A promise containing the new membership.
     */
    public static async createMembership(user: User, auction: Auction) : Promise<AuctionMembership> {
        const dbObject = await connection('auction_members').insert({
            'user': user.id,
            'auction': auction.id
        }).returning('*');
        return AuctionMembership.fromObject(dbObject[0]);
    }

    /**
     * Get the membership between a user and auction, or null if one doesn't exist. 
     * @param user The user to lookup.
     * @param auction The auction to lookup.
     * @returns A membership between the two if it exists.
     */
    public static async getMembership(user: User, auction: Auction) : Promise<AuctionMembership> {
        const dbObject = await connection('auction_members').where({'user': user.id, 'auction': auction.id}).first();
        return dbObject ? this.fromObject(dbObject) : null;
    }

    /**
     * Get all memberships that the user is a part of. 
     * @param user The user to lookup.
     * @returns A list of memberships.
     */
    public static async getUserMemberships(user: User) : Promise<AuctionMembership[]> {
        const dbObjects = await connection('auction_members').where({'user': user.id});
        return Promise.all(dbObjects.map(it => (this.fromObject(it))));
    }

    /**
     * Get all memberships that this auction has.
     * @param auction The auction to lookup.
     * @returns A list of memberships.
     */
    public static async getAuctionMembers(auction: Auction) : Promise<AuctionMembership[]> {
        const dbObjects = await connection('auction_members').where({'auction': auction.id});
        return Promise.all(dbObjects.map(it => (this.fromObject(it))));
    }

    public static async isMember(user: number, auction: number) : Promise<boolean> {
        const dbObject = await connection('auction_members').where({'auction': auction, 'user': user});
        if(dbObject[0] === undefined) {
            return Promise.resolve(false);
        }
        else if(dbObject[0]['banned'] === true) {
            return Promise.resolve(false);
        }
        return Promise.resolve(true);
    }

    private static async fromObject(object: Object) : Promise<AuctionMembership> {
        const user = await User.fromDatabaseId(object['user']);
        const auction = await Auction.fromDatabaseID(object['auction']);
        return new AuctionMembership(object['id'], user, auction, object['banned']);
    }

    /**
     * Deletes this auction.
     */
    public async delete() : Promise<void> {
        return connection('auction_members').where({id: this._id}).delete();
    }

    /**
     * Sets if this user is banned.
     * @param banned Whether this user is banned or not.
     */
    public async setBanned(banned: boolean) : Promise<void> {
        if(banned != this._banned) {
            return connection('auction_members').update({'banned': banned}).where({'id': this._id}).then(() => {this._banned = banned});
        }
        return Promise.resolve()
    }

    public get banned() : boolean {
        return this._banned;
    }

    public get auction() : Auction {
        return this._auction;
    }

    public get user() : User {
        return this._user;
    }
}