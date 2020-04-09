import 'mocha';
import chai, { expect } from 'chai';
import cap from 'chai-as-promised';
import Auction from '../src/db/Auction';
import { migrate, rollback } from '../src/services/Database';
import User from '../src/db/User';
import AuctionMembership from '../src/db/AuctionMembership';

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
            const lookup = await Auction.fromDatabaseID(auction.id);
            expect(auction).to.deep.equal(lookup);
        });

        it('Should be able to find an Auction from name', async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user, "default-auction", false);
            const lookup = await Auction.fromDatabaseName('DefaultAuction');
            expect(auction).to.deep.equal(lookup);
        });

        it('Should be able to find an Auction from Code', async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user, "default-auction", false);
            const code = auction.pin;
            const lookup = await Auction.fromDatabaseInviteCode(code);
            expect(auction).to.deep.equal(lookup);
        });

        it('Should be able to find an Auction from URL', async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user,  "default-auction", false);
            const url = auction.url;
            const lookup = await Auction.fromDatabaseURL(url);
            expect(auction).to.deep.equal(lookup);
        });
        it('Should be able to list public Auctions', async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'hi mom', 'Merica', user, "default-auction", true );
            const auction2 = await Auction.createAuction('DefaultAuction2', 'hi dad', 'Merica', user, "default-auction2", false );
            const auction3 = await Auction.createAuction('DefaultAuction3', 'hi son', 'Merica', user, "default-auction3", false );
            const auction4 = await Auction.createAuction('DefaultAuction4', 'hi daughter', 'Merica', user, "default-auction4", false );
            const auction5 = await Auction.createAuction('DefaultAuction5', 'hi grandma', 'Merica', user, "default-auction5", true );
            const lookup = await Auction.fromDatabasePublicAuctions();
            const expectedAuctions = [auction2, auction3, auction4]
            expect(lookup).to.deep.equal(expectedAuctions)
        })

        it('Should not be able to find an Auction from an invalid ID', async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user,  "default-auction", false);
            const lookup = Auction.fromDatabaseID(3423);
            expect(lookup).to.eventually.be.rejected;
        });

        it('Should not be able to find a User from an invalid Name', async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user,  "defaul-auction", false);
            const lookup = Auction.fromDatabaseName('StupidName');
            expect(lookup).to.eventually.be.rejected;
        });

        it('Should not be able to find a User from an invalid Code', async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const auction = await Auction.createAuction('DefaultAuction', 'Hi mom', 'Merica', user,  "default-auction", false);
            const lookup = Auction.fromDatabaseInviteCode("000000");
            expect(lookup).to.eventually.be.rejected;
        });
    });

    describe('Instance Methods', () => {

        interface state {
            user: User;
            auction: Auction;
        }

        let state : state = {
            user : undefined,
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
            const newObj = await Auction.fromDatabaseID(auction.id);
            expect(newObj).to.deep.equal(auction);
        });

        it('Should be able to load changes', async () => {
            const { auction } = state;
            const oldRef = await Auction.fromDatabaseID(auction.id);
            auction.location = 'My moms house';
            await auction.save();
            await oldRef.load();
            expect(oldRef).to.deep.equal(auction);
        });

        it('Should not be able to find the same auction after a regen pin', async () =>{
            const lookup = state.auction.pin;
            await state.auction.resetPin();
            await state.auction.save();
            const newAuction = Auction.fromDatabaseInviteCode(lookup);
            expect(newAuction).to.eventually.be.rejected;
        });
        it('Should be able to toggle privacy', async () => {
            const lookup = state.auction.hidden;
            await state.auction.togglePrivacy();
            await state.auction.save();
            expect(state.auction.hidden).to.not.equal(lookup);
        })
        it('Should be able to kick a user', async () =>{
            const { auction, user } = state;
            const user2 = await User.createUser('someone2@nowhere.com', 'Some', 'One', 'hunter2');
            await auction.addMember(user2);
            const membership = await AuctionMembership.getMembership(user2, auction);
            expect(await auction.members).to.deep.include(membership)
            await auction.kick(user2);
            expect(await auction.members).to.not.deep.include(membership)
        } )

        it('Should be able to ban a user', async () =>{
            const {auction, user} = state;
            const user2 = await User.createUser('someone@nowher.com', 'Some', 'One', 'hunter2');
            await auction.addMember(user2);
            const membership = await AuctionMembership.getMembership(user2, auction);
            const lookup = membership.banned;
            await auction.ban(user2);
            const newMembership = await AuctionMembership.getMembership(user2, auction);
            expect(newMembership.banned).to.equal(true);
        })
    })
})