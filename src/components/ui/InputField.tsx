// This is like a checklist of what props the component expects and what kind of values they should be
export interface InputFormProps {
  label: string; // label should be a string
  placeholder: string; // placeholder should be a string
  value?: string; // value is optional and should be a string if provided
  type?: string; // type is optional and should be a string if provided
  large?: boolean; // large is optional and should be a boolean(true or false) if provided
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void; // onChange is optional and should be a function that takes an event and returns void
}

export function InputForm({
  label,
  placeholder,
  value,
  type,
  large,
  onChange,
}: InputFormProps) {
  // This is telliing TypeScript "I expect these props to follow the InputFormProps rules we defined above."
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-zinc-600 font-medium text-sm">{label}</label>
      {large ? (
        <textarea
          className={`bg-white py-2 px-3 border border-zinc-300 placeholder:text-zinc-500 text-zinc-900 shadow-xs rounded-lg focus:ring-[4px] focus:ring-zinc-400/15 focus:outline-none h-24 align-text-top`}
          placeholder={placeholder}
          value={value || ""}
          onChange={onChange}
        />
      ) : (
        <input
          className={`bg-white py-2 px-3 border border-zinc-300 placeholder:text-zinc-500 text-zinc-900 shadow-xs rounded-lg focus:ring-[4px] focus:ring-zinc-400/15 focus:outline-none`}
          type={type}
          placeholder={placeholder}
          value={value || ""}
          onChange={onChange}
        />
      )}
    </div>
  );
}
