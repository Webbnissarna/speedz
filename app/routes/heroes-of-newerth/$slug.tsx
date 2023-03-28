import type { LoaderArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import type { HoNHero, User } from "@prisma/client";

import { getHoNRunBySlug } from "~/models/honrun.server";

export const loader = async ({ params }: LoaderArgs) => {
  invariant(params.slug, `params.slug is required`);
  const HoNRun = await getHoNRunBySlug(params.slug);
  invariant(HoNRun, `Run not found ${params.slug}`);

  return json({ HoNRun });
};

export default function RecordSlug() {
  const { HoNRun } = useLoaderData<typeof loader>();
  return (
    <div className="flex flex-col gap-5">
      <h2 className="typo-h2">{HoNRun.run.title}</h2>
      <p>Hero{HoNRun.HoNHeroes.length > 1 ? "es" : ""} used:</p>
      <div className="flex gap-3">
        {HoNRun.HoNHeroes.map((hero) => {
          return <HeroPortrait key={hero.name} hero={hero} />;
        })}
      </div>
      <p>Played by player{HoNRun.run.users.length > 1 ? "s" : ""}</p>
      <div>
        {HoNRun.run.users.map((user) => {
          return <UserPortrait key={user.id} user={user} />;
        })}
      </div>
      <div>
        <p>Category played:</p>
        <span>{HoNRun.run.category.name}</span>
      </div>
      <div>
        <p>Time achieved:</p>
        <span>{HoNRun.run.time}</span>
      </div>
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
      <h3 className="typo-h3 truncate" title={hero.name}>
        {hero.name}
      </h3>
    </Portrait>
  );
}

function UserPortrait({ user }: { user: Pick<User, "name"> }) {
  return (
    <Portrait>
      <img alt={user.name} />
      <h3 className="typo-h3 truncate" title={user.name}>
        {user.name}
      </h3>
    </Portrait>
  );
}
