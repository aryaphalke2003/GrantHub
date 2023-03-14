import { TextFieldProps } from "@mui/material";

// Text field specifically for use inside MUI's DatePicker
export default function MyDatePickerTextField({
    label,
    inputRef,
    inputProps,
    InputProps,
    errorText,
}: TextFieldProps & { errorText?: string }) {
    return (
        <div className="w-full flex flex-col items-stretch">
            <div className="bg-gray-200 rounded-md shadow-md px-2 text-sm font-medium font-sans text-gray-700">
                {label}
            </div>
            <div
                className="grow
                    border-none
                    rounded-md
                    shadow-md
                    border
                    border-gray-300
                    bg-white
                    p-4
                    text-left
                    flex
                    flex-row
                    items-center
                    focus-within:border-blue-700
                    focus-within:outline-none
                    focus:ring-0
                    focus:outline-none"
            >
                <input
                    ref={inputRef}
                    className="
                        text-base
                        bg-white
                        border-none
                        outline-none
                        grow
                        font-medium
                        font-sans
                        min-w-0
                        text-gray-900"
                    {...inputProps}
                />
                <div className="grow-0">{InputProps?.endAdornment}</div>
            </div>
            {errorText && errorText.length > 0 && (
                <div className="bg-red-100 rounded-md shadow-md px-2 text-sm font-medium font-sans text-red-500">
                    {errorText}
                </div>
            )}
        </div>
    );
}
