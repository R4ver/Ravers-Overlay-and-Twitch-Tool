const Router = require("express").Router();
const storage = require("node-persist");

const api = require("../api");

Router.get("/", async (req, res) => {
    if ( !req.user ) {
        return res.status(401).json({
            error: true,
            status: 401,
            message: "No User"
        })
    }

    try {
        const channel = await api.get("/channels", {
            params: {
                broadcaster_id: parseInt(req.user.id),
            },
        });

        if ( channel.status === 200 ) {
            let channelData = channel.data.data[0];
            const backgrounds = await storage.getItem("gameBackgrounds") || [];
            let current_game_background_url = backgrounds[channelData.game_id] ? `/games/backgrounds/${backgrounds[channelData.game_id]}` : ""


            console.log(channel.data.data[0]);
            return res.status(200).json({
                error: false,
                status: 200,
                channel: {
                    ...channel.data.data[0],
                    current_game_background_url
                },
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: true,
            message: "Failed to get channel",
            errorMessage: error
        })
    }
})

Router.patch("/", async ( req, res ) => {
    if ( !req.user ) {
        return res.status(401).json({
            error: true,
            status: 401,
            message: "No User",
        });
    }

    try {
        const { title, game_id } = req.body;
        const channel = await api.patch("/channels", {
            title,
            game_id: parseInt(game_id)
        }, {
            params: {
                broadcaster_id: parseInt(req.user.id)
            }
        });

        if ( channel.status === 204 ) {
            const channel = await api.get("/channels", {
                params: {
                    broadcaster_id: parseInt(req.user.id),
                },
            });
            const backgrounds = await storage.getItem("gameBackgrounds");
            let current_game_background_url = `/games/backgrounds/${backgrounds[channel.data.data[0].game_id]}`

            if (channel.status === 200) {
                req.app.get("socketService").emiter("channel:update", channel.data.data[0]);
                // console.log(req.app.get("socketService"));
                return res.status(200).json({
                    error: false,
                    status: 200,
                    channel: {
                        ...channel.data.data[0],
                        current_game_background_url
                    }
                });
            }
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: true,
            message: "Failed to update channel",
            errorMessage: error,
        });
    }
})

module.exports = Router;