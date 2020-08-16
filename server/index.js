
require("dotenv").config();
const path = require("path");
const fs = require("fs");
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const passport = require("passport");
const OAuth2Strategy = require("passport-oauth2").Strategy;
const api = require("./api");
const SocketService = require("./SocketService");
const storage = require("node-persist");
app.set("json spaces", 4);

!fs.existsSync(path.resolve(__dirname, `./server/uploads/games/backgrounds`)) && fs.mkdirSync(`./server/uploads/games/backgrounds`, { recursive: true });

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

app.use("/api/user", require("./routes/user"));

// Twitch related endpoints
app.use("/api/channel", require("./routes/channel"));
app.use("/api/search", require("./routes/search"));

// Upload game background
app.use("/api/game", require("./routes/upload"));

app.get("/api/hello", (req, res) => {
    return res.json({
        message: "Hello world"
    })
})

app.use("/games", express.static(path.join(__dirname, "./uploads/games")));
app.use(express.static(path.join(__dirname, "../dist")))

let initialStart = true;
app.get("*", async (req, res) => {
    if ( initialStart ) {
        initialStart = false;
        const auth = await api.checkAuth(req);
        console.log("The auth response", auth);
        if ( auth.error && auth.status === 401 ) {
            res.redirect("/login");
        }
    }

    res.sendFile(path.join(__dirname + "./../index.html"));
});

http.listen(process.env.PORT || 6969, async () => {
    await storage.init({
        dir: path.resolve(__dirname, "./storage")
    })
});

app.set("socketService", new SocketService(http));