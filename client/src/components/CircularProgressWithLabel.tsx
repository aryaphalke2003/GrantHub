import { Box, CircularProgress, CircularProgressProps, Typography } from "@mui/material";

export interface CircularProgressWithLabelProps extends CircularProgressProps {
    value: number;
}

// Utility for a circular %age progressbar
export function CircularProgressWithLabel(props: CircularProgressWithLabelProps) {
    return (
        <Box sx={{ position: "relative", display: "inline-flex" }}>
            <CircularProgress
                variant="determinate"
                {...props}
                value={props.value > 100 ? 100 : props.value}
            />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Typography
                    variant="caption"
                    component="div"
                    color={props.value > 100 ? "error.main" : "text.secondary"}
                >
                    {`${
                        props.value > 100 ? ">100" : Math.max(Math.round(props.value), 0)
                    }%`}
                </Typography>
            </Box>
        </Box>
    );
}
