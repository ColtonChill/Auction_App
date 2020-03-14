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
    private _dirtyBit: boolean;

    private constructor(id: Number, name: String, description: String, location: String, owner: User, url: String, hidden: boolean, inviteCode: String){
        this._id = id;
        this._name = name;
        this._description = description;
        this._location = location;
        this._owner = owner;
        this._url = url;
        this._hidden = hidden;
        this._inviteCode = inviteCode;
        this._dirtyBit = false;
    }

    static async createAuction(name: String, description: String, location: String, owner: User, hidden: boolean){
        const pin = await genPin();
        const dbObject = await connection("auctions").insert({
            "name": name,
            "inviteCode": pin,
            "Owner": owner,
            "hidden": hidden,
            "description": description,
            "location": location
        }).returning("*");
        return this.fromObject(dbObject);
    }

    static async fromDataBaseID(id: Number) : Promise<Auction> {
        const dbObject = await connection("auctions").where({id}).first();
        if (dbObject === undefined){
            throw new InvalidKeyError(`Hon...? You be trippin? Ain't no Auction wif ID ${id}.`)
        }
        return Auction.fromObject(dbObject);
    }

    static async fromDataBaseName(name: String) : Promise<Auction> {
        const dbObject = await connection("auctions").where({"name":name}).first();
        if (dbObject === undefined){
            throw new InvalidKeyError(`Hon...? You be trippin? Ain't no Auction wif da name ${name}.`)
        }
        return Auction.fromObject(dbObject);
    }

    static async fromDataBaseInviteCode(pin: String) : Promise<Auction> {
        const dbObject = await connection("auctions").where({"inviteCode": pin}).first();
        if (dbObject === undefined){
            throw new InvalidKeyError(`Hon...? You be trippin? Ain't no Auction wif da code ${pin}.`)
        }
        return Auction.fromObject(dbObject);
    }

    static async fromDataBaseAllAuctions() : Promise<Auction>{
        const dbObject = await connection("auctions").select({"inviteCode"});
        if (dbObject === undefined){
            throw new InvalidKeyError(`Hon...? You be trippin? Ain't no Auctions.`)
        }
        return Auction.fromObject(dbObject);
    }
    // static async fromDataBaseInviteCodes() : Promise<Auction> {
    //     const dbAuctionArray = await connection("auctions");
    //     if (dbAuctionArray === undefined){
    //         throw new InvalidKeyError(`Hon...? You be trippin? Ain't no Auctions roun here.`)
    //     }
    //     return Auction.fromObject(dbAuctionArray);
    // }

    private static async fromObject(object: Object) : Promise<Auction> {
        const auction = new Auction(object["id"],object["name"],object["description"],object["location"],await User.getFromId(object["owner"]),object["url"],object["hidden"],object["inviteCode"])
        return auction;
    }

    public toJson() : Object {
        return {
            "name": this._name,
            "inviteCode": this._inviteCode,
            "Owner": this._owner,
            "hidden": this._hidden,
            "description": this._description,
            "location": this._location
        }
    }

    public async save() : Promise<void>{
        if (this._dirtyBit){
            await connection('auctions').where({"id": this._id}).update({
                "name": this._name,
                "inviteCode": this._inviteCode,
                "Owner": this._owner,
                "hidden": this._hidden,
                "description": this._description,
                "location": this._location
            }).then(_ => this._dirtyBit = false);
        }else{
            return Promise.resolve();
        }
    }

    public async load() : Promise<void>{
        const dbObject = await connection("auctions").where({"id": this._id}).update({
            "name": this._name,
            "inviteCode": this._inviteCode,
            "Owner": this._owner,
            "hidden": this._hidden,
            "description": this._description,
            "location": this._location
        }).returning("*").then(_ => this._dirtyBit = false);
        this._name = dbObject["name"];
        this._inviteCode = dbObject["inviteCode"];
        this._owner = dbObject["owner"];
        this._hidden = dbObject["hidden"];
        this._description = dbObject["description"];
        this._location = dbObject["location"];
    }

    public set name(value: String) {
        this._name = value;
        this._dirtyBit = true;
    }
    public set description(value: String) {
        this._description = value;
        this._dirtyBit = true;
    }
    public set location(value: String) {
        this._location = value;
        this._dirtyBit = true;
    }
    public set owner(value: User) {
        this._owner = value;
        this._dirtyBit = true;
    }
    public set hidden(value: boolean) {
        this._hidden = value;
        this._dirtyBit = true;
    }
    public async resetPin() : Promise<String>{
        const pin = await genPin();
        this._inviteCode = pin;
        return pin;
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