const path = require("path");

const development = process.env.NODE_ENV === "development";
const storagePath = development ? path.resolve(__dirname, "../storage") : "./storage";
const uploadPath = development ? path.resolve(__dirname, "../uploads") : "./uploads";
class RootPath {
    constructor() {
        this.upload = path.resolve(process.cwd(), uploadPath);
        this.storage = path.resolve(process.cwd(), storagePath);
    }
}

module.exports = new RootPath();
