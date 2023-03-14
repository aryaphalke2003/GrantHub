import { ReactNode, useState } from "react";

// Custom tab-bar based panel switcher
export default function MyTabs({
    tabs,
    panels,
    onChange,
}: {
    tabs: ReactNode[];
    panels: ReactNode[];
    onChange?: (active: number) => void;
}) {
    const [active, setActive] = useState(0);

    return (
        <div className="w-full flex flex-col justify-center items-center">
            <div className="grow-0 w-full min-h-24 rounded-md bg-blue-600 p-4 flex flex-row gap-4 shadow-md">
                {tabs.map((t, i) => (
                    <div
                        className={`grow rounded-md p-2 font-medium font-sans text-lg transition-colors duration-200 ease-in-out align-middle flex items-center justify-center ${
                            active === i
                                ? "bg-white text-blue-500"
                                : "bg-transparent text-white hover:bg-blue-400"
                        }`}
                        onClick={() => {
                            setActive(i);
                            onChange(i);
                        }}
                    >
                        <span className="select-none">{t}</span>
                    </div>
                ))}
            </div>
            <div className="grow w-full rounded-md shadow-md bg-blue-200 p-4 font-sans font-medium">
                {panels[active % panels.length]}
            </div>
        </div>
    );
}
