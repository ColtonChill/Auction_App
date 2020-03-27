import 'mocha';
import chai, { expect } from 'chai';
import cap from 'chai-as-promised';
import Auction from '../src/db/Auction';
import AuctionMembership from "../src/db/AuctionMembership";
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
            const bid = await Bid.createBid(auction.id,user.id,item.id, 100);
            expect(bid.id).to.not.be.undefined;
        });

        it("Shouldn't be able to create a Bid", async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user, "default-auction", false);
            const item = await Item.createItem(auction, 'A book', 'A completely empty book of uselessness.', 'useless_book.jpg');
            const bid = await Bid.createBid(auction.id,user.id,item.id, 100);
            expect(bid.id).to.not.be.undefined;
        });

        it("Should be able to out Bid an old Bid", async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user, "default-auction", false);
            const item = await Item.createItem(auction, 'A book', 'A completely empty book of uselessness.', 'useless_book.jpg');
            await Bid.createBid(auction.id,user.id,item.id, 100);
            const user2 = await User.createUser('no-one@nowhere.com', 'Some', 'One', 'hunter/2');
            await AuctionMembership.createMembership(user2, auction);
            const bid2 = await auction.addBid(user2,item,101);
            expect(bid2.id).to.not.be.undefined;
        });

        it("Shouldn't be able to out Bid an old Bid", async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user, "default-auction", false);
            const item = await Item.createItem(auction, 'A book', 'A completely empty book of uselessness.', 'useless_book.jpg');
            const bid = await Bid.createBid(auction.id,user.id,item.id, 100);
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
            const bid = await Bid.createBid(auction.id,user.id,item.id,100);
            const lookup = await Bid.fromDatabaseId(bid.id);
            expect(bid.time).to.equal(lookup.time);
        });

        it('Should not be able to find invalid Bid', async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user, "default-auction", false);
            const item = await Item.createItem(auction, 'A book', 'A completely empty book of uselessness.', 'useless_book.jpg');
            const bid = await Bid.createBid(auction.id, user.id, item.id, 100);
            const lookup = Bid.fromDatabaseId(2139071);
            expect(lookup).to.eventually.be.rejected;
        });

        it('Should be able to find a Bid from an Auction', async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user, "default-auction", false);
            const item = await Item.createItem(auction, 'A book', 'A completely empty book of uselessness.', 'useless_book.jpg');
            const bid = await Bid.createBid(auction.id,user.id,item.id,100);
            const lookup = await Bid.fromDatabaseAuction(auction.id);
            expect(lookup).to.deep.include(bid);
        });

        it('Should be able to find a Bid from a User', async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user, "default-auction", false);
            const item = await Item.createItem(auction, 'A book', 'A completely empty book of uselessness.', 'useless_book.jpg');
            const bid = await Bid.createBid(auction.id,user.id,item.id,100);
            const lookup = await Bid.fromDatabaseUser(user.id);
            expect(lookup).to.deep.include(bid);
        });

        it('Should be able to find a Bid from an Item', async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user, "default-auction", false);
            const item = await Item.createItem(auction, 'A book', 'A completely empty book of uselessness.', 'useless_book.jpg');
            const bid = await Bid.createBid(auction.id,user.id,item.id,100);
            const lookup = await Bid.fromDatabaseItem(item.id);
            expect(lookup).to.deep.include(bid);
        });

        it('Should be able to find a Bid from an Auction & User', async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user, "default-auction", false);
            const item = await Item.createItem(auction, 'A book', 'A completely empty book of uselessness.', 'useless_book.jpg');
            const bid = await Bid.createBid(auction.id,user.id,item.id,100);
            const lookup = await Bid.getDatabaseAuctionUser(auction.id,user.id);
            expect(lookup).to.deep.include(bid);
        });

        it('Should be able to find an Bid from an Item & User', async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user, "default-auction", false);
            const item = await Item.createItem(auction, 'A book', 'A completely empty book of uselessness.', 'useless_book.jpg');
            const bid = await Bid.createBid(auction.id,user.id,item.id,100);
            const lookup = await Bid.getDatabaseItemUser(item.id, user.id);
            expect(lookup).to.deep.include(bid);
        });

        // it('Should be able to find all winning bids', async () => {
        //     const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
        //     const user2 = await User.createUser('sometwo@nowhere.com', 'Some', 'Two', 'hunter2');
        //     const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user, "default-auction", false);
        //     const item = await Item.createItem(auction, 'A book', 'A completely empty book of uselessness.', 'useless_book.jpg');
        //     const item2 = await Item.createItem(auction, 'Another book', 'A completely empty book of uselessness.', 'useless_book.jpg');
        //     const bid = await Bid.createBid(auction, user, item, 100);
        //     await Bid.createBid(auction, user, item2, 100);
        //     await Bid.createBid(auction, user2, item, 105);
        //     const expectedBid = await Bid.createBid(auction, user, item, 110);
        //     const expectedBid2 = await Bid.createBid(auction, user2, item2, 105);
        //     const lookup = await Bid.fromDatabaseAuctionWinningBids(auction.id);
        //     expect(lookup).to.deep.include(expectedBid);
        //     expect(lookup).to.deep.include(expectedBid2);
        //     expect(lookup).to.not.deep.include(bid);
        // });

        it('Should be able to find a bid from an Auction (paginated, default parameters)', async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user, "default-auction", false);
            const item = await Item.createItem(auction, 'A book', 'A completely empty book of uselessness.', 'useless_book.jpg');
            const bid = await Bid.createBid(auction.id, user.id, item.id, 100);
            await Bid.createBid(auction.id, user.id, item.id, 105);
            await Bid.createBid(auction.id, user.id, item.id, 110);
            await Bid.createBid(auction.id, user.id, item.id, 120);
            await Bid.createBid(auction.id, user.id, item.id, 130);
            await Bid.createBid(auction.id, user.id, item.id, 140);
            await Bid.createBid(auction.id, user.id, item.id, 150);
            await Bid.createBid(auction.id, user.id, item.id, 160);
            await Bid.createBid(auction.id, user.id, item.id, 170);
            await Bid.createBid(auction.id, user.id, item.id, 185);
            await Bid.createBid(auction.id, user.id, item.id, 1000000);
            const nonUser = await User.createUser('no-one@somewhere.com', 'No', 'One', 'hunter/2');
            const nonAuction = await Auction.createAuction("Uncle_Jim's_yard", 'jus dont tell yer mom', '2 lefts north of the junk yard, past the dog tied to that there tree over there', user, "aJbQ$wKiz%Ve4", false);
            const nonItem = await Item.createItem(auction, 'A book', 'A completely empty book of uselessness.', 'useless_book.jpg');
            const nonBid = Bid.createBid(nonAuction.id, nonUser.id,nonItem.id ,20);
            const lookup = await Bid.fromDatabaseUserPaginated(user.id);
            expect(lookup).to.deep.include(bid);
            expect(lookup).to.not.deep.include(nonItem);
        });

        it("Shouldn't be able to find an bid from an Auction (paginated, custom parameters)", async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user, "default-auction", false);
            const item = await Item.createItem(auction, 'A book', 'A completely empty book of uselessness.', 'useless_book.jpg');
            const bid = await Bid.createBid(auction.id, user.id, item.id,100);
            await Bid.createBid(auction.id, user.id, item.id,105);
            const nonUser = await User.createUser('no-one@somewhere.com', 'No', 'One', 'hunter/2');
            const nonAuction = await Auction.createAuction("Uncle_Jim's_yard", 'jus dont tell yer mom', '2 lefts north of the junk yard, past the dog tied to that there tree over there', user, "aJbQ$wKiz%Ve4", false);
            const nonItem = await Item.createItem(auction, 'A old book', 'A completely empty book of uselessness.', 'useless_book.jpg');
            const nonBid = Bid.createBid(nonAuction.id, nonUser.id, nonItem.id ,20);
            const lookup = await Bid.fromDatabaseUserPaginated(user.id,1,2);
            expect(lookup).to.deep.include(bid);
            expect(lookup).to.not.deep.include(nonBid);
        });

        it('Should be able to find an bid from an Auction (paginated, invalid parameters)', async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user, "default-auction", false);
            const item = await Item.createItem(auction, 'A book', 'A completely empty book of uselessness.', 'useless_book.jpg');
            const bid = await Bid.createBid(auction.id, user.id, item.id,100);
            const lookup = await Bid.fromDatabaseUserPaginated(user.id, 0, 10);
            expect(lookup).to.deep.equal([]);
            const otherLookup = await Bid.fromDatabaseUserPaginated(user.id, 10, 0);
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