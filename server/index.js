const path = require("path");
const dotenvAbsolutePath = path.join(__dirname, "../.env");
require("dotenv").config({
    path: dotenvAbsolutePath,
});

const fs = require("fs-extra");
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const passport = require("passport");
const OAuth2Strategy = require("passport-oauth2").Strategy;
const checkAuth = require("./middleware/checkAuth");
const api = require("./api");
const SocketService = require("./SocketService");
const storage = require("node-persist");
const RootPath = require("./helpers/RootPath");
const { dirname } = require( "path" );
app.set("json spaces", 4);

storage.init({
    dir: `${RootPath.storage}`,
});

// app.use(cors());
app.use(cookieParser());
app.use(cookieSession({ secret: "mysupercoolsecretchangeforproduction" }));
app.use(express.json());
app.use(express.urlencoded());
app.use(passport.initialize());
app.use(passport.session());

// Login related ========================================================================================================
passport.use(new OAuth2Strategy(
    {
        authorizationURL: "https://id.twitch.tv/oauth2/authorize",
        tokenURL: "https://id.twitch.tv/oauth2/token",
        clientID: process.env.TWITCH_CLIENT_ID,
        clientSecret: process.env.TWITCH_CLIENT_SECRET,
        callbackURL: `http://localhost:${process.env.PORT}/auth/twitch/callback`,
        scope: "user:edit:broadcast",
    },
    async function (accessToken, refreshToken, profile, done) {
        try {
            await storage.setItem("accessToken", accessToken);

            const user = await api.get(`/users`);
            if ( user ) {
                return done(null, user.data.data[0]);
            }
        } catch (error) {
            console.log(error);
        }
    }
));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "null"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

app.use(express.static(path.join(__dirname, "../build")));

app.get("/auth/twitch", passport.authenticate("oauth2"));
app.get('/auth/twitch/callback', passport.authenticate('oauth2', { failureRedirect: '/login' }), function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
});
//========================================================================================================

app.use("/api/*", checkAuth);

app.use("/api/user/currentUser", require("./routes/user"));

// Twitch related endpoints
require("./routes/channel").register(app);
app.use("/api/search", require("./routes/search"));

// Upload game background
require("./routes/upload").register(app);

app.use("/games", express.static(`${RootPath.upload}/games`));
app.use(express.static(path.join(__dirname, "../dist")))

let initialStart = true;
app.get("*", async (req, res) => {
    // if ( initialStart ) {
    //     initialStart = false;
    //     const auth = await api.checkAuth(req);
    //     console.log("The auth response", auth);
    //     if ( auth.error && auth.status === 401 ) {
    //         res.redirect("/login");
    //     }
    // }
    // console.log("Trying to send index file");
    // res.json({
    //     message: "Hello world"
    // })
    res.sendFile(path.join(__dirname + "./../dist/index.html"));
});

app.use( (err, req, res, next) => {
    if ( !err ) return next();
    if ( err instanceof api.ApiError ) {
        return res.status(err.status).json({
            error: true,
            message: err.message,
            errorMessage: err.errorMessage.toString(),
        });
    }
})

http.listen(process.env.PORT || 6969, async () => {
    await fs.ensureDir(`${RootPath.upload}/games/backgrounds`);
});

app.set("socketService", new SocketService(http));