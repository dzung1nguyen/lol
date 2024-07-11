import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";
import { SigninMessage } from "../../../utils/SigninMessage";
import LaravelApiRequest from "@/utils/LaravelApiRequest";

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const providers = [
    CredentialsProvider({
      id: "Solana",
      name: "Solana",
      credentials: {
        message: {
          label: "Message",
          type: "text",
        },
        signature: {
          label: "Signature",
          type: "text",
        },
      },
      async authorize(credentials, req) {
        try {
          const signinMessage = new SigninMessage(
            JSON.parse(credentials?.message || "{}")
          );

          const nextAuthUrl = new URL(process.env.NEXTAUTH_URL!);
          if (signinMessage.domain !== nextAuthUrl.host) {
            return null;
          }

          const csrfToken = await getCsrfToken({ req: { ...req, body: null } });

          if (signinMessage.nonce !== csrfToken) {
            return null;
          }

          const validationResult = await signinMessage.validate(
            credentials?.signature || ""
          );

          if (!validationResult) {
            throw new Error("Could not validate the signed message");
          }

          const response = await LaravelApiRequest.post("/api/auth/login", {
            _wallet_address: signinMessage.publicKey,
          });

          if (response.success && response?.data?.wallet) {
            return response?.data;
          } else {
            throw new Error(response?.message ?? "Authentication failed");
          }
        } catch (e) {
          return null;
        }
      },
    }),

    CredentialsProvider({
      id: "Google",
      name: "Google",
      credentials: {
        code: {
          label: "code",
          type: "text",
        },
        scope: {
          label: "scope",
          type: "text",
        },
        locale: {
          label: "locale",
          type: "text",
        },
      },
      async authorize(credentials, req) {
        try {
          if (!credentials?.code) {
            throw new Error("Could not validate the google");
          }
          const response = await LaravelApiRequest.locale(credentials.locale ?? 'en').post(
            "/api/auth/login/callback",
            {
              driver: "google",
              code: credentials.code,
              scope: credentials?.scope,
            }
          );

          if (response.success && response?.data?.wallet) {
            return response?.data;
          } else {
            throw new Error(response?.message ?? "Authentication failed");
          }
        } catch (e) {
          return null;
        }
      },
    }),
  ];

  const isDefaultSigninPage =
    req.method === "GET" && req.query.nextauth?.includes("signin");

  // Hides Sign-In with Solana from the default sign page
  if (isDefaultSigninPage) {
  }

  return await NextAuth(req, res, {
    providers,
    pages: {
      signIn: "/en/auth/login",
    },
    session: {
      strategy: "jwt",
      maxAge: 1 * 24 * 60 * 60, // 24 hours
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      async jwt({ token, account, user }) {
        if (user) {
          // @ts-ignore
          token.user = user.wallet;
          // @ts-ignore
          token.accessToken = user.access_token;
        }

        return token;
      },
      async session({ session, token }) {
        // // @ts-ignore
        // session.accessToken = token.access_token;

        // @ts-ignore
        session.user = token.user;

        return session;
      },
    },
  });
}
