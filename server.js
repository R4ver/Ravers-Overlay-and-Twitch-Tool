"use strict";

var express = require("express");
var app = express();
var Server = require("http").Server;
var server = new Server(app);

server.listen(8080);

// __dirname is used here along with package.json.pkg.assets
// see https://github.com/zeit/pkg#config and
// https://github.com/zeit/pkg#snapshot-filesystem

app.get("/", function (req, res) {
    res.json({
        "message": "Hello!"
    })
});
