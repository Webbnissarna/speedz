import { useLoaderData } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/node";
import React from "react";
import { getUser } from "~/session.server";

export const loader = async ({ request }: ActionArgs) => {
  const user = await getUser(request);
  return json({ user });
};

export default function Index() {
  const { user } = useLoaderData<typeof loader>();
  return (
    <div className="flex flex-col gap-4">
      <span>{user && user.name}</span>
      <span>{user && user.email}</span>
      <span>{user && user.createdAt}</span>
      <span>{user && user.updatedAt}</span>
    </div>
  );
}
