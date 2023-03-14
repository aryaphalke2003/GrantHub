import { DatePicker } from "@mui/lab";
import { Paper, Typography } from "@mui/material";
import InfoHover from "./InfoHover";
import MyDatePickerTextField from "./inputs/MyDatePickerTextField";

export interface DateRangePickerProps {
    title: string;
    fromDate: Date | null;
    toDate: Date | null;
    setFromDate: (d: Date | null) => void;
    setToDate: (d: Date | null) => void;
    tooltip?: string;
}

// Utility for picking a date range
export default function DateRangePicker(props: DateRangePickerProps) {
    return (
        <Paper
            variant="outlined"
            style={{ padding: "10px", backgroundColor: "transparent" }}
        >
            <div className="flex flex-col gap-4">
                <Typography variant="body1" style={{ flexGrow: 1, padding: "5px" }}>
                    {props.title}
                    <InfoHover>{props.tooltip}</InfoHover>
                </Typography>
                <div className="w-full">
                    <DatePicker
                        value={props.fromDate}
                        onChange={v => props.setFromDate(v)}
                        renderInput={v => <MyDatePickerTextField {...v} label="From" />}
                    />
                </div>
                <div className="w-full">
                    <DatePicker
                        value={props.toDate}
                        onChange={v => props.setToDate(v)}
                        renderInput={v => <MyDatePickerTextField {...v} label="To" />}
                    />
                </div>
            </div>
        </Paper>
    );
}
