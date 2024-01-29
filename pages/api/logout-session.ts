import { getIronSession } from "iron-session";
import { sessionOptions } from "config/session.config";
import { NextApiRequest, NextApiResponse } from "next";
import { UserSession } from "types/auth.types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const session = await getIronSession<UserSession>(req, res, sessionOptions);
    if (!session.user) {
      session.destroy();
      res.setHeader(
        "Set-Cookie",
        "refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      );
      res.json({ message: "Logged out successfully" });
    } else {
      res.status(400).json({ error: "No user found in session" });
    }
  }
}
