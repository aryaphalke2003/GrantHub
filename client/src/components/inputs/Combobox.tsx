import { Combobox } from "@headlessui/react";
import { Check, KeyboardArrowDown, Remove } from "@mui/icons-material";
import { useState } from "react";

// Combobox adapted from https://headlessui.dev/react/combobox
export default function MyCombobox({
    label,
    options,
    getLabel,
    value,
    onChange,
    multiple = false,
    error = null,
    spellcheck = false,
    onBlur,
}: {
    label: string;
    options: any[];
    getLabel: (v: any) => string;
    value;
    onChange: (v) => void;
    multiple?: boolean;
    error?: string;
    spellcheck?: boolean;
    onBlur?: () => void;
}) {
    const [query, setQuery] = useState("");

    return (
        <div className="w-full">
            <Combobox value={value} onChange={onChange} multiple={multiple}>
                <div className="relative w-full flex">
                    <Combobox.Label className="grow bg-gray-200 rounded-md px-2 text-sm font-medium font-sans text-gray-700">
                        {label}
                    </Combobox.Label>
                </div>
                <div className="relative w-full">
                    <div className="flex">
                        <div className="grow cursor-default rounded-md shadow-md border border-gray-300 bg-white p-2 text-left focus-within:border-blue-700 focus-within:outline-none focus-within:ring-1 focus-within:ring-blue-700 flex flex-row">
                            {multiple ? (
                                <div className="grow flex flex-wrap gap-2">
                                    {value.map(v => {
                                        const label = getLabel(v);
                                        return (
                                            <span
                                                key={label}
                                                className="items-center gap-1 rounded bg-gray-100 px-2 py-0.5 inline-flex"
                                            >
                                                <span className="text-base font-medium font-sans text-gray-900">
                                                    {label}
                                                </span>
                                                <span
                                                    onClick={() =>
                                                        onChange(
                                                            value.filter(x => x !== v)
                                                        )
                                                    }
                                                    className="items-center"
                                                >
                                                    <Remove fontSize="small" />
                                                </span>
                                            </span>
                                        );
                                    })}
                                    <Combobox.Input
                                        onChange={e => setQuery(e.target.value)}
                                        displayValue={
                                            multiple ? undefined : p => getLabel(p)
                                        }
                                        className="border-none p-2 text-base min-w-0 font-medium font-sans text-gray-900 focus:ring-0 focus:outline-none"
                                        placeholder="Search..."
                                        onBlur={onBlur}
                                    />
                                </div>
                            ) : (
                                <Combobox.Input
                                    onChange={e => setQuery(e.target.value)}
                                    displayValue={multiple ? undefined : p => getLabel(p)}
                                    className="grow border-none p-2 text-base min-w-0 font-medium font-sans text-gray-900 focus:ring-0 focus:outline-none"
                                    placeholder="Search..."
                                    spellCheck={spellcheck}
                                />
                            )}
                            <Combobox.Button className="round-md border-0 bg-white hover:bg-gray-100 focus:ring-0 focus:outline-none">
                                <KeyboardArrowDown fontSize="small" />
                            </Combobox.Button>
                        </div>
                    </div>
                    <Combobox.Options className="p-0 absolute w-full shadow-lg max-h-120 rounded-md bg-white z-50 overflow-y-scroll text-base list-none focus:outline-none">
                        {options
                            .filter(p =>
                                getLabel(p).toLowerCase().includes(query.toLowerCase())
                            )
                            .map(p => {
                                const label = getLabel(p);
                                return (
                                    <Combobox.Option
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
                                    </Combobox.Option>
                                );
                            })}
                    </Combobox.Options>
                    {error && error.length > 0 && (
                        <div className="relative w-full flex">
                            <div className="grow bg-red-100 rounded-md shadow-md px-2 text-sm font-medium font-sans text-red-500">
                                {error}
                            </div>
                        </div>
                    )}
                </div>
            </Combobox>
        </div>
    );
}
