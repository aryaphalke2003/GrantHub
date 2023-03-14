// Custom text field
export default function MyTextField({
    label,
    value,
    onChange,
    type = "text",
    error = null,
    disabled = false,
    spellcheck = false,
    onBlur,
}: {
    label: string;
    value;
    onChange: (v) => void;
    type?: "text" | "number";
    error?: string;
    disabled?: boolean;
    spellcheck?: boolean;
    onBlur?: () => void;
}) {
    return (
        <div className="w-full flex flex-col items-stretch">
            <div className="bg-gray-200 rounded-md px-2 text-sm font-medium font-sans text-gray-700 shadow-md">
                {label}
            </div>
            <input
                disabled={disabled}
                type={type}
                className="grow
                    border-none
                    p-4
                    text-base
                    font-medium
                    font-sans
                    text-gray-900
                    rounded-md
                    shadow-md
                    border
                    border-gray-300
                    bg-white
                    text-left
                    focus-within:border-blue-700
                    focus-within:outline-none
                    focus:ring-0
                    focus:outline-none
                    disabled:text-gray-400"
                value={value}
                onChange={e => onChange(e.target.value)}
                spellCheck={spellcheck}
                onBlur={onBlur}
            />
            {error && error.length > 0 && (
                <div className="bg-red-100 rounded-md shadow-md px-2 text-sm font-medium font-sans text-red-500">
                    {error}
                </div>
            )}
        </div>
    );
}
