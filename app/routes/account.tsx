import { Outlet, useLoaderData } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { getUser } from "~/session.server";
import { Layout } from "~/components/layout";

export const loader = async ({ request }: ActionArgs) => {
  const user = await getUser(request);
  return json({ user });
};

export default function Index() {
  const { user } = useLoaderData<typeof loader>();

  if (!user) {
    return null;
  }

  return (
    <Layout header={"Account"}>
      <Layout.Body>
        <Layout.Navigation
          links={[
            { title: "Back", href: "..", relative: "path" },
            { title: "Edit", href: "edit", relative: "route" },
          ]}
        />
        <Layout.Content>
          <Outlet />
        </Layout.Content>
      </Layout.Body>
    </Layout>
  );
}
