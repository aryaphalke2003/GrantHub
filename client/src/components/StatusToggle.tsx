import { AccessTime, Clear, Done } from "@mui/icons-material";
import { Box } from "@mui/material";

export type Status = "pending" | "accepted" | "rejected";

// 3-value status toggle
export default function StatusToggle({ status }: { status: Status }) {
    let icon, color;
    if (status === "pending") {
        color = "warning.main";
        icon = <AccessTime />;
    } else if (status === "accepted") {
        color = "success.main";
        icon = <Done />;
    } else if (status === "rejected") {
        color = "error.main";
        icon = <Clear />;
    } else console.error("Invalid status type");
    return (
        <Box
            sx={{
                color: "white",
                backgroundColor: color,
                borderRadius: 5,
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
                padding: 1,
            }}
        >
            {icon}
            <div style={{ width: 5 }}></div>
            {status.toUpperCase()}
        </Box>
    );
}
