export default async function handler(req, res) {
    try {

        // Only accept POST request
        if (req.method !== "POST") {
            return res.status(405).json({
                message: "Method Not Allowed"
            });
        }

        const body = req.body || {};

        // Debug safety check
        console.log("Webhook received:", body);

        // Payment validation
        if (body.status !== "PAID") {
            return res.status(200).json({
                message: "Not paid"
            });
        }

        const orderId = body.order_id || "ORDER" + Date.now();

        /**
         * Kalau nanti kamu mau connect ke
         * :contentReference[oaicite:2]{index=2}
         * tinggal tambahkan logic create server di sini.
         */

        return res.status(200).json({
            message: "Webhook success",
            order_id: orderId
        });

    } catch (err) {

        console.error("Webhook error:", err);

        return res.status(500).json({
            message: "Server error",
            error: err.message
        });
    }
}