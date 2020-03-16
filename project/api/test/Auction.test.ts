import 'mocha';
import chai, { expect } from 'chai';
import cap from 'chai-as-promised';
import Auction from '../src/db/Auctions';
import { migrate, rollback } from '../src/services/Database';
import User from '../src/db/User';

chai.use(cap);

describe('Auction : Database Class', () => {

    beforeEach(async () => {
        await rollback().then(migrate)
    })

    afterEach(async () => {
        await rollback();
    });

    describe('Static Methods', () => {
        it('Should be able to create an Auction', async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user,  "default-auction", false);
            expect(auction.id).to.not.be.undefined;
        });

        it('Should be able to find an Action by ID', async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user,  "default-auction",false);
            const lookup = await Auction.fromDataBaseID(auction.id);
            expect(auction).to.deep.equal(lookup);
        });

        it('Should be able to find an Auction from name', async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user, "default-auction", false);
            const lookup = await Auction.fromDataBaseName('DefaultAuction');
            expect(auction).to.deep.equal(lookup);
        });

        it('Should be able to find an Auction from Code', async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user, "default-auction", false);
            const code = auction.pin;
            const lookup = await Auction.fromDataBaseInviteCode(code);
            expect(auction).to.deep.equal(lookup);
        });

        it('Should be able to find an Auction from URL', async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user,  "default-auction", false);
            const url = auction.url;
            const lookup = await Auction.fromDataBaseURL(url);
            expect(auction).to.deep.equal(lookup);
        });

        it('Should not be able to find an Auction from an invalid ID', async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user,  "default-auction", false);
            const lookup = Auction.fromDataBaseID(3423);
            expect(lookup).to.eventually.be.rejected;
        });

        it('Should not be able to find a User from an invalid Name', async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user,  "defaul-auction", false);
            const lookup = Auction.fromDataBaseName('StupidName');
            expect(lookup).to.eventually.be.rejected;
        });

        it('Should not be able to find a User from an invalid Code', async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user,  "default-auction", false);
            const lookup = Auction.fromDataBaseInviteCode("000000");
            expect(lookup).to.eventually.be.rejected;
        });
    });

    describe('Instance Methods', () => {

        let state = {
            user: undefined,
            auction: undefined,
        };

        beforeEach(async () => {
            state.user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            state.auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', state.user, "default-auction", false);
        });

        it('Should be able to save changes', async () => {
            const { auction } = state;
            auction.location = 'Your moms house';
            await auction.save();
            const newObj = await Auction.fromDataBaseID(auction.id);
            expect(newObj).to.deep.equal(auction);
        });

        it('Should be able to load changes', async () => {
            const { auction } = state;
            const oldRef = await Auction.fromDataBaseID(auction.id);
            auction.location = 'My moms house';
            await auction.save();
            await oldRef.load();
            expect(oldRef).to.deep.equal(auction);
        });

        it('Should not be able to find the same auction after a regen pin', async () =>{
            const lookup = state.auction.pin;
            await state.auction.resetPin();
            await state.auction.save();
            const newAuction = Auction.fromDataBaseInviteCode(lookup);
            expect(newAuction).to.eventually.be.rejected;
        });
    })
})