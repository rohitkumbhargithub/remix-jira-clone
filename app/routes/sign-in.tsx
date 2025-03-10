import { ActionFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import bcrypt from 'bcryptjs';
import { Form, json, Link, useActionData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import Navbar from "~/componets/navbar";
import { DottedSperator } from "~/componets/ui/dotted-speartar";
import { authenticator } from "~/utils/auth.server";
import { getAllUsers } from "~/utils/user.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Jira Clone- Sign-in" },
    { name: "description", content: "Welcome to Jira!" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });

  return user;
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.clone().formData();
  const action = form.get("_action");
  const email = form.get("email");
  const password = form.get("password");

  if (password?.length < 8) {
    return json({ error: "Password must be 8 characters" }, { status: 400 });
  }
  
  const users = await getAllUsers();
  
  // Find the user by email directly instead of checking existence first
  const user = users.find((u) => u.email === email);
  
  if (!user) {
    return json({ error: "Invalid Username or Password!" }, { status: 400 });
  }
  
  // Check if password exists and compare only if present
  if (user.password || user.password == "") {
    const isMatch = await bcrypt.compare(password, user.password);
  
    if (!isMatch) {
      return json({ error: "Invalid Username or Password!" }, { status: 400 });
    }
  }

  return authenticator.authenticate("form", request, {
    successRedirect: "/",
    failureRedirect: "/sign-in",
  });
};

const SignIn = () => {
  const actionData = useActionData();
  const [showPassword, setShowPassword] = useState(false);

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
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Welcome Back!
          </h2>
          <DottedSperator className="mt-2" />
        </div>

        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
          <Form method="POST" className="space-y-6">
            <div>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter Email"
                  required
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                />
              </div>
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
              <div className="flex items-center justify-end m-2">
                <div className="text-sm">
                  <a href="/forgot" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </a>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                name="_action"
                className="flex w-full justify-center rounded-md bg-black px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-black-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
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
          <p className="mt-10 text-center text-sm text-gray-500">
            Don't have an account?
            <Link
              to={"/sign-up"}
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignIn;
