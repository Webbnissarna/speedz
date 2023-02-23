export default function TextInput({
  name,
  placeholder,
  error,
  required = false,
  autoFocus = false,
  type = "text",
}: {
  name: string;
  required?: boolean;
  autoFocus?: boolean;
  placeholder: string;
  error?: string | null;
  type?: React.HTMLInputTypeAttribute;
}) {
  return (
    <div className="relative flex w-full flex-col gap-2  rounded-md p-2 text-white shadow-md">
      <label className="absolute top-2 left-2 font-bold capitalize">
        {name}
      </label>
      <input
        className="mt-6 w-full border-b-2 border-b-amber-200 bg-transparent p-1"
        name={name}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={`${name}-error`}
        placeholder={placeholder}
        type={type}
        autoFocus={autoFocus}
      />
      <span className="text-gradient-error">{error ? error : ""}</span>
    </div>
  );
}
