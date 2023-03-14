import { HelpOutlineRounded } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { ReactNode } from "react";

export default function InfoHover({ children }: { children: ReactNode }) {
    return (
        <Tooltip title={children}>
            <IconButton>
                <HelpOutlineRounded fontSize="small" />
            </IconButton>
        </Tooltip>
    );
}
