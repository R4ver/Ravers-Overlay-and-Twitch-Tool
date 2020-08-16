const axios = require("axios");
const storage = require("node-persist");

const API_URL = `https://api.twitch.tv/helix`;

axios.interceptors.request.use(
    async (config) => {
        const token = await storage.getItem("accessToken");
        config.headers["Authorization"] = `Bearer ${token}`;
        config.headers["Client-Id"] = process.env.TWITCH_CLIENT_ID;
        
        // config.headers['Content-Type'] = 'application/json';
        return config;
    },
    (error) => {
        Promise.reject(error);
    }
);

module.exports = {
    get: async (path, options) => {
        try {
            const res = await axios.get(`${API_URL}${path}`, {...options});

            return res;
        } catch (error) {
            console.log(`Failed to get: ${path}. `, error);
        }
    },

    post: async (path, body, options) => {
        try {
            const res = axios.post(`${API_URL}${path}`, body, { ...options });

            return res
        } catch (error) {
            console.log(`Failed to post: ${path}. `, error);
        }
    },

    patch: async (path, body, options) => {
        try {
            const res = axios.patch(`${API_URL}${path}`, body, { ...options });

            return res;
        } catch (error) {
            console.log(`Failed to post: ${path}. `, error);
        }
    },

    checkAuth: async (req) => {
        try {
            const res = await axios.get(`${API_URL}/users`);

            if (res && res.status === 200) {
                req.login(res.data.data[0], () => {});
                return {
                    error: false,
                    status: 200,
                };
            }
        } catch (error) {
            console.log(`Failed to get user. `, error);
            return {
                error: true,
                status: 401,
            };
        }
    },
};