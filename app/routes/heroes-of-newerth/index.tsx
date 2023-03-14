import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/server-runtime";
import type { NavigationLink } from "~/components/layout/Navigation";
import Link from "~/components/Link";
import { getRunsForGame } from "~/models/run.server";
import { useOptionalUser } from "~/utils";

export const loader = async () => {
  return json({
    records: await getRunsForGame("Heroes of Newerth"),
  });
};

export default function Index() {
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
  return (
    <div>
      {user ? (
        <div className="grid grid-cols-2 gap-2">
          <Link to={"new-run"}>Add run</Link>
          <Link to={"new-category"}>Create category</Link>
        </div>
      ) : null}
      <h2 className="text-center">Runs</h2>
      <ul>
        {links.map((link) => {
          return (
            <li key={link.href}>
              <Link to={link.href} relative={link.relative}>
                {link.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
