import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import * as React from "react";

import { createUserSession, getUserId } from "~/session.server";
import { verifyLogin } from "~/models/user.server";
import { safeRedirect, validateEmail } from "~/utils";
import { Layout } from "~/components/layout";
import TextInput from "~/components/forms/TextInput";
import SubmitButton from "~/components/forms/SubmitButton";
import Link from "~/components/Link";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/");
  const remember = formData.get("remember");

  if (!validateEmail(email)) {
    return json(
      { errors: { email: "Email is invalid", password: null } },
      { status: 400 }
    );
  }

  if (typeof password !== "string" || password.length === 0) {
    return json(
      { errors: { email: null, password: "Password is required" } },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return json(
      { errors: { email: null, password: "Password is too short" } },
      { status: 400 }
    );
  }

  const user = await verifyLogin(email, password);

  if (!user) {
    return json(
      { errors: { email: "Invalid email or password", password: null } },
      { status: 400 }
    );
  }

  return createUserSession({
    request,
    userId: user.id,
    remember: remember === "on" ? true : false,
    redirectTo,
  });
}

export const meta: MetaFunction = () => {
  return {
    title: "Login",
  };
};

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";
  const actionData = useActionData<typeof action>();
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const { state } = useNavigation();
  React.useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Layout subheading={{ title: "Login" }} userNavigation={false}>
      <div className="mx-auto w-full max-w-md px-8">
        <Form method="post" className="flex flex-col justify-center space-y-6">
          <TextInput
            name="email"
            placeholder="email@email.com"
            required
            autoFocus
            error={actionData?.errors?.email}
          />
          <TextInput
            name="password"
            placeholder="pass**rd"
            error={actionData?.errors?.password}
            type={"password"}
          />

          <input type="hidden" name="redirectTo" value={redirectTo} />
          <SubmitButton state={state}>Log in</SubmitButton>
          <div className="flex flex-col items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="border-amber-300 text-amber-600 focus:ring-amber-500"
              />
              <label htmlFor="remember" className="pl-2">
                Remember me
              </label>
            </div>
            <div className="text-center text-sm text-gray-500">
              <span className="mt-2 inline-block border-t border-amber-100 pb-2">
                Don't have an account?
              </span>
              <Link
                to={{
                  pathname: "/join",
                  search: searchParams.toString(),
                }}
              >
                Sign up
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </Layout>
  );
}
