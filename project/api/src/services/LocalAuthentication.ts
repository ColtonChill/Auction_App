import passport from 'koa-passport';
import LocalStrategy from 'passport-local';
import User from '../db/User';

const options = {};

passport.serializeUser((user, done) => { done(null, user.id); })

passport.deserializeUser((id, done) => {
    try {
        const user = User.fromDatabaseId(id);
        return done(null, user); // The user exists and was deserialized properly.
    } catch (err) {
        if (err.name === "InvalidKeyError") {
            return done(null, false); // The user does not exist in the database.
        }
        return done(err, false); // Something happened that was bad.
    }
})

passport.use(new LocalStrategy(options, (username, password, done) => {
    try {
        const user = User.fromDatabaseEmailPassword(username, password);
        return done(null, user); // The user is in the database and authenticated properly.
    } catch (err) {
        if (err.name === "InvalidKeyError") {
            return done(null, false); // The user does not exist in the database.
        }
        return done(err, false); // Something happened that was bad.
    }
}))

export default passport;