import { json, Link, redirect } from '@remix-run/react';
import { Form, useActionData } from '@remix-run/react';
import { useEffect } from 'react';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'sonner';
import { Button } from '~/components/ui/button';
import Navbar from '~/componets/navbar';
import { DottedSperator } from '~/componets/ui/dotted-speartar';
import { sendMail } from '~/utils/mailer';
import { getAllUserEmail } from '~/utils/user.server';

// Action function to handle form submission and send the email
export let action = async ({ request }: { request: Request }) => {
  const formData = new URLSearchParams(await request.text());
  const email = formData.get('email');

  const data = await getAllUserEmail(email);
  const emails = data.map(user => user.email);

  if (!emails.includes(email)) {
    return json({ error: "Email not valid!" }, { status: 400 });
  }

  if(email){
    await sendMail(email);
    return json({ success: "Reset Link send to your register email!" }, { status: 200 });
  }

  return redirect(`/forgot`);
};

// Component to render the form and show success or error messages
export default function Forgot() {
  const actionData = useActionData();

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
            Forgot Password
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
              <button
                type="submit"
                name="_action"
                className="flex w-full justify-center rounded-md bg-black px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-black-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Send the link
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
            Already have an account?
            <Link
              to={"/sign-in"}
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}