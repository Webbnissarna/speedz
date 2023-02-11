import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";

import { getRecords } from "~/models/records.server";

export const loader = async () => {
  return json({ records: await getRecords() });
};

export default function RecordAdmin() {
  return (
    <div className="h-full">
      <h1 className="text-center text-5xl">Record admin</h1>
      <div className="grid h-full grid-cols-3">
        <Navigation />
        <main className="col-span-3 bg-gradient-to-l from-lime-600 to-lime-400 p-3 md:col-span-2">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function Navigation() {
  const { records } = useLoaderData<typeof loader>();
  return (
    <nav className="col-span-3 h-full bg-gradient-to-r from-lime-600 to-lime-400 p-3 md:col-span-1">
      <ul className="flex flex-col gap-2">
        <li>
          <RecordEntryLink relative="path" slug={".."} title="Back" />
        </li>
        {records.map((record) => {
          return (
            <li key={record.slug}>
              <RecordEntryLink slug={record.slug} title={record.title} />
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function RecordEntryLink({
  slug,
  title,
  relative = "route",
}: {
  slug: string;
  title: string;
  relative?: "path" | "route";
}) {
  return (
    <Link
      to={slug}
      className="block w-full rounded-lg bg-gradient-to-l from-lime-600 to-lime-400 p-1 font-bold shadow-md hover:from-lime-400 hover:to-lime-600 hover:text-white hover:underline"
      relative={relative}
    >
      {title}
    </Link>
  );
}
