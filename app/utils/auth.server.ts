import { Authenticator, AuthorizationError } from "remix-auth";
import { sessionStorage } from "./session.server";
import { FormStrategy } from "remix-auth-form";
import { prisma } from "./prisma.server";
import bcrypt from 'bcryptjs';



const sessionSecret = process.env.SESSION_SCERAT;
if(!sessionSecret){
    throw new Error("SESSION_SCERAT must be set")
}

const authenticator = new Authenticator<any>(sessionStorage);

const formStrategy = new FormStrategy(async ({ form }) => {
  const email = form.get("email") as string;
  const password = form.get("password") as string;

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new AuthorizationError("Invalid email");
  }

  const passwordsMatch = await bcrypt.compare(password, user.password as string);

  if (!passwordsMatch) {
    throw new AuthorizationError("Invalid password");
  }

  // Save user data in the session
  const sessionUser = {
    id: user.id,
    email: user.email,
    name: user.name, // assuming user has a name field
  };

  return sessionUser;
});


authenticator.use(formStrategy, "form");

export { authenticator };