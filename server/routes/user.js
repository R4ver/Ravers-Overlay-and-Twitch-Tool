const Router = require("express").Router();

Router.get("/currentUser", async (req, res) => {
    if (req.user) {
        return res.status(200).json({
            error: false,
            status: 200,
            user: req.user,
        });
    } else {
        res.redirect("/login");

        // return res.status(401).json({
        //     error: true,
        //     status: 401,
        //     message: "Not Authorized"
        // });
    }
});

module.exports = Router;