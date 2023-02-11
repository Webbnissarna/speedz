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

import {
  createRecord,
  getHeroes,
  getNumberOfEntries,
} from "~/models/records.server";
import { getUsers } from "~/models/user.server";
import { getUser } from "~/session.server";

export const action = async ({ request }: ActionArgs) => {
  // TODO: remove me
  await new Promise((res) => setTimeout(res, 1000));
  const user = await getUser(request);
  invariant(user !== null, `User must be defined`);

  const formData = await request.formData();
  const category = formData.get("category");
  const title = formData.get("title");
  const hours = formData.get("hours");
  const minutes = formData.get("minutes");
  const seconds = formData.get("seconds");

  const errors = {
    category:
      category && category !== "default" ? null : `Category is required`,
    title: title && title.length > 0 ? null : `Title is required`,
    user: user ? null : `User not found`,
    time:
      hours === "0" && minutes === "0" && seconds === "0"
        ? "Time needs to be more than zero"
        : null,
    heroes: null,
  };

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
    [{ name: "Polly" }],
    [user]
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
      <h2 className="text-3xl font-bold">Add new record entry</h2>
      <SelectInput
        name="category"
        defaultText="Select a category"
        error={errors?.category}
        options={categories}
      />
      <AutofillTextInput
        name={"heroes"}
        placeholder="Select a hero"
        error={errors?.heroes}
        options={heroes.map((hero) => hero)}
      />
      <AutofillTextInput
        name={"users"}
        placeholder="Select a user"
        error={errors?.heroes}
        options={users.map((user) => user.email)}
      />
      <TextInput name={"title"} />
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

function AutofillTextInput({
  name,
  placeholder,
  error,
  options,
}: {
  name: string;
  placeholder: string;
  error: string | null | undefined;
  options: Array<string>;
}) {
  const [chosenValues, setChosenValues] = useState<string[]>([]);
  return (
    <div>
      <label htmlFor={name}>{name}</label>
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        onKeyDown={(e) => {
          e.stopPropagation();
          if (e.key === "enter") {
            console.log("enter");
          }
        }}
      />
      <ul>
        {options
          .filter((option) => !chosenValues.includes(option))
          .map((option) => {
            return (
              <li
                key={option}
                onClick={(e) => {
                  setChosenValues([...chosenValues, option]);
                }}
              >
                {option}
              </li>
            );
          })}
      </ul>
      <ul>
        {chosenValues.map((value) => {
          return <li key={value}></li>;
        })}
      </ul>
      {error && <span>{error}</span>}
    </div>
  );
}

function SelectInput({
  name,
  defaultText,
  error,
  options,
}: {
  name: string;
  defaultText: string;
  error: string | null | undefined;
  options: Array<string>;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-md bg-gradient-to-l from-lime-400 to-lime-600 p-2 text-white focus-within:from-lime-600 focus-within:to-lime-400 focus-within:text-black">
      <label className="capitalize">{name}</label>
      {error ? <em className="text-red-600">{error}</em> : null}
      <select
        name={name}
        className="border-b-2 border-b-lime-900 bg-transparent p-1"
      >
        <option value={"default"}>{defaultText}</option>
        {options.map((option) => {
          return (
            <option
              className="bg-lime-400 bg-gradient-to-l from-lime-400 to-lime-600 hover:bg-lime-400"
              key={option}
            >
              {option}
            </option>
          );
        })}
      </select>
    </div>
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
