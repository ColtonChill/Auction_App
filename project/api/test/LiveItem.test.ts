import 'mocha';
import chai, { expect } from 'chai';
import cap from 'chai-as-promised';
import Auction from '../src/db/Auction';
import { migrate, rollback } from '../src/services/Database';
import User from '../src/db/User';
import AuctionMembership from '../src/db/AuctionMembership';
import Item, {LiveItem, SilentItem} from '../src/db/Item';

chai.use(cap);

describe('LiveItem : Database Class', () => {

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
            const item = await LiveItem.createLiveItem(auction, 'A book', 'A completely empty book of uselessness.', 'useless_book.jpg', 100);
            expect(item.liveID).to.not.be.undefined;
        });

        it('Should be able to create a LiveItem using the Auction alias', async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user, "default-auction", false);
            const item = await auction.addLiveItem('A book', 'A completely empty book of uselessness.', 'useless_book.jpg', 100);
            expect(item.id).to.not.be.undefined;
        });

        it('Should be able to find an Item', async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user, "default-auction", false);
            const item = await LiveItem.createLiveItem(auction, 'A book', 'A completely empty book of uselessness.', 'useless_book.jpg', 100);
            const lookup = await Item.fromDatabaseId(item.id);
            expect(lookup instanceof LiveItem).to.be.true;
        });


        it('Should be able to find an Item from an Auction', async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user, "default-auction", false);
            const item = await LiveItem.createLiveItem(auction, 'A book', 'A completely empty book of uselessness.', 'useless_book.jpg', 100);
            const lookup = await Item.fromDatabaseAuction(auction.id);
            expect(lookup[0] instanceof LiveItem).to.be.true;
        });
    });

    describe('Instance Methods', () => {

        interface state {
            user: User;
            auction: Auction;
            item: LiveItem;
        }

        let state : state = {
            user : undefined,
            auction: undefined,
            item: undefined,
        };

        beforeEach(async () => {
            state.user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            state.auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', state.user, "default-auction", false);
            state.item = await state.auction.addLiveItem('A book', 'A completely empty book of uselessness.', 'useless_book.jpg', 100);
        });

        it('Should be able to load changes', async () => {
            const { item } = state;
            const lookup = await Item.fromDatabaseId(item.id);
            item.winningPrice = 101;
            await item.save();
            await lookup.load();
            expect(lookup).to.deep.equal(item);
        });

        it('Should be able to save changes', async () => {
            const { item } = state;
            item.winningPrice = 101;
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