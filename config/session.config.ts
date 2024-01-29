import { SessionOptions } from "iron-session";

export const sessionOptions: SessionOptions = {
  cookieName: "session",
  password: process.env.SESSION_PASSWORD as string,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};