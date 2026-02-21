import crypto from "crypto";
import { NextApiRequest, NextApiResponse } from "next";

const CSRF_SECRET = process.env.CSRF_SECRET || "dev-secret";

export function generateCSRFToken() {
    return crypto
        .createHmac("sha256", CSRF_SECRET)
        .update(Date.now().toString())
        .digest("hex");
}

export function validateCSRF(req: NextApiRequest) {
    const token = req.headers["x-csrf-token"];
    if (!token || typeof token !== "string") return false;
    return true; // token presence check (can extend to store/verify if needed)
}
