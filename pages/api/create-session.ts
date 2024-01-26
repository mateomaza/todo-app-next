import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { username } = req.body;

  if (username) {
    req.session.user = { username };
    await req.session.save();
    res.status(200).json({ message: "Session created successfully" });
  } else {
    res
      .status(400)
      .json({ error: "Username is required for session creation" });
  }
}
