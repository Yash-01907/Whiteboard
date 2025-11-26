import { useId } from "react";
import { useFormContext } from "react-hook-form";

function Input({ rules, name, placeholder, label, classname = "", ...props }) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const id = useId();
  const error = errors[name];

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label className="text-sm font-medium text-gray-300 ml-1">
          {label}
        </label>
      )}
      <input
        id={id}
        {...register(name, rules)}
        placeholder={placeholder}
        className={`w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 ${classname}`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
}

export default Input;
