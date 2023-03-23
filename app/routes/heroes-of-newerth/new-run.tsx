import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import type { ActionArgs } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/server-runtime";
import { useState } from "react";
import ComboboxInput from "~/components/forms/Combobox";
import ComboboxMultiple from "~/components/forms/ComboboxMultiple";
import TextInput from "~/components/forms/TextInput";
import { getCategoriesForGame } from "~/models/category.server";

import { createHoNRun } from "~/models/honrun.server";

import { getUsers } from "~/models/user.server";
import { heroes } from "~/static-data/heroes";

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();

  const errors = {};

  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json(errors);
  }
};

export const loader = async () => {
  // const heroes = await getHeroes();
  const users = await getUsers();
  const categories = await getCategoriesForGame("heroes of newerth");

  return json({
    heroes: heroes,
    users: users,
    categories: categories,
  });
};

export default function NewHoNRun() {
  const errors = useActionData<typeof action>();
  const { heroes, users, categories } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const isCreating = Boolean(navigation.state === "submitting");

  return (
    <Form
      method="post"
      className="mx-auto flex max-w-form flex-col items-center gap-4"
    >
      <TextInput title="run" placeholder="Name of the run" />
      <ComboboxInput
        defaultText="Category name"
        name="category"
        options={categories.map((category) => category.name) ?? []}
      />
      <ComboboxMultiple
        defaultText="Hero name"
        name="Heroes"
        options={heroes.map((hero) => hero.name)}
        placeholder=""
        error={null}
      />
    </Form>
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
