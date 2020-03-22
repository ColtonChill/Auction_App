import 'mocha';
import chai, { expect } from 'chai';
import cap from 'chai-as-promised';
import Auction from '../src/db/Auction';
import { migrate, rollback } from '../src/services/Database';
import InvalidKeyError from "../src/db/InvalidKeyError";

import User from '../src/db/User';
import Item from '../src/db/Item';
import Bid from "../src/db/Bid";

chai.use(cap);

describe('Bid : Database Class', () => {

    beforeEach(async () => {
        await rollback().then(migrate)
    })

    afterEach(async () => {
        await rollback();
    });

    describe('Static Methods', () => {
        it('Should be able to create a Bid', async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user, "default-auction", false);
            const item = await Item.createItem(auction, 'A book', 'A completely empty book of uselessness.', 'useless_book.jpg');
            const bid = await Bid.createBid(auction,user,item, 100);
            expect(bid.id).to.not.be.undefined;
        });

        it("Shouldn't be able to create a Bid", async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user, "default-auction", false);
            const item = await Item.createItem(auction, 'A book', 'A completely empty book of uselessness.', 'useless_book.jpg');
            const bid = await Bid.createBid(auction,user,item, 100);
            expect(bid.id).to.not.be.undefined;
        });

        it("Should be able to out Bid an old Bid", async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user, "default-auction", false);
            const item = await Item.createItem(auction, 'A book', 'A completely empty book of uselessness.', 'useless_book.jpg');
            const bid = await Bid.createBid(auction,user,item, 100);
            const user2 = await User.createUser('no-one@nowhere.com', 'Some', 'One', 'hunter/2');
            const bid2 = await auction.addBid(user2,item,101);
            expect(bid2.id).to.not.be.undefined;
        });

        it("Shouldn't be able to out Bid an old Bid", async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user, "default-auction", false);
            const item = await Item.createItem(auction, 'A book', 'A completely empty book of uselessness.', 'useless_book.jpg');
            const bid = await Bid.createBid(auction,user,item, 100);
            const user2 = await User.createUser('no-one@nowhere.com', 'Some', 'One', 'hunter2');
            await expect(auction.addBid(user2, item, 100)).to.be.rejectedWith(InvalidKeyError);
        });



        //alias-es, aliyi, alien, alioctallies, what ever the plural of alias is.
        /**@todo Asker Hunter why expect to not be undefined makes sence? */
        it('Should be able to create a Bid using the Auction alias', async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user, "default-auction", false);
            const item = await Item.createItem(auction, 'A book', 'A completely empty book of uselessness.', 'useless_book.jpg');
            const bid = await auction.addBid(user,item,100); 
            expect(bid.id).to.not.be.undefined;
        });

        it('Should be able to create a Bid using the Item alias', async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user, "default-auction", false);
            const item = await Item.createItem(auction, 'A book', 'A completely empty book of uselessness.', 'useless_book.jpg');
            const bid = await item.addBid(auction,user,100); 
            expect(bid.id).to.not.be.undefined;
        });

        it('Should be able to create a Bid using the user alias', async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user, "default-auction", false);
            const item = await Item.createItem(auction, 'A book', 'A completely empty book of uselessness.', 'useless_book.jpg');
            const bid = await auction.addBid(user, item,100); 
            expect(bid.id).to.not.be.undefined;
        });
        
        //look-ups
        it('Should be able to find a bid via ID', async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user, "default-auction", false);
            const item = await Item.createItem(auction, 'A book', 'A completely empty book of uselessness.', 'useless_book.jpg');
            const bid = await Bid.createBid(auction,user,item,100);
            const lookup = await Bid.fromDatabaseId(bid.id);
            expect(bid.time).to.equal(lookup.time);
        });

        it('Should not be able to find invalid Bid', async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user, "default-auction", false);
            const item = await Item.createItem(auction, 'A book', 'A completely empty book of uselessness.', 'useless_book.jpg');
            const bid = await Bid.createBid(auction, user, item, 100);
            const lookup = Bid.fromDatabaseId(2139071);
            expect(lookup).to.eventually.be.rejected;
        });

        it('Should be able to find a Bid from an Auction', async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user, "default-auction", false);
            const item = await Item.createItem(auction, 'A book', 'A completely empty book of uselessness.', 'useless_book.jpg');
            const bid = await Bid.createBid(auction,user,item,100);
            const lookup = await Bid.fromDatabaseAuction(auction);
            expect(lookup).to.deep.include(bid);
        });

        it('Should be able to find a Bid from a User', async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user, "default-auction", false);
            const item = await Item.createItem(auction, 'A book', 'A completely empty book of uselessness.', 'useless_book.jpg');
            const bid = await Bid.createBid(auction,user,item,100);
            const lookup = await Bid.fromDatabaseUser(user);
            expect(lookup).to.deep.include(bid);
        });

        it('Should be able to find a Bid from an Item', async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user, "default-auction", false);
            const item = await Item.createItem(auction, 'A book', 'A completely empty book of uselessness.', 'useless_book.jpg');
            const bid = await Bid.createBid(auction,user,item,100);
            const lookup = await Bid.fromDatabaseItem(item);
            expect(lookup).to.deep.include(bid);
        });

        it('Should be able to find a Bid from an Auction & User', async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user, "default-auction", false);
            const item = await Item.createItem(auction, 'A book', 'A completely empty book of uselessness.', 'useless_book.jpg');
            const bid = await Bid.createBid(auction,user,item,100);
            const lookup = await Bid.getDatabaseAuctionUser(auction,user);
            expect(lookup).to.deep.include(bid);
        });

        it('Should be able to find an Bid from an Item & User', async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user, "default-auction", false);
            const item = await Item.createItem(auction, 'A book', 'A completely empty book of uselessness.', 'useless_book.jpg');
            const bid = await Bid.createBid(auction,user,item,100);
            const lookup = await Bid.getDatabaseItemUser(item, user);
            expect(lookup).to.deep.include(bid);
        });

        it('Should be able to find a bid from an Auction (paginated, default parameters)', async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user, "default-auction", false);
            const item = await Item.createItem(auction, 'A book', 'A completely empty book of uselessness.', 'useless_book.jpg');
            const bid = await Bid.createBid(auction, user, item, 100);
            await Bid.createBid(auction, user, item, 105);
            await Bid.createBid(auction, user, item, 110);
            await Bid.createBid(auction, user, item, 120);
            await Bid.createBid(auction, user, item, 130);
            await Bid.createBid(auction, user, item, 140);
            await Bid.createBid(auction, user, item, 150);
            await Bid.createBid(auction, user, item, 160);
            await Bid.createBid(auction, user, item, 170);
            await Bid.createBid(auction, user, item, 185);
            await Bid.createBid(auction, user, item, 1000000);
            const nonUser = await User.createUser('no-one@somewhere.com', 'No', 'One', 'hunter/2');
            const nonAuction = await Auction.createAuction("Uncle_Jim's_yard", 'jus dont tell yer mom', '2 lefts north of the junk yard, past the dog tied to that there tree over there', user, "aJbQ$wKiz%Ve4", false);
            const nonItem = await Item.createItem(auction, 'A book', 'A completely empty book of uselessness.', 'useless_book.jpg');
            const nonBid = Bid.createBid(nonAuction,nonUser,nonItem,20);
            const lookup = await Bid.fromDatabaseUserPaginated(user);
            expect(lookup).to.deep.include(bid);
            expect(lookup).to.not.deep.include(nonItem);
        });

        it("Shouldn't be able to find an bid from an Auction (paginated, custom parameters)", async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user, "default-auction", false);
            const item = await Item.createItem(auction, 'A book', 'A completely empty book of uselessness.', 'useless_book.jpg');
            const bid = await Bid.createBid(auction,user,item,100);
            await Bid.createBid(auction, user,item,105);
            const nonUser = await User.createUser('no-one@somewhere.com', 'No', 'One', 'hunter/2');
            const nonAuction = await Auction.createAuction("Uncle_Jim's_yard", 'jus dont tell yer mom', '2 lefts north of the junk yard, past the dog tied to that there tree over there', user, "aJbQ$wKiz%Ve4", false);
            const nonItem = await Item.createItem(auction, 'A old book', 'A completely empty book of uselessness.', 'useless_book.jpg');
            const nonBid = Bid.createBid(nonAuction,nonUser,nonItem,20);
            const lookup = await Bid.fromDatabaseUserPaginated(user,1,2);
            expect(lookup).to.deep.include(bid);
            expect(lookup).to.not.deep.include(nonBid);
        });

        it('Should be able to find an bid from an Auction (paginated, invalid parameters)', async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user, "default-auction", false);
            const item = await Item.createItem(auction, 'A book', 'A completely empty book of uselessness.', 'useless_book.jpg');
            const bid = await Bid.createBid(auction,user,item,100);
            const lookup = await Bid.fromDatabaseUserPaginated(user, 0, 10);
            expect(lookup).to.deep.equal([]);
            const otherLookup = await Bid.fromDatabaseUserPaginated(user, 10, 0);
            expect(otherLookup).to.deep.equal([]);
        });
    });

    describe('Instance Methods', () => {

        interface state {
            user: User;
            auction: Auction;
            item: Item;
            bid: Bid;
        }

        let state : state = {
            user : undefined,
            auction: undefined,
            item: undefined,
            bid: undefined
        };

        beforeEach(async () => {
            state.user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            state.auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', state.user, "default-auction", false);
            state.item = await state.auction.addItem('A book', 'A completely empty book of uselessness.', 'useless_book.jpg');
            state.bid = await state.item.addBid(state.auction,state.user,100);
        });

        it('Should be able to load changes', async () => {
            const { bid } = state;
            const lookup = await Bid.fromDatabaseId(bid.id);
            bid.money = bid.money+17;
            await bid.save();
            await lookup.load();
            expect(lookup).to.deep.equal(bid);
        });

        it('Should be able to save changes', async () => {
            const { bid } = state;
            bid.money +=13;
            await bid.save();
            const lookup = await Bid.fromDatabaseId(bid.id);
            expect(lookup).to.deep.equal(bid);
        });

        it('Should be able to delete items.', async () => {
            const { bid } = state;
            const id = bid.id;
            await bid.delete();
            const lookup = Bid.fromDatabaseId(id);
            expect(lookup).to.eventually.be.rejected;
        })
    })
});