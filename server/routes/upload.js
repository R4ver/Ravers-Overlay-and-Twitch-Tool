const multer = require("multer");
const path = require("path");
const storage = require("node-persist");
const glob = require("glob");
const fs = require("fs");

const maxSize = 3 * 1024 * 1024;
const allowedFiles = [
    "image/png",
]

var multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        glob(`/${file.originalname}*`, {
            root: path.resolve(__dirname, "../uploads/games/backgrounds")
        }, function (er, files) {
            for (const file of files) {
                fs.unlinkSync(file);
            }
        });

        cb(null, path.resolve(__dirname, "../uploads/games/backgrounds")); //Destination folder
    },
    filename: function (req, file, cb) {        
        var fileObj = {
            "image/png": ".png",
        };
        cb(null, `${file.originalname}.${Date.now()}${fileObj[file.mimetype]}`) //File name after saving
    }
})
const handleFile = multer({
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

const Upload = async (req, res) => {
    console.log(req.file);

    let backgrounds = await storage.getItem("gameBackgrounds") || {};
    backgrounds = {
        ...backgrounds,
        [req.file.originalname]: req.file.filename
    }
    
    let channel = await storage.getItem("channel") || {};
    channel.current_game_background_url = backgrounds[channel.game_id] ? `/games/backgrounds/${backgrounds[channel.game_id]}` : null;
    channel.default_background_url = backgrounds.default ? `/games/backgrounds/${backgrounds.default}` : null;

    await storage.setItem("channel", channel);
    
    req.app.get("socketService").emiter("channel:update", {
        current_game_background_url: channel.current_game_background_url,
        default_background_url: channel.default_background_url,
    });
    
    await storage.setItem("gameBackgrounds", backgrounds);
    return res.status(200).json({
        error: false,
        status: 200,
        message: "Image uploaded!",
        current_game_background_url: channel.current_game_background_url,
        default_background_url: channel.default_background_url
    });
};

const PATH = "/api/game/uploadBackground";
module.exports.register = router => {
    router.post(PATH, handleFile.single("gameBackground"), Upload);
};
