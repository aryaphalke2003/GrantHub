import "./FileUpload.css";

// Custom component for file uploads
export default function FileUpload({
    value,
    onChange,
    label,
    error,
    accept,
}: {
    value: File;
    onChange: (f: File) => void;
    label: string;
    error?: string;
    accept?: string;
}) {
    return (
        <div className="w-full">
            <div className="bg-gray-200 rounded-md px-2 text-sm font-medium font-sans text-gray-700">
                {label}
            </div>
            <div className={"flex"}>
                <input
                    className="grow block
                text-base
                font-sans
                text-gray-900
                bg-white bg-clip-padding
                rounded-md
                shadow-md
                transition
                ease-in-out
                py-2
                px-2
                focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                    type="file"
                    onChange={e => onChange(e.target.files[0])}
                    placeholder="Choose File..."
                    accept={accept}
                />
            </div>
            {error && error.length > 0 && (
                <div className="bg-red-100 rounded-md px-2 text-sm font-medium font-sans text-red-500">
                    {error}
                </div>
            )}
        </div>
    );
}
