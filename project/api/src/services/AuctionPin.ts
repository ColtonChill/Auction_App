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
    // var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    // var stringChars = new char[6];
    // var random = new Random();

    // for (int i = 0; i < stringChars.Length; i++)
    // {
    // stringChars[i] = chars[random.Next(chars.Length)];
    // }

    // var finalString = new String(stringChars);
    let pin = '';
    let unique = false;
    while (!unique){
        pin = '';
        for (let i = 0; i<10; ++i){
            pin += Math.floor(Math.random() * 10);  
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
    const dbAuction = await connection("auctions").where({"invitecode": testPin}).first();
    if (dbAuction === undefined){
        return true;
    }else{ 
        return false;
    }
}