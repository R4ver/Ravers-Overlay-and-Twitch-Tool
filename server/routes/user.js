const Router = require("express").Router();

module.exports = (req, res) =>
    res.status(200).json({
        error: false,
        status: 200,
        user: req.user,
    });