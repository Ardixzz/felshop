export default async function handler(req, res) {
    try {

        if (req.method !== "POST") {
            return res.status(405).json({ message: "Method Not Allowed" });
        }

        const body = req.body || {};

        if (body.status !== "PAID") {
            return res.status(200).json({ message: "Not paid" });
        }

        const orderId = body.order_id || "ORDER" + Date.now();

        const apiKey = process.env.PTERO_API_KEY;
        const pteroUrl = process.env.PTERO_URL;

        if (!apiKey || !pteroUrl) {
            return res.status(500).json({ message: "ENV missing" });
        }

        const createServer = await fetch(
            `${pteroUrl}/api/application/servers`,
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                    "Accept": "application/vnd.pterodactyl.v1+json"
                },
                body: JSON.stringify({
                    name: `Server-${orderId}`,
                    user: 1,
                    egg: Number(process.env.PTERO_EGG_ID || 1),
                    docker_image: "ghcr.io/pterodactyl/yolks:nodejs_18",
                    startup: "npm start",
                    limits: {
                        memory: 1024,
                        swap: 0,
                        disk: 1024,
                        io: 500,
                        cpu: 100
                    },
                    feature_limits: {
                        databases: 0,
                        backups: 0
                    }
                })
            }
        );

        const data = await createServer.json();

        return res.status(200).json({
            message: "Server created",
            data
        });

    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
}