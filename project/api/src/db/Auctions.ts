import { connection } from '../services/Database';
import {genPin, evalPin} from '../services/AuctionPin';
import InvalidKeyError from './InvalidKeyError';
import User from './User';

/**
 * This thingy is more or less (no... take that back, definitly less) of a
 * representation of the Auction instances and all their data
 */

 export default class Auction {
    private _id: Number;
    private _name: String;
    private _description: String;
    private _location: String;
    private _owner: User;
    private _url: String;
    private _hidden: boolean;
    private _inviteCode: String;
    private _dirty: boolean;

    private constructor(id: Number, name: String, description: String, location: String, owner: User, url: String, hidden: boolean, inviteCode: String){
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

    static async createAuction(name: String, description: String, location: String, owner: User, url: String, hidden: boolean) : Promise<Auction> {
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
        return this.fromObject(dbObject[0]);
    }

    static async fromDataBaseID(id: Number) : Promise<Auction> {
        const dbObject = await connection("auctions").where({id}).first();
        if (dbObject === undefined){
            return Promise.reject(new InvalidKeyError(`Hon...? Ain't no Auction with ID ${id}.`))
        }
        return Auction.fromObject(dbObject);
    }

    static async fromDataBaseName(name: String) : Promise<Auction> {
        const dbObject = await connection("auctions").where({name}).first();
        if (dbObject === undefined){
            return Promise.reject(new InvalidKeyError(`Hon...? Ain't no Auction wtih da name ${name}.`))
        }
        return Auction.fromObject(dbObject);
    }

    static async fromDataBaseInviteCode(pin: String) : Promise<Auction> {
        const dbObject = await connection("auctions").where({"invite_code": pin}).first();
        if (dbObject === undefined){
            return Promise.reject(new InvalidKeyError(`Hon...? Ain't no Auction with da code ${pin}.`))
        }
        return Auction.fromObject(dbObject);
    }

    static async fromDataBaseURL(url: String) : Promise<Auction> {
        const dbObject = await connection("auctions").where({"url": url}).first();
        if (dbObject === undefined){
            return Promise.reject(new InvalidKeyError(`Hon...? Ain't no Auction with da url: ${url}.`))
        }
        return Auction.fromObject(dbObject);
    }

    static async fromDataBaseAllAuctions() : Promise<Auction[]> {
        const dbObject = await connection("auctions");
        if (dbObject === undefined){
            return Promise.reject(new InvalidKeyError(`Hon...? You be trippin? Ain't no Auctions.`))
        }
        const auctions = dbObject.map(it => Auction.fromObject(it));
        return Promise.all(auctions);
    }

    private static async fromObject(object: Object) : Promise<Auction> {
        const user = await User.fromDatabaseId(object["owner"]);
        const auction = new Auction(object["id"],object["name"],object["description"],object["location"],
        user,object["url"],object["hidden"],object["invite_code"])
        return auction;
    }

    public toJson() : Object {
        return {
            "name": this._name,
            "invite_code": this._inviteCode,
            "owner": this._owner,
            "url": this._url,
            "hidden": this._hidden,
            "description": this._description,
            "location": this._location
        }
    }

    public async save() : Promise<void>{
        if (this._dirty){
            await connection('auctions').where({"id": this._id}).update({
                "name": this._name,
                "invite_code": this._inviteCode,
                "owner": this._owner.id,
                "url":this._url,
                "hidden": this._hidden,
                "description": this._description,
                "location": this._location
            }).then(_ => this._dirty = false);
        }else{
            return Promise.resolve();
        }
    }

    //Method toggles the privacy of the auction.
    public async togglePrivacy(user: User){
        if(user.id == this.owner.id){

            if(this._hidden == true){
            this._hidden = false;
            }
            else{
            this._hidden = true;
            }
        }
        
    }

    public async load() : Promise<void>{
        const dbObject = await connection("auctions").where({"id": this._id}).first();
        this._name = dbObject["name"];
        this._inviteCode = dbObject["invite_code"];
        this._owner = await User.fromDatabaseId(dbObject["owner"]);
        this._url = dbObject["url"];
        this._hidden = dbObject["hidden"];
        this._description = dbObject["description"];
        this._location = dbObject["location"];
        this._dirty = false;
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
    public set hidden(value: boolean) {
        if(!this._hidden && value){
            this.resetPin;
        }
        this._hidden = value;
        this._dirty = true;
    }
    public async resetPin(user: User) : Promise<String>{
        if(user.id == this.owner.id){
            const pin = await genPin();
            this._inviteCode = pin;
            this._dirty = true;
            return pin;
        }
    }
    public get pin(){
        return this._inviteCode;
    }
    public get id(){
        return this._id;
    }
    public get name() {
        return this._name;
    }
    public get description() {
        return this._description;
    }
    public get url(){
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
 }