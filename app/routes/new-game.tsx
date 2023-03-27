import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import SubmitButton from "~/components/forms/SubmitButton";
import TextInput from "~/components/forms/TextInput";
import { Layout } from "~/components/layout";
import { createGame } from "~/models/game.server";
import { getUser } from "~/session.server";

type Props = {};

export const loader = async ({ request }: ActionArgs) => {
  const user = await getUser(request);
  console.log(process.env.SUPER_USER);
  if (!user || user.email !== process.env.SUPER_USER) {
    console.log("thrown");
    throw new Response("Not found", { status: 404 });
  }
  return json({
    user,
  });
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const name = formData.get("name");
  const errors = {
    name:
      typeof name === "string" && name.length > 0
        ? null
        : "Please enter game name",
  };
  const hasErrors = Object.values(errors).some((error) => error);
  if (hasErrors) {
    return json(errors);
  }
  invariant(name, "Name must be a string");

  await createGame(name.toString());

  return redirect("/");
};

export default function NewGame({}: Props) {
  useLoaderData<typeof loader>();
  const { state } = useNavigation();
  return (
    <Layout>
      <Layout.Body>
        <Layout.Content>
          <Form method="post" className="flex flex-col items-center gap-6">
            <TextInput name="name" placeholder="Game name" />
            <SubmitButton state={state}>Add gametype</SubmitButton>
          </Form>
        </Layout.Content>
      </Layout.Body>
    </Layout>
  );
}

export function CatchBoundary() {
  return (
    <Layout>
      <Layout.Body>
        <Layout.Content>
          <div className="flex h-full w-full flex-col items-center justify-center">
            <h1 className="animate-bounce">Not found</h1>
            <div>
              <span className="animate-nudgeRight">🔎</span>
              <span className="animate-nudgeLeft">❌</span>
            </div>
          </div>
        </Layout.Content>
      </Layout.Body>
    </Layout>
  );
}
