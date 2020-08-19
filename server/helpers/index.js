import storage from "node-persist";

export const getLocalImagesURI = async (game_id) => {
    const backgrounds = await storage.getItem("gameBackgrounds") || {};

    let current_game_background_url = backgrounds[game_id] ? `/games/backgrounds/${backgrounds[game_id]}` : null;
    let default_background_url = backgrounds.default ? `/games/backgrounds/${backgrounds.default}` : null;

    return {
        current_game_background_url,
        default_background_url
    }
}

export const saveAndCreateReponse = async ({
    res,
    status = 200,
    error = null,
    storageKey,
    data
}) => {
    await storage.setItem(storageKey, {...data});
    return res.status(status).json({
        error: error ? true : false,
        message: error,
        status,
        [storageKey]: data
    })
}