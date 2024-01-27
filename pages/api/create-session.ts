import { getIronSession } from "iron-session";
import { sessionOptions } from "config/session.config";
import { NextApiRequest, NextApiResponse } from "next";
import { UserSession } from "types/auth.types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getIronSession<UserSession>(req, res, sessionOptions);
  const { username } = req.body;

  if (username) {
    session.user = { username };
    await session.save();
    res.status(200).json({ message: "Session created successfully" });
  } else {
    res
      .status(400)
      .json({ error: "Username is required for session creation" });
  }
}
