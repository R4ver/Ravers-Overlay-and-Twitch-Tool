const api = require("../api");
const { getLocalImagesURI, saveAndCreateReponse } = require("../helpers");

const getChannel = async (req, res, next) => {
    try {
        const channel = await api.get("/channels", {
            params: {
                broadcaster_id: parseInt(req.user.id),
            },
        });

        if ( channel && channel.status === 200 ) {
            let channelData = channel.data.data[0];
            const backgrounds = await getLocalImagesURI(channelData.game_id);

            req.app.get("socketService").emiter("channel:update", {
                ...channel.data.data[0],
                ...backgrounds,
            }); 

            return await saveAndCreateReponse({
                res,
                storageKey: "channel",
                data: {
                    ...channel.data.data[0],
                    ...backgrounds,
                },
            });
        }
    } catch (error) {
        next(new api.ApiError(401, error, "Failed to get channel"));
    }
}

const patchChannel = async ( req, res, next ) => {
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

            
            if (channel.status === 200) {
                const backgrounds = await getLocalImagesURI(channel.data.data[0].game_id);

                req.app.get("socketService").emiter("channel:update", {
                    ...channel.data.data[0],
                    ...backgrounds
                });

                return await saveAndCreateReponse({
                    res,
                    storageKey: "channel",
                    data: {
                        ...channel.data.data[0],
                        ...backgrounds,
                    },
                });
            }
        }

    } catch (error) {
        next(new api.ApiError(500, error, "Failed to update channel"));
    }
}

const PATH = "/api/channel";
module.exports.register = router => {
    router.get(PATH, getChannel);
    router.patch(PATH, patchChannel);

    return router;
};