import type { LoaderArgs } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { getRecord } from "~/models/records.server";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ params }: LoaderArgs) => {
  invariant(params.slug, `params.slug is required`);
  const record = await getRecord(params.slug);
  invariant(record, `Record not found ${params.slug}`);

  return json({ record });
};

export default function UpdateRecord() {
  const { record } = useLoaderData<typeof loader>();
  return (
    <div>
      <h2>{record.slug}</h2>
      {record.heroes.map((hero) => {
        return <span key={hero.name}>{hero.name}</span>;
      })}
      {record.users.map((user) => {
        return <span key={user.email}>{user.email}</span>;
      })}
      <span>{record.category}</span>
      <span>{record.time}</span>
    </div>
  );
}
