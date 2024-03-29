import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import * as React from "react";

import { getUserId, createUserSession } from "~/session.server";

import { createUser, getUserByName } from "~/models/user.server";
import { safeRedirect, validateUsername } from "~/utils";
import TextInput from "~/components/forms/TextInput";
import SubmitButton from "~/components/forms/SubmitButton";
import { Layout } from "~/components/layout";
import Link from "~/components/Link";

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const name = formData.get("name");
  const password = formData.get("password");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/");

  if (!validateUsername(name)) {
    return json(
      { errors: { name: "Name is invalid", password: null } },
      { status: 400 }
    );
  }

  if (typeof password !== "string" || password.length === 0) {
    return json(
      { errors: { name: null, password: "Password is required" } },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return json(
      { errors: { name: null, password: "Password is too short" } },
      { status: 400 }
    );
  }

  const existingUser = await getUserByName(name);
  if (existingUser) {
    return json(
      {
        errors: {
          name: "A user already exists with this email",
          password: null,
        },
      },
      { status: 400 }
    );
  }

  const user = await createUser(name, password);

  return createUserSession({
    request,
    userId: user.id,
    remember: false,
    redirectTo,
  });
}

export const meta: MetaFunction = () => {
  return {
    title: "Sign Up",
  };
};

export default function Join() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;
  const actionData = useActionData<typeof action>();
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const { state } = useNavigation();
  React.useEffect(() => {
    if (actionData?.errors?.name) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Layout subheading={{ title: "Sign up" }} userNavigation={false}>
      <Layout.Content>
        <div className="flex w-full flex-col items-center justify-center">
          <Form
            method="post"
            className="flex flex-col justify-center space-y-6"
          >
            <TextInput
              name="name"
              placeholder="Username"
              error={actionData?.errors?.name}
              required
              autoFocus
            />

            <TextInput
              name="password"
              type={"password"}
              placeholder={"password"}
              error={actionData?.errors?.password}
              required
            />

            <input type="hidden" name="redirectTo" value={redirectTo} />
            <SubmitButton state={state}>Create account</SubmitButton>

            <div className="flex items-center justify-center">
              <div className="text-center text-sm text-gray-500">
                <span>Already have an account?</span>
                <Link
                  className="text-gradient animate-gradient"
                  to={{
                    pathname: "/login",
                    search: searchParams.toString(),
                  }}
                >
                  Log in
                </Link>
              </div>
            </div>
          </Form>
        </div>
      </Layout.Content>
    </Layout>
  );
}
