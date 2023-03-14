import { Listbox } from "@headlessui/react";
import { KeyboardArrowDown, Check } from "@mui/icons-material";

// Select adapted from https://headlessui.dev/react/listbox
export default function MySelect({
    label,
    options,
    getLabel,
    value,
    onChange,
    multiple = false,
    error = null,
    onBlur,
}: {
    label: string;
    options: any[];
    getLabel: (v: any) => string;
    value;
    onChange: (v) => void;
    multiple?: boolean;
    error?: string;
    onBlur?: () => void;
}) {
    return (
        <div className="w-full">
            <Listbox value={value} onChange={onChange} multiple={multiple}>
                <div className="relative w-full flex">
                    <Listbox.Label className="grow bg-gray-200 rounded-md shadow-md px-2 text-sm font-medium font-sans text-gray-700">
                        {label}
                    </Listbox.Label>
                </div>
                <div className="relative w-full">
                    <div className="flex">
                        <div className="grow cursor-default rounded-md shadow-md border border-gray-300 bg-white p-2 text-left focus-within:border-blue-700 flex flex-row hover:bg-gray-100 focus-within:outline-none focus-within:ring-1 focus-within:ring-blue-700">
                            <Listbox.Button
                                className="round-md border-0 bg-transparent focus:ring-0 focus:outline-none grow flex flex-row justify-between items-center"
                                onBlur={onBlur}
                            >
                                <span className="text-base font-medium font-sans text-gray-900 p-2">
                                    {value ? getLabel(value) : "Select..."}
                                </span>
                                <KeyboardArrowDown fontSize="small" />
                            </Listbox.Button>
                        </div>
                    </div>
                    <Listbox.Options className="p-0 absolute w-full shadow-lg max-h-120 rounded-md bg-white z-50 overflow-auto text-base list-none focus:outline-none">
                        {options.map(p => {
                            const label = getLabel(p);
                            return (
                                <Listbox.Option
                                    key={label}
                                    value={p}
                                    className={({ active }) =>
                                        `relative cursor-default select-none px-2 py-2 rounded-sm focus:outline-none text-base font-sans ${
                                            active
                                                ? "bg-blue-300 text-white"
                                                : "text-gray-900"
                                        }`
                                    }
                                >
                                    {({ selected }) => (
                                        <>
                                            <div className="truncate flex flex-row justify-between">
                                                <div>{label}</div>
                                                <div>
                                                    {selected && (
                                                        <Check fontSize="small" />
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </Listbox.Option>
                            );
                        })}
                    </Listbox.Options>
                    {error && error.length > 0 && (
                        <div className="relative w-full flex">
                            <div className="grow bg-red-100 rounded-md shadow-md px-2 text-sm font-medium font-sans text-red-500">
                                {error}
                            </div>
                        </div>
                    )}
                </div>
            </Listbox>
        </div>
    );
}
