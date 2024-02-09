import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { username, password } = req.body;

    if (typeof username !== 'string' || typeof password !== 'string') {
      return res.status(400).json({
        error: "Both fields must be a string."
      });
    }

    if (!username) {
      return res.status(400).json({
        error: "Username is required."
      });
    }

    if (!password) {
      return res.status(400).json({
        error: "Password is required."
      });
    }

    if (!/^[a-zA-Z0-9]{3,20}$/.test(username)) {
      return res.status(400).json({
        error: "Invalid username format."
      });
    }

    res.status(200).json({ message: "Validation successful" });

  } else {
    res.status(405).end();
  }
}
