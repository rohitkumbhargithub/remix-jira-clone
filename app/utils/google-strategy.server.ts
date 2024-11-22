import { Authenticator } from "remix-auth";
import { GoogleStrategy } from "remix-auth-google";
import { sessionStorage } from "~/utils/session.server"; // Assuming you have session setup
import { prisma } from "./prisma.server";

export const authenticatorGoogle = new Authenticator(sessionStorage);

authenticatorGoogle.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${process.env.BASE_URL}/auth/google/callback`, 
    },
    async ({ profile }) => {
      const email = profile.emails?.[0]?.value;
      const name = profile.displayName;

      // Find an existing user by Google ID or email
      let user = await prisma.user.findFirst({
        where: {
         email
        },
      });

      // If user doesn't exist, create a new one
      if (!user) {
        user = await prisma.user.create({
          data: {
            email: email!,
            name,
            password: "",
          },
        });
      }

      return {
        id: user.id, 
        email: user.email,
        name: user.name,
      };
    }
  )
);
