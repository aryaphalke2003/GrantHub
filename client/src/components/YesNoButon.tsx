import { Clear, Done } from "@mui/icons-material";
import { Button } from "@mui/material";

// Button that toggles yes or no, like a checkbox
export default function YesNoButton({ accept, callback }: { accept: boolean, callback: () => void }) {
    return (
        <Button
            variant="contained"
            startIcon={accept ? <Done /> : <Clear />}
            color={accept ? "success" : "error"}
            onClick={() => callback()}
        >
            {accept ? "Yes" : "No"}
        </Button>
    );
}
