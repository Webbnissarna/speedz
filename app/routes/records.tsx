import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { getRecords } from "~/models/records.server";
import { Layout } from "~/components/layout";
import { useOptionalUser } from "~/utils";
import type { NavigationLink } from "~/components/layout/Navigation";
export const loader = async () => {
  return json({
    records: await getRecords(),
  });
};

export default function Records() {
  const user = useOptionalUser();
  const { records } = useLoaderData<typeof loader>();
  const links: Array<NavigationLink> = [
    { href: "..", title: "Back", relative: "path" },
    ...records.map((record) => {
      const link: NavigationLink = {
        href: record.slug,
        title: record.title,
        relative: "route",
      };
      return link;
    }),
  ];

  //   if (user) {
  //     links.splice(1, 0, {
  //       href: "/record-admin",
  //       title: "Admin",
  //       relative: "route",
  //     });
  //   }
  return (
    <Layout header="Records">
      <Layout.Body>
        <Layout.Navigation links={links} />
        <Layout.Content>
          <Outlet />
        </Layout.Content>
      </Layout.Body>
    </Layout>
  );
}
