const Router = require("express").Router();
const multer = require("multer");
const path = require("path");
const storage = require("node-persist");

const handleError = (err, res) => {
    res.status(500).contentType("text/plain").end("Oops! Something went wrong!");
};

const maxSize = 3 * 1024 * 1024;
const allowedFiles = [
    "image/png",
]

var multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        

        cb(null, path.resolve(__dirname, "../uploads/games/backgrounds")); //Destination folder
    },
    filename: function (req, file, cb) {        
        var fileObj = {
            "image/png": ".png",
        };
        cb(null, `${file.originalname}.${Date.now()}${fileObj[file.mimetype]}`) //File name after saving
    }
})
const upload = multer({
    dest: path.resolve(__dirname, "../uploads/games/backgrounds"),
    fileFilter: function fileFilter(req, file, cb) {
        // The function should call `cb` with a boolean
        // to indicate if the file should be accepted
        
        // To reject this file pass `false`, like so:
        console.log(!allowedFiles.find((e) => e === file.mimetype));
        if (!allowedFiles.find((e) => e === file.mimetype)) {
            cb(null, false);
        }
        
        cb(null, true);
        // You can always pass an error if something goes wrong:
        // cb(new Error("I don't have a clue!"));
    },
    storage: multerStorage,
    limits: {
        fileSize: maxSize,
    },
    // you might also want to set some limits: https://github.com/expressjs/multer#limits
});

Router.post("/uploadBackground", upload.single("gameBackground"), async (req, res) => {
    console.log(req.file);
    
    let backgrounds = await storage.getItem("gameBackgrounds") || {};
    backgrounds = {
        ...backgrounds,
        [req.file.originalname]: req.file.filename
    }
    
    await storage.setItem("gameBackgrounds", backgrounds);
    
    return res.status(200).json({
        error: false,
        status: 200,
        message: "Image uploaded!",
        imagePath: `/games/backgrounds/${req.file.filename}`
    })
});

module.exports = Router;
