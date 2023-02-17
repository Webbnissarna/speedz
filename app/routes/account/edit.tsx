import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/server-runtime";
import type { ActionArgs } from "@remix-run/server-runtime";
import React from "react";
import { getUser } from "~/session.server";

export const loader = async ({ request }: ActionArgs) => {
  const user = await getUser(request);
  return json({ user });
};

export default function Edit() {
  const { user } = useLoaderData<typeof loader>();
  if (!user) {
    return null;
  }
  return <div>{user.createdAt}</div>;
}
