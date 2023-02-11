import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getRecords } from "~/models/records.server";

export const loader = async () => {
  return json({
    records: await getRecords(),
  });
};

export default function Records() {
  const { records } = useLoaderData<typeof loader>();
  return (
    <main>
      <h1>Records</h1>
      <Link to={`admin`} className="text-blue-700 underline">
        Create new record
      </Link>
      <ul>
        {records.map((record) => {
          return (
            <li key={record.slug}>
              <h2>{record.slug}</h2>
              <span>{record.category}</span>
              <Link to={record.slug} className="text-blue-600 underline">
                Go to record
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
