import { Outlet, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/server-runtime";
import React from "react";
import { Layout } from "~/components/layout";
import type { NavigationLink } from "~/components/layout/Navigation";
import { getRunsForGame } from "~/models/run.server";

export const loader = async () => {
  return json({
    records: await getRunsForGame("Heroes of Newerth"),
  });
};

export default function HoNIndex() {
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
  return (
    <Layout header="Runs">
      <Layout.Body>
        <Layout.Navigation links={links} />
        <Layout.Content>
          <Outlet />
        </Layout.Content>
      </Layout.Body>
    </Layout>
  );
}
