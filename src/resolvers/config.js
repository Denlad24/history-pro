export async function getConfig(req) {
    return {
        config: req.payload.config || {}
    };
}