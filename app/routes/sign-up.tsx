import { toast, Toaster } from "sonner";
import { ActionFunction, MetaFunction } from "@remix-run/node";
import { Form, json, Link, useActionData } from "@remix-run/react";
import { FaGithub } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Navbar from "~/componets/navbar";
import { createUser } from "~/utils/user.server";
import { authenticator } from "~/utils/auth.server";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { DottedSperator } from "~/componets/ui/dotted-speartar";

export const meta: MetaFunction = () => {
  return [
    { title: "Jira Clone- Sign-up" },
    { name: "description", content: "Welcome to Jira!" },
  ];
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.clone().formData();
  const action = form.get("_action");
  const email = form.get("email");
  const password = form.get("password");
  const cpassword = form.get("cpassword");
  const name = form.get("name");
  if (
    typeof action !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof name !== "string"
  ) {
    return json({ error: "Invaild Form data", form: action }, { status: 400 });
  }

  if (password.length < 8) {
    return json(
      { error: "Password must be at least 8 characters" },
      { status: 400 }
    );
  }

  if (password !== cpassword) {
    return json(
      { error: "Password not matched!" },
      { status: 400 }
    );
  }

  const user = await createUser({ email, password, name });

  if (user == null) {
    return json({ error: "Email is Already used!" }, { status: 400 });
  }

  return await authenticator.authenticate("form", request, {
    successRedirect: "/",
    failureRedirect: "/sign-up",
  });
};

const SignUp = () => {
  const actionData = useActionData();
  const [showPassword, setShowPassword] = useState(false);
  const [cshowPassword, csetShowPassword] = useState(false);


  useEffect(() => {
    if (actionData?.error) {
      toast.error(actionData.error);
    } else if (actionData?.success) {
      toast.success(actionData.success); // Use toast.success for success messages
    }
  }, [actionData]);

  return (
    <>
      <Navbar />
      <Toaster />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign Up
          </h2>
          <DottedSperator className="mt-2" />
        </div>

        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
          <Form action="#" method="POST" className="space-y-6">
            <div>
              <div className="">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="email"
                  placeholder="Enter Name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                />
              </div>
            </div>

            <div className="">
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Enter Email"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
              />
            </div>

            <div>
              <div className="mt-2 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="Enter Password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-sm text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <FaEye className="text-lg" />
                  ) : (
                    <FaEyeSlash className="text-lg" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <div className="mt-2 relative">
                <input
                  id="cpassword"
                  name="cpassword"
                  type={cshowPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="Confirm Password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                />
                <button
                  type="button"
                  onClick={() => csetShowPassword(!cshowPassword)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-sm text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={cshowPassword ? "Hide password" : "Show password"}
                >
                  {cshowPassword ? (
                    <FaEye className="text-lg" />
                  ) : (
                    <FaEyeSlash className="text-lg" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                name="_action"
                className="flex w-full justify-center rounded-md bg-black px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-black-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Register
              </button>
            </div>
          </Form>
          <DottedSperator className="mt-2" />
          <a href="/auth/google">
            <Button
              type="submit"
              className="flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 mt-3"
              variant="outline"
            >
              <FcGoogle className="mr-2 size-5" />
              Login with Google
            </Button>
          </a>

          <a href="/auth/github">
            <Button
              type="submit"
              className="flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 mt-3"
              variant="outline"
            >
              <FaGithub className="mr-2 size-5" />
              Login with GitHub
            </Button>
          </a>

          <p className="mt-10 text-center text-sm text-gray-500 mb-3">
            Already have Account? 
            <Link
              to={"/sign-in"}
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 ml-2"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignUp;
