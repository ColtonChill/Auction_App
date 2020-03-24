
import 'mocha';
import chai, { expect } from 'chai';
import cap from 'chai-as-promised';
import Auction from '../src/db/Auction';
import { migrate, rollback } from '../src/services/Database';
import User from '../src/db/User';
import AuctionMembership from '../src/db/AuctionMembership';
import Item, {LiveItem, SilentItem} from '../src/db/Item';

chai.use(cap);

describe('SilentItem : Database Class', () => {

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
            const item = await SilentItem.createSilentItem(auction, 'A book', 'A completely empty book of uselessness.', 'useless_book.jpg', 1, 1);
            expect(item.silentId).to.not.be.undefined;
        });

        it('Should be able to create a SilentItem using the Auction alias', async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user, "default-auction", false);
            const item = await auction.addSilentItem('A book', 'A completely empty book of uselessness.', 'useless_book.jpg', 1, 1);
            expect(item.id).to.not.be.undefined;
        });

        it('Should be able to find an Item', async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user, "default-auction", false);
            const item = await SilentItem.createSilentItem(auction, 'A book', 'A completely empty book of uselessness.', 'useless_book.jpg', 1, 1);
            const lookup = await Item.fromDatabaseId(item.id);
            expect(lookup instanceof SilentItem).to.be.true;
        });


        it('Should be able to find an Item from an Auction', async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user, "default-auction", false);
            const item = await SilentItem.createSilentItem(auction, 'A book', 'A completely empty book of uselessness.', 'useless_book.jpg', 1, 1);
            const lookup = await Item.fromDatabaseAuction(auction);
            expect(lookup[0] instanceof SilentItem).to.be.true;
        });
    });

    describe('Instance Methods', () => {

        interface state {
            user: User;
            auction: Auction;
            item: SilentItem;
        }

        let state : state = {
            user : undefined,
            auction: undefined,
            item: undefined,
        };

        beforeEach(async () => {
            state.user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            state.auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', state.user, "default-auction", false);
            state.item = await state.auction.addSilentItem('A book', 'A completely empty book of uselessness.', 'useless_book.jpg', 1, 1);
        });

        it('Should be able to load changes', async () => {
            const { item } = state;
            const lookup = await Item.fromDatabaseId(item.id);
            item.startingPrice = 101;
            await item.save();
            await lookup.load();
            expect(lookup).to.deep.equal(item);
        });

        it('Should be able to save changes', async () => {
            const { item } = state;
            item.startingPrice = 101;
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