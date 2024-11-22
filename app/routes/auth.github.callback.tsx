import { LoaderFunction } from "@remix-run/node";
import { authenticatorGithub } from "~/utils/github-strategy.server";

export let loader: LoaderFunction = async ({ request }) => {
  return authenticatorGithub.authenticate("github", request, {
    successRedirect: "/", 
    failureRedirect: "/sign-in", 
  });
};

