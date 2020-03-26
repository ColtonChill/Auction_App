import 'mocha';
import chai, { expect } from 'chai';
import cap from 'chai-as-promised';
import Auction from '../src/db/Auction';
import { migrate, rollback } from '../src/services/Database';
import User from '../src/db/User';
import AuctionMembership from '../src/db/AuctionMembership';
import Item from '../src/db/Item';

chai.use(cap);

describe('Item : Database Class', () => {

    beforeEach(async () => {
        await rollback().then(migrate)
    })

    afterEach(async () => {
        await rollback();
    });

    describe('Static Methods', () => {
        it('Should be able to create an Item', async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user, "default-auction", false);
            const item = await Item.createItem(auction, 'A book', 'A completely empty book of uselessness.', 'useless_book.jpg');
            expect(item.id).to.not.be.undefined;
        });

        it('Should be able to create an Item using the Auction alias', async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user, "default-auction", false);
            const item = await auction.addItem('A book', 'A completely empty book of uselessness.', 'useless_book.jpg');
            expect(item.id).to.not.be.undefined;
        });

        it('Should be able to find an Item', async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user, "default-auction", false);
            const item = await Item.createItem(auction, 'A book', 'A completely empty book of uselessness.', 'useless_book.jpg');
            const lookup = await Item.fromDatabaseId(item.id);
            expect(item.name).to.equal(lookup.name);
        });

        it('Should not be able to find invalid Items', async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user, "default-auction", false);
            const lookup = Item.fromDatabaseId(2139071);
            expect(lookup).to.eventually.be.rejected;
        });

        it('Should be able to find an Item from an Auction', async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user, "default-auction", false);
            const item = await Item.createItem(auction, 'A book', 'A completely empty book of uselessness.', 'useless_book.jpg');
            const lookup = await Item.fromDatabaseAuction(auction.id);
            expect(lookup).to.deep.include(item);
        });

        it('Should be able to find an Item from an Auction (paginated, default parameters)', async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user, "default-auction", false);
            const item = await Item.createItem(auction, 'A book', 'A completely empty book of uselessness.', 'useless_book.jpg');
            await Item.createItem(auction, 'A book', 'A completely empty book of uselessness.', 'useless_book.jpg');
            await Item.createItem(auction, 'A book', 'A completely empty book of uselessness.', 'useless_book.jpg');
            await Item.createItem(auction, 'A book', 'A completely empty book of uselessness.', 'useless_book.jpg');
            await Item.createItem(auction, 'A book', 'A completely empty book of uselessness.', 'useless_book.jpg');
            await Item.createItem(auction, 'A book', 'A completely empty book of uselessness.', 'useless_book.jpg');
            await Item.createItem(auction, 'A book', 'A completely empty book of uselessness.', 'useless_book.jpg');
            await Item.createItem(auction, 'A book', 'A completely empty book of uselessness.', 'useless_book.jpg');
            await Item.createItem(auction, 'A book', 'A completely empty book of uselessness.', 'useless_book.jpg');
            await Item.createItem(auction, 'A book', 'A completely empty book of uselessness.', 'useless_book.jpg');
            const nonItem = await Item.createItem(auction, 'A new book', 'A completely empty book of uselessness.', 'useless_book.jpg');
            const lookup = await Item.fromDatabaseAuctionPaginated(auction.id);
            expect(lookup).to.deep.include(item);
            expect(lookup).to.not.deep.include(nonItem);
        });

        it('Should be able to find an Item from an Auction (paginated, custom parameters)', async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user, "default-auction", false);
            const item = await Item.createItem(auction, 'A book', 'A completely empty book of uselessness.', 'useless_book.jpg');
            await Item.createItem(auction, 'A book', 'A completely empty book of uselessness.', 'useless_book.jpg');
            const nonItem = await Item.createItem(auction, 'A new book', 'A completely empty book of uselessness.', 'useless_book.jpg');
            const lookup = await Item.fromDatabaseAuctionPaginated(auction.id, 1, 2);
            expect(lookup).to.deep.include(item);
            expect(lookup).to.not.deep.include(nonItem);
        });

        it('Should be able to find an Item from an Auction (paginated, invalid parameters)', async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user, "default-auction", false);
            const item = await Item.createItem(auction, 'A book', 'A completely empty book of uselessness.', 'useless_book.jpg');
            const lookup = await Item.fromDatabaseAuctionPaginated(auction.id, 0, 10);
            expect(lookup).to.deep.equal([]);
            const otherLookup = await Item.fromDatabaseAuctionPaginated(auction.id, 10, 0);
            expect(otherLookup).to.deep.equal([]);
        });
    });

    describe('Instance Methods', () => {

        interface state {
            user: User;
            auction: Auction;
            item: Item;
        }

        let state : state = {
            user : undefined,
            auction: undefined,
            item: undefined,
        };

        beforeEach(async () => {
            state.user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            state.auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', state.user, "default-auction", false);
            state.item = await state.auction.addItem('A book', 'A completely empty book of uselessness.', 'useless_book.jpg');
        });

        it('Should be able to load changes', async () => {
            const { item } = state;
            const lookup = await Item.fromDatabaseId(item.id);
            item.name = 'A Useless Book';
            await item.save();
            await lookup.load();
            expect(lookup).to.deep.equal(item);
        });

        it('Should be able to save changes', async () => {
            const { item } = state;
            item.name = 'A Useless Book';
            await item.save();
            const lookup = await Item.fromDatabaseId(item.id);
            expect(lookup).to.deep.equal(item);
        });

        it('Should be able to delete items.', async () => {
            const { item } = state;
            const id = item.id;
            await item.delete();
            const lookup = Item.fromDatabaseId(id);
            expect(lookup).to.eventually.be.rejected;
        })
    })
});