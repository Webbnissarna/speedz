import type { LoaderArgs } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { getRecord } from "~/models/records.server";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { HoNHero, User } from "@prisma/client";

export const loader = async ({ params }: LoaderArgs) => {
  invariant(params.slug, `params.slug is required`);
  const record = await getRecord(params.slug);
  invariant(record, `Record not found ${params.slug}`);

  return json({ record });
};

export default function UpdateRecord() {
  const { record } = useLoaderData<typeof loader>();
  return (
    <div className="flex flex-col gap-5">
      <h2>{record.title}</h2>
      <div className="flex gap-3">
        {record.heroes.map((hero) => {
          return <HeroPortrait key={hero.name} hero={hero} />;
        })}
      </div>
      <div>
        {record.users.map((user) => {
          return <UserPortrait key={user.email} user={user} />;
        })}
      </div>
      <span>{record.category.name}</span>
      <span>{record.time}</span>
    </div>
  );
}

function Portrait({ children }: { children: React.ReactNode }) {
  return (
    <div className="aspect-[4/5] min-w-[50px] max-w-[125px] border border-amber-400 p-2">
      {children}
    </div>
  );
}

function HeroPortrait({ hero }: { hero: HoNHero }) {
  return (
    <Portrait>
      <img alt={hero.name} className="" />
      <h3 className="truncate text-lg font-bold" title={hero.name}>
        {hero.name}
      </h3>
    </Portrait>
  );
}

function UserPortrait({ user }: { user: Pick<User, "email" | "name"> }) {
  return (
    <Portrait>
      <img alt={user.email} />
      <h3>{user.name ? user.name : user.email}</h3>
    </Portrait>
  );
}
