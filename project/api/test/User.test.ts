import 'mocha';
import chai, { expect } from 'chai';
import cap from 'chai-as-promised';
import User from '../src/db/User';
import { migrate, rollback } from '../src/services/Database';

chai.use(cap);

describe('User : Database Class', () => {

    beforeEach(async () => {
        await migrate();
    })

    afterEach(async () => {
        await rollback();
    });

    describe('Static Methods', () => {
        it('Should be able to create a user', async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            expect(user.id).to.not.be.undefined;
        });

        it('Should be able to find a User by ID', async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const lookup = await User.fromDatabaseId(user.id);
            expect(user).to.deep.equal(lookup);
        });

        it('Should be able to find a User from email and password', async () => {
            const user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
            const lookup = await User.fromDatabaseEmailPassword('someone@nowhere.com', 'hunter2');
            expect(user).to.deep.equal(lookup);
        });

        it('Should not be able to find a User from an invalid ID', async () => {
            const lookup = User.fromDatabaseId(123);
            expect(lookup).to.eventually.be.rejected;
        });

        it('Should not be able to find a User from an invalid email and password', async () => {
            const lookup = User.fromDatabaseEmailPassword('someone@nowhere.com', 'hunter3');
            expect(lookup).to.eventually.be.rejected;
        });
    });

    describe('Instance Methods', () => {

        let state = {
            user: undefined,
        };

        beforeEach(async () => {
            state.user = await User.createUser('someone@nowhere.com', 'Some', 'One', 'hunter2');
        });

        it('Should be able to save changes', async () => {
            const { user } = state;
            user.lastName = 'Two';
            await user.save();
            const newObj = await User.fromDatabaseId(user.id);
            expect(newObj).to.deep.equal(user);
        });

        it('Should be able to load changes', async () => {
            const { user } = state;
            const oldRef = await User.fromDatabaseId(user.id);
            user.lastName = 'Two';
            await user.save();
            await oldRef.load();
            expect(oldRef).to.deep.equal(user);
        })
    })
})