import Label from "./Label";
import { useState } from "react";

export default function TextInput({
  name,
  placeholder,
  children,
  error,
  required,
  autoFocus,
  type = "text",
}: {
  name: string;
  placeholder: string;
  children?: React.ReactNode;
  error?: string | null;
  required?: boolean;
  autoFocus?: boolean;
  type?: "text" | "password";
}) {
  const [active, setActive] = useState(false);
  return (
    <div
      className="w-full max-w-[350px]"
      onFocus={() => {
        setActive(true);
      }}
      onBlur={() => {
        setActive(false);
      }}
    >
      <Label title={name} active={active} />
      <input
        className="placeholder:typo-body w-full border border-amber-600 bg-transparent bg-gradient-to-r from-amber-400/25 to-amber-600/25 px-4 py-4 placeholder:text-amber-200/50"
        placeholder={placeholder}
        id={name}
        name={name}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={`${name}-error`}
        type={type}
        autoFocus={autoFocus}
      >
        {children}
      </input>
      {error && <span className="text-red-600">{error}</span>}
    </div>
  );
}
