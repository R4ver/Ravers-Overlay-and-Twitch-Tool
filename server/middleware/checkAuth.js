module.exports = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            error: true,
            status: 401,
            message: "No User",
        });
    } else {
        next();
    }
}