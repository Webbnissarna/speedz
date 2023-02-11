import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getRecord } from "~/models/records.server";
import invariant from "tiny-invariant";

export const loader = async ({ params }: LoaderArgs) => {
  invariant(params.slug, `params.slug is required`);
  const record = await getRecord(params.slug);
  invariant(record, `Record not found ${params.slug}`);
  return json({ record });
};

export default function RecordSlug() {
  const { record } = useLoaderData<typeof loader>();
  return (
    <main>
      <h1>Some Record for category {record?.category}</h1>
      <span>Time {record.time}</span>
    </main>
  );
}
