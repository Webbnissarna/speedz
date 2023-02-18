import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { json } from "@remix-run/server-runtime";
import type { ActionArgs } from "@remix-run/server-runtime";
import React from "react";
import { getUser } from "~/session.server";
import TextInput from "~/components/form/TextInput";
import { updateUser } from "~/models/user.server";
import SubmitButton from "~/components/form/SubmitButton";

export const loader = async ({ request }: ActionArgs) => {
  const user = await getUser(request);
  return json({ user });
};

export const action = async ({ request }: ActionArgs) => {
  const user = await getUser(request);
  const formData = await request.formData();

  const name = formData.get("name");
  const email = formData.get("email");

  if (!user) {
    return;
  }

  const errors = await updateUser({
    id: user.id,
    email: email && email.toString().length > 0 ? email.toString() : user.email,
    name: name && name.toString().length > 0 ? name.toString() : user.name,
    createdAt: user.createdAt,
    updatedAt: new Date(),
  });

  return errors;
};

export default function Edit() {
  const errors = useActionData<typeof action>();
  const { user } = useLoaderData<typeof loader>();
  const { state } = useNavigation();
  if (!user) {
    return null;
  }

  return (
    <Form method="post">
      <TextInput
        error={errors?.name}
        name="name"
        placeholder={user.name ? user.name : "Set a name"}
      />
      <TextInput error={errors?.email} name="email" placeholder={user.email} />
      <SubmitButton state={state}>Update</SubmitButton>
    </Form>
  );
}
