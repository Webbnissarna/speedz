import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";

import { getRecords } from "~/models/records.server";

export const loader = async () => {
  return json({ records: await getRecords() });
};

export default function RecordAdmin() {
  const { records } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Record admin</h1>
      <div className="grid grid-cols-3">
        <nav className="col-span-3 md:col-span-1">
          <Link to={".."} relative="path">
            Back
          </Link>
          <ul>
            {records.map((record) => {
              return (
                <li key={record.slug}>
                  <Link
                    to={record.slug}
                    className="text-blue-700 hover:underline"
                  >
                    {record.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <main className="col-span-2">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
