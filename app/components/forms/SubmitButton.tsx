import React from "react";

type SubmitButtonProps = {
  children: React.ReactNode;
  state: "submitting" | "idle" | "loading";
};

export default function SubmitButton({ children, state }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      className="hover:border-amber-20 min-w-[200px] border border-amber-400 p-2 hover:bg-gradient-to-br hover:from-slate-50/25 hover:to-transparent"
      disabled={state === "submitting"}
    >
      <span>{children}</span>
    </button>
  );
}
