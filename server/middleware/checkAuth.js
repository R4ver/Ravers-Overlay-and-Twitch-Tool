const api = require("../api");

module.exports = (req, res, next) => {
    if (!req.user) {
        next(new api.ApiError(401, error, "Unauthorized"));
    } else {
        next();
    }
}