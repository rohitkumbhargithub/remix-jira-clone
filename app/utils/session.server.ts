import { createCookie, createCookieSessionStorage } from "@remix-run/node";

const sessionStorage = createCookieSessionStorage({
    cookie: {
        name: "_session",
        sameSite: "lax",
        path: "/",
        httpOnly: true,
        secrets: [process.env.SESSION_SCERAT || 'mysecreate'],
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24,
    }
})

export const flashCookie = createCookie("flash", {
    maxAge: 5,  // Message stays for 5 seconds
  });
  
  export const createFlashCookie = async (message: string) => {
    return await flashCookie.serialize(message);
  };
  
  export const getFlashCookie = async (request: Request) => {
    const cookieHeader = request.headers.get("Cookie");
    return await flashCookie.parse(cookieHeader);
  };

  export async function getUserSession(request: Request) {
    const session = await sessionStorage.getSession(
      request.headers.get("Cookie")
    );
    const user = session.get("user"); // This depends on how the user is being stored in the session
    return user;
  }

  

export { sessionStorage };