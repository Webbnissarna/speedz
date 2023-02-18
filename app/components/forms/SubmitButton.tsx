import React from "react";

type SubmitButtonProps = {
  children: React.ReactNode;
  state: "submitting" | "idle" | "loading";
};

export default function SubmitButton({ children, state }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      className="min-w-[200px] rounded-md border border-amber-200 p-2 hover:border-amber-50 hover:bg-gradient-to-br hover:from-slate-50/25 hover:to-transparent"
      disabled={state === "submitting"}
    >
      {children}
    </button>
  );
}
