export default function TextInput({
  name,
  placeholder,
  error,
}: {
  name: string;
  placeholder: string;
  error?: string | null;
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
      <span className="text-gradient-error">{error ? error : ""}</span>
    </div>
  );
}
