import { redirect } from "@remix-run/node";
import { sessionStorage } from "~/utils/session.server"; // Import your session storage

export const action = async ({ request }) => {
  const session = await sessionStorage.getSession(request.headers.get("_session"));

  if(!session){
    return redirect("/sign-in")
  }

  return redirect("/sign-in", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
};

