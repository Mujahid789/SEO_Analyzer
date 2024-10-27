const passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
exports.googleProvider = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // callbackURL: "http://www.example.com/auth/google/callback"
    callbackURL: process.env.GOOGLE_CLIENT_SECRET,
},
    function (accessToken, refreshToken, profile, cb) {
        return cb(err, user);
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
        });
    }
);


// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     // callbackURL: "http://www.example.com/auth/google/callback"
//     callbackURL: process.env.GOOGLE_CLIENT_SECRET,
//   },
//   function(accessToken, refreshToken, profile, cb) {
//     User.findOrCreate({ googleId: profile.id }, function (err, user) {
//       return cb(err, user);
//     });
//   }
// ));

// passport.serializeUser(function(user, done){
//     done(null, user)
// })

// passport.deserializeUser(function(user, done){

// })