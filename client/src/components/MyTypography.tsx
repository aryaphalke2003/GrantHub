// Some custom typography

export function MyH2({ children }) {
    return (
        <h2 className="font-medium leading-tight text-4xl mt-2 text-gray-900">
            {children}
        </h2>
    );
}

export function MyH5({ children }) {
    return (
        <h5 className="m-0 mb-2 text-2xl font-bold font-sans tracking-tight text-gray-900">
            {children}
        </h5>
    );
}

export function MyP({ children }) {
    return <p className="mb-3 font-sans font-normal text-gray-700">{children}</p>;
}
