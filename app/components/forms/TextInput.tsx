import Label from "./Label";

export default function TextInput({
  title,
  placeholder,
  children,
  error,
  required,
  autoFocus,
  type = "text",
}: {
  title: string;
  placeholder: string;
  children?: React.ReactNode;
  error?: string | null;
  required?: boolean;
  autoFocus?: boolean;
  type?: "text" | "password";
}) {
  return (
    <div className="w-full max-w-[350px]">
      <Label title={title} />
      <input
        className="placeholder:typo-body w-full border border-amber-600 bg-transparent bg-gradient-to-r from-amber-400/25 to-amber-600/25 px-4 py-4 placeholder:text-amber-200/50"
        placeholder={placeholder}
        id={title}
        name={title}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={`${title}-error`}
        type={type}
        autoFocus={autoFocus}
      >
        {children}
      </input>
      {error && <span className="text-red-600">{error}</span>}
    </div>
  );
}
