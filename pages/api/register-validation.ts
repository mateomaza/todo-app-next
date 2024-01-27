import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { username, password, email } = req.body;

    if (!email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    if (!username || !/^[a-zA-Z0-9]{3,20}$/.test(username)) {
      return res.status(400).json({
        error:
          "Invalid username. Must be 3-20 characters long and alphanumeric.",
      });
    }

    if (!password || password.length < 12) {
      return res
        .status(400)
        .json({ error: "Password must be at least 12 characters long" });
    }

    if (
      !/[a-zA-Z]/.test(password) ||
      !/[0-9]/.test(password)
    ) {
      return res.status(400).json({
        error:
          "Password must include alphabetic and numeric characters.",
      });
    }

    if (password.toLowerCase().includes(username.toLowerCase())) {
      return res
        .status(400)
        .json({ error: "Password cannot contain your username" });
    }

    res.status(200).json({ message: "Validation successful" });

  } else {
    res.status(405).end();
  }
}
