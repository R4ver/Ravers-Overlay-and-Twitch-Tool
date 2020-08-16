const Router = require("express").Router();

const api = require("../api");

Router.get("/", async (req, res) => {
    const { query, first = 10 } = req.query;
    console.log(query);

    if (!req.user) {
        return res.status(401).json({
            error: true,
            status: 401,
            message: "No User",
        });
    }

    try {
        const searchRes = await api.get("/search/categories", {
            params: {
                query,
                first
            },
        });

        
        if (searchRes.status === 200) {
            console.log("Search result: ", searchRes);
            return res.status(200).json({
                error: false,
                status: 200,
                searchData: searchRes.data.data,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: true,
            message: "Failed to search",
            errorMessage: error,
        });
    }
});

module.exports = Router;