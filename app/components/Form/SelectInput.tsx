export default function SelectInput({
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
    <div className="flex flex-col gap-1 rounded-md">
      <label className="capitalize text-amber-500">{name}</label>
      {error ? <em className="text-red-600">{error}</em> : null}
      <select
        name={name}
        className="border-b-2 border-b-amber-900 bg-transparent p-1"
      >
        <option value={"default"}>{defaultText}</option>
        {options.map((option) => {
          return (
            <option className="" key={option}>
              {option}
            </option>
          );
        })}
      </select>
    </div>
  );
}
