// Utility function for a card
export default function MyCard({ children }: { children }) {
    return (
        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 shadow-md">
            {children}
        </div>
    );
}
