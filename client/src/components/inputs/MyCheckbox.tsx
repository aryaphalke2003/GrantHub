import YesNoButton from "../YesNoButon";

// Custom checkbox
export default function MyCheckbox({
    label,
    value,
    onChange,
    error = null,
}: {
    label: string;
    value;
    onChange: (v) => void;
    error?: string;
}) {
    return (
        <div className="w-full flex flex-col items-stretch">
            <div className="bg-gray-200 rounded-md px-2 text-sm font-medium font-sans text-gray-700 shadow-md">
                {label}
            </div>
            <div className="grow border-none p-3 rounded-md shadow-md focus-within:border-blue-700
                    focus-within:outline-none
                    focus:ring-0
                    focus:outline-none">
                <YesNoButton accept={value} callback={() => onChange(!value)} />
            </div>
            {error && error.length > 0 && (
                <div className="bg-red-100 rounded-md shadow-md px-2 text-sm font-medium font-sans text-red-500">
                    {error}
                </div>
            )}
        </div>
    );
}
