import { json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
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
      <div className="flex justify-between">
        <h1>Records</h1>
        <div>
          {}
          <Form action="/logout" method="post">
            <button
              type="submit"
              className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
            >
              Logout
            </button>
          </Form>
        </div>
      </div>
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
