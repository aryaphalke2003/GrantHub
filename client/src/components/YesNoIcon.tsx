import { Clear, Done } from "@mui/icons-material";
import { Box } from "@mui/material";

// Icon that toggles yes or no, non-interactable
export default function YesNoIcon({ accept }: { accept: boolean }) {
    return (
        <Box
            sx={{
                color: "white",
                backgroundColor: accept ? "success.main" : "error.main",
                borderRadius: 5,
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                padding: 1,
            }}
        >
            {accept ? <Clear /> : <Done />}
            <div style={{ width: 5 }}></div>
            {accept ? "YES" : "NO"}
        </Box>
    );
}
