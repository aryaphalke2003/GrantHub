import ReplayIcon from "@mui/icons-material/Replay";

// Utility component for use in forms with a submit and reset button
export default function SubmitResetButton({ handleSubmit, handleReset }) {
    return (
        <div className="inline-flex gap-x-px rounded-lg shadow-sm bg-blue-600">
            <button
                type="button"
                onClick={handleSubmit}
                className="py-2 px-4 text-base font-medium font-sans uppercase text-white bg-blue-500 rounded-l-lg border-none outline-none max-h-12 align-middle hover:bg-blue-600"
            >
                Submit
            </button>
            <button
                type="button"
                onClick={handleReset}
                className="py-1 px-4 text-white bg-blue-500 rounded-r-lg border-none outline-none max-h-12 hover:bg-blue-600"
            >
                <ReplayIcon fontSize="medium" />
            </button>
        </div>
    );
}
