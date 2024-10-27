const passport = require("passport");

passport.serializeUser((userObj, done) => {
    done(null, userObj.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

module.exports = passport;
