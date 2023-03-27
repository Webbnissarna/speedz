import { Form, useActionData, useNavigation } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import NumberInput from "~/components/forms/NumberInput";
import SubmitButton from "~/components/forms/SubmitButton";
import TextInput from "~/components/forms/TextInput";
import { createCategory } from "~/models/category.server";

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const category = formData.get("category");
  const playerCount = formData.get("player count");
  const numberOfPlayers = playerCount && parseInt(playerCount.toString());

  const errors = {
    category:
      typeof category === "string" && category.length > 0
        ? null
        : "Please enter category name",
    playerCount:
      typeof numberOfPlayers === "number"
        ? validateNumberOfPlayers(numberOfPlayers)
        : "Error reading number of players",
  };

  const hasErrors = Object.values(errors).some((error) => error);
  if (hasErrors) {
    return json(errors);
  }

  invariant(typeof category === "string", "Category must be a string");
  invariant(
    typeof numberOfPlayers === "number",
    "Number of players must be an integer"
  );

  await createCategory(category, "heroes of newerth", numberOfPlayers);
  return redirect("/heroes-of-newerth");
};

function validateNumberOfPlayers(numberOfPlayers: number) {
  if (numberOfPlayers < 1) {
    return "Number of players must be greater than 0";
  }

  if (numberOfPlayers > 5) {
    return "Number of players cannot exceed 5";
  }

  return null;
}

export default function NewCategory() {
  const errors = useActionData<typeof action>();
  const { state } = useNavigation();
  return (
    <Form method="post" className="flex flex-col items-center gap-8">
      <TextInput
        error={errors?.category}
        placeholder="Category name"
        name="category"
      />
      <NumberInput error={errors?.playerCount} title="player count" />
      <SubmitButton state={state}>Create category</SubmitButton>
    </Form>
  );
}
