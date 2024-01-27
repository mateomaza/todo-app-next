import { parseCookies } from 'nookies';
import { sessionOptions } from "config/session.config";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cookies = parseCookies({ req });
  const sessionCookie = cookies[sessionOptions.cookieName];

  if (sessionCookie) {
    try {
      res.status(200).json({ isAuthenticated: true });
    } catch (error) {
      res.status(200).json({ isAuthenticated: false });
    }
  } else {
    res.status(200).json({ isAuthenticated: false });
  }
}
