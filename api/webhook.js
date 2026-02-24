export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const body = req.body;

    // Cek status pembayaran
    if (body.status !== "PAID") {
        return res.status(200).json({ message: "Not paid yet" });
    }

    const orderId = body.order_id;
    const email = body.customer_email || "user@email.com";

    try {
        // Buat server ke Pterodactyl
        const response = await fetch(`${process.env.PTERO_URL}/api/application/servers`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.PTERO_API_KEY}`,
                "Content-Type": "application/json",
                "Accept": "Application/vnd.pterodactyl.v1+json"
            },
            body: JSON.stringify({
                name: `Server-${orderId}`,
                user: 1, // ID user di panel
                egg: Number(process.env.PTERO_EGG_ID),
                docker_image: "ghcr.io/pterodactyl/yolks:nodejs_18",
                startup: "npm start",
                environment: {},
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
                },
                allocation: {
                    default: Number(process.env.PTERO_ALLOCATION_ID)
                }
            })
        });

        const data = await response.json();

        return res.status(200).json({
            message: "Server created",
            server: data
        });

    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}