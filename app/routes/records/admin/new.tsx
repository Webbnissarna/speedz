import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import type { ActionArgs } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import { useState } from "react";
import invariant from "tiny-invariant";
import ComboboxInput from "~/components/Form/Combobox";
import ComboBoxMultipleInput from "~/components/Form/ComboboxMultiple";

import {
  createRecord,
  getHeroes,
  getNumberOfEntries,
} from "~/models/records.server";
import { getUsers } from "~/models/user.server";

export const action = async ({ request }: ActionArgs) => {
  // TODO: remove me
  await new Promise((res) => setTimeout(res, 1000));

  const formData = await request.formData();
  const category = formData.get("category");
  const title = formData.get("title");
  const hours = formData.get("hours");
  const minutes = formData.get("minutes");
  const seconds = formData.get("seconds");

  const heroes = formData.getAll("hero");
  const users = formData.getAll("user");

  const errors = {
    category:
      category && category !== "default" ? null : `Category is required`,
    title: title && title.length > 0 ? null : `Title is required`,
    users: users.length > 0 ? null : `Need at least one user selected`,
    time:
      hours === "0" && minutes === "0" && seconds === "0"
        ? "Time needs to be more than zero"
        : null,
    heroes: heroes.length > 0 ? null : "At least one hero need to be picked",
  };

  console.log("category", category);
  console.log("heroes", heroes);
  console.log("users", users);

  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json(errors);
  }

  invariant(typeof category === "string", `Category must be a string`);
  invariant(typeof title === "string", `Title must be a string`);
  invariant(
    typeof hours === "string" && typeof parseInt(hours) === "number",
    `Hours must be a string`
  );
  invariant(
    typeof minutes === "string" && typeof parseInt(minutes) === "number",
    `Minutes must be a string`
  );
  invariant(
    typeof seconds === "string" && typeof parseInt(seconds) === "number",
    `Seconds must be a string`
  );

  const time = `${hours}:${minutes.padStart(2, "0")}:${seconds.padStart(
    2,
    "0"
  )}`;

  const index = await getNumberOfEntries();
  const slug = `hon-${index + 1}`;

  await createRecord(
    {
      category: category,
      slug: slug,
      time: time,
      title: title,
    },
    heroes.map((hero) => ({ name: hero.toString() })),
    users.map((user) => ({ email: user.toString() }))
  );
  return redirect("/records/admin");
};

export const loader = async () => {
  const heroes = await getHeroes();
  const users = await getUsers();

  return json({
    heroes: heroes,
    users: users,
  });
};

export default function NewRecord() {
  const errors = useActionData<typeof action>();
  const { heroes, users } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const isCreating = Boolean(navigation.state === "submitting");
  const categories = [
    "2 player all lanes",
    "1 player all lanes",
    "1 player one lane",
  ];

  return (
    <Form method="post" className="flex flex-col gap-4">
      <h2 className="text-gradient text-3xl font-bold">
        Add a new record entry
      </h2>
      <ComboboxInput
        options={categories}
        defaultText={"Select a category"}
        name={"category"}
      />

      <TextInput name={"title"} />
      <ComboBoxMultipleInput
        options={heroes.map((hero) => hero)}
        defaultText={"Pick heroes"}
        name={"hero"}
        placeholder={"Hero name"}
        error={errors?.heroes}
      />
      <ComboBoxMultipleInput
        options={users.map((user) => user.email)}
        defaultText={"Pick users"}
        name={"user"}
        placeholder={"User email"}
        error={errors?.users}
      />
      <TimeInput error={errors?.time} />
      <button
        type="submit"
        className="disabled:bg-gray-400"
        disabled={isCreating}
      >
        Add record attempt
      </button>
    </Form>
  );
}

function TextInput({ name }: { name: string }) {
  return (
    <div className="relative flex flex-col gap-2 rounded-md bg-gradient-to-l from-lime-400 to-lime-600 p-2 text-white shadow-md focus-within:from-lime-600 focus-within:to-lime-400 focus-within:text-black">
      <label className="absolute top-2 left-2 font-bold capitalize">
        {name}
      </label>
      <input
        className="mt-6 border-b-2 border-b-lime-900 bg-transparent p-1"
        name={name}
      />
    </div>
  );
}

function TimeInput({ error }: { error: string | null | undefined }) {
  return (
    <div className="flex flex-col rounded-md bg-gradient-to-l from-lime-400 to-lime-600 p-2 text-white shadow-md focus-within:from-lime-600 focus-within:to-lime-400 focus-within:text-black">
      <span>Time</span>
      <TimeInputValue name={"hours"} max={24} />
      <TimeInputValue name={"minutes"} max={59} />
      <TimeInputValue name={"seconds"} max={59} />
      {error ? <span className="text-red-700">{error}</span> : null}
    </div>
  );
}

function TimeInputValue({
  name,
  max,
}: {
  name: "seconds" | "minutes" | "hours";
  max: 24 | 59;
}) {
  return (
    <div className="flex gap-2">
      <label className="capitalize" htmlFor={name}>
        {name}
      </label>
      <input
        className="m-0 inline w-fit appearance-none bg-transparent"
        min={0}
        max={max}
        defaultValue={0}
        type="number"
        name={name}
      />
    </div>
  );
}
