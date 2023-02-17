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
import ComboboxInput from "~/components/form/Combobox";
import ComboBoxMultipleInput from "~/components/form/ComboboxMultiple";

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
      categoryName: category,
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
    <Form method="post" className="flex max-w-md flex-col gap-4">
      <h2 className="text-gradient text-3xl font-bold">
        Add a new record entry
      </h2>
      <ComboboxInput
        options={categories}
        defaultText={"Search for a category"}
        name={"category"}
      />

      <TextInput name={"title"} placeholder="A unique title 📝" />
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

function TextInput({
  name,
  placeholder,
}: {
  name: string;
  placeholder: string;
}) {
  return (
    <div className="relative flex w-fit flex-col gap-2  rounded-md p-2 text-white shadow-md">
      <label className="absolute top-2 left-2 font-bold capitalize">
        {name}
      </label>
      <input
        className="mt-6 border-b-2 border-b-amber-200 bg-transparent p-1"
        name={name}
        placeholder={placeholder}
      />
    </div>
  );
}

function TimeInput({ error }: { error: string | null | undefined }) {
  return (
    <div className="flex w-fit flex-col rounded-md border border-amber-200 p-2">
      <span className="cursor-default">Time</span>
      <div className="flex gap-2">
        <TimeInputValue name={"hours"} max={24} />
        <span className="text-5xl">:</span>
        <TimeInputValue name={"minutes"} max={59} />
        <span className="text-5xl">:</span>
        <TimeInputValue name={"seconds"} max={59} />
      </div>
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
  const [value, setValue] = useState(0);
  return (
    <div className="flex gap-2">
      <label className="capitalize" htmlFor={name} hidden>
        {name}
      </label>
      <input
        min={0}
        max={max}
        type="number"
        name={name}
        hidden
        value={value}
        readOnly
      />
      <span
        className="cursor-default text-5xl"
        onKeyDown={(e) => {
          switch (e.code) {
            case "ArrowDown":
              if (value > 0) {
                setValue(value - 1);
              }
              break;
            case "ArrowUp":
              if (value < max) {
                setValue(value + 1);
              }
              break;
            default:
              break;
          }
        }}
        tabIndex={0}
      >
        {value}
      </span>
    </div>
  );
}
