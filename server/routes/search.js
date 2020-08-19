const api = require("../api");

module.exports = async (req, res, next) => {
    const { query, first = 10 } = req.query;
    try {
        const searchRes = await api.get("/search/categories", {
            params: {
                query,
                first
            },
        });

        if ( !searchRes.data.data ) throw new Error("No results.");

        return res.status(200).json({
            error: false,
            status: 200,
            searchData: searchRes.data.data,
        });
    } catch (error) {
        next(new api.ApiError(404, error, "Failed to search"));
    }
};