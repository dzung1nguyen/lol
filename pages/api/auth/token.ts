import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.send({
      error: "Something went wrong.",
    });
  }

  const token = await getToken({ req, secret });

  if (!token || !token.accessToken) {
    return res.send({
      error: "User wallet not authenticated",
    });
  }

  return res.send({
    token: token.accessToken,
  });
}
