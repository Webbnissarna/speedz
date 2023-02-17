import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { Layout } from "~/components/layout";
import { getRecords } from "~/models/records.server";

import type { NavigationLink } from "~/components/layout/Navigation";

export const loader = async () => {
  return json({ records: await getRecords() });
};

export default function RecordAdmin() {
  const { records } = useLoaderData<typeof loader>();
  const links: Array<NavigationLink> = [
    { title: "Back", href: "/records", relative: "route" },
    ...records.map((record) => {
      const link: NavigationLink = {
        href: record.slug,
        title: record.title,
        relative: "route",
      };
      return link;
    }),
  ];
  return (
    <Layout header={"Records"}>
      <Layout.Body>
        <Layout.Navigation links={links} />
        <Layout.Content>
          <Outlet />
        </Layout.Content>
      </Layout.Body>
    </Layout>
  );
}
