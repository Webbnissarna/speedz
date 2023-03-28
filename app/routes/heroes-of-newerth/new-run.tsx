import type { Category } from "@prisma/client";
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
import ComboboxInput from "~/components/forms/Combobox";
import ComboboxMultiple from "~/components/forms/ComboboxMultiple";
import SubmitButton from "~/components/forms/SubmitButton";
import Textarea from "~/components/forms/Textarea";
import TextInput from "~/components/forms/TextInput";
import TimeInput from "~/components/forms/TimeInput";
import { getCategoriesForGame } from "~/models/category.server";
import { getHeroesByName } from "~/models/honhero.server";

import { createHoNRun } from "~/models/honrun.server";
import { getRunsForGame } from "~/models/run.server";

import { getUsers, getUsersByName } from "~/models/user.server";
import { heroes } from "~/static-data/heroes";

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const categories = await getCategoriesForGame("heroes of newerth");

  const formName = formData.get("run");
  const formCategory = formData.get("category");
  const formHeroes = formData.getAll("heroes");
  const formUsers = formData.getAll("users");
  const formTime = formData.get("time");
  const formNotes = formData.get("notes");

  const category =
    formCategory &&
    categories.find(
      (c) => c.name.toLowerCase() === formCategory.toString().toLowerCase()
    );

  const selectedHeroes = formHeroes.map((hero) => {
    return hero.toString();
  });
  const selectedUsers = formUsers.map((user) => {
    return user.toString();
  });

  const errors = {
    name: formName ? null : "Name is required",
    category: category ? null : "Category is required",
    heroes: category
      ? validateCategory(category, selectedHeroes)
        ? null
        : "Heroes are required"
      : "Category is required",
    users: category
      ? validateCategory(category, selectedUsers)
        ? null
        : "Users are required"
      : "Category is required",
    time: formTime ? null : "Time is required",
    exists: null,
  };
  console.log("time", formTime);

  console.log("errors", errors);

  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json(errors);
  }

  invariant(category, "Category must be provided");
  invariant(formName && typeof formName === "string", "Name must be a string");
  invariant(
    formTime && typeof formTime === "string" && validateTime(formTime),
    "Time must be a string"
  );

  const users = await getUsersByName(selectedUsers);

  invariant(
    users && users.length > 0 && users.length === category.nbrOfPlayers,
    "Users must be provided"
  );

  const heroes = await getHeroesByName(selectedHeroes);

  const numberOfRuns = (await getRunsForGame("heroes of newerth")).length;

  console.log("creating run");

  const result = await createHoNRun(
    {
      title: formName,
      time: formTime,
      gameName: "heroes of newerth",
      slug: `${formName.toLowerCase().replace(/ /g, "-")}-${numberOfRuns}`,
      note: formNotes?.toString() ?? null,
    },
    heroes,
    users,
    category.id
  );

  //Check if result is the same as existing run
  if ("exists" in result) {
    return json({ ...errors, exists: "Run already exists" });
  }

  return redirect(`/heroes-of-newerth/`);
};

function validateCategory(category: Category, items: string[]) {
  if (items.length !== category.nbrOfPlayers) {
    return false;
  }

  return true;
}

function validateTime(time: string) {
  const timeRegex = /^([0-5][0-9]):([0-5][0-9])$/;
  return timeRegex.test(time);
}

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
  const { state } = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  return (
    <Form
      method="post"
      className="mx-auto flex max-w-form flex-col items-center gap-4"
    >
      <TextInput
        error={errors?.name}
        name="run"
        placeholder="Name of the run"
      />
      <ComboboxInput
        defaultText="Category name"
        name="category"
        options={categories.map((category) => category.name) ?? []}
        error={errors?.category}
        setValue={(value: string) => {
          const category = categories.find(
            (category) => category.name === value
          );
          setSelectedCategory(category ?? null);
        }}
      />
      <ComboboxMultiple
        defaultText="Hero name"
        name="heroes"
        options={heroes}
        placeholder="Hero name"
        error={errors?.heroes}
        maxSelectedItems={selectedCategory ? selectedCategory.nbrOfPlayers : 5}
      />
      <ComboboxMultiple
        defaultText="User name"
        name="users"
        options={users.map((user) => {
          const abbr = user.name.at(0) ?? "";
          return {
            name: user.name,
            abbr: abbr,
          };
        })}
        placeholder="User name"
        error={errors?.users}
        maxSelectedItems={selectedCategory ? selectedCategory.nbrOfPlayers : 5}
      />
      <TimeInput error={errors?.time} name={"time"} />
      <Textarea name="notes" placeholder="Any particularities to report?" />
      <SubmitButton error={errors?.exists} state={state}>
        Add run
      </SubmitButton>
    </Form>
  );
}
