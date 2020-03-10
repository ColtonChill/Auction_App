import {compareSync, hash, hashSync } from 'bcryptjs'
import { connection } from './Database'
import Auction from '../db/Auctions';

/** 
  * This is hopfully the first and second pins
  * @param testPin
  * @param auctionPin
  * 
  */

export function evalPin(testPin: String, auctionPin: String) : Boolean {
    return compareSync(testPin, auctionPin);
}

/**
 * returns a randomly generated pin of size 10
 * @TODO make sure the primaryKey->pin is unique
 */
export function genPin() : String {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    let pin = '';
    let unique = false;
    while (!unique){
        pin = '';
        for (let i = 0; i<6; ++i){
            pin += chars.charAt(Math.floor(Math.random() * 36));  
        }
        if (checkExistingPins(pin)){
            unique = true
        }
        console.log("Generated pin: "+pin);
    }
    return pin;
}

/**
 * @TODO Figure out how to parse of the pins of the db array
 */
async function checkExistingPins(testPin: String) : Promise<boolean>{
    const dbAuction = await connection("auctions").select('invitecode').where({"invitecode": testPin}).count("invitecode");
    if (dbAuction['invitecode'] === 0) {
        return true;
    }else{ 
        return false;
    }
}