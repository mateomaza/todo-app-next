import { IronSessionData } from "iron-session";
import { NextApiRequest } from "next";

declare module "next" {
  interface NextApiRequest {
    session: IronSessionData;
  }
}