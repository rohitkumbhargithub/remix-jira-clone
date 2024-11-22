import { LoaderFunction } from "@remix-run/node";
import { authenticatorGoogle } from "~/utils/google-strategy.server";

export let loader: LoaderFunction = async ({ request }) => {
  return authenticatorGoogle.authenticate("google", request, {
    successRedirect: "/", 
    failureRedirect: "/sign-in", 
  });
};

