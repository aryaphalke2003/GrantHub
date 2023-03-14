import { GridValueFormatterParams } from "@mui/x-data-grid";
import { NUMBER_RE } from "./constants";

// round off number and display with currency
export function moneyFormatter(params: GridValueFormatterParams) {
    return `₹${(params.value as number).toFixed(2)}`;
}

// parse date
export function dateParser(raw: string) {
    return new Date(raw);
}

// parse number
export function numberParser(raw: string) {
    return Number.parseFloat(raw);
}

// parse table
export function tableParser(rows: any[]) {
    return rows.map(row => {
        let result = { ...row };
        Object.keys(row).map(k => {
            // if column name has date, parse date
            if (k.includes("date")) result[k] = row[k] ? dateParser(row[k]) : "-";
            // if matches number RE, parse number
            else if (NUMBER_RE.test(row[k])) result[k] = numberParser(row[k]);
        });
        return result;
    });
}
