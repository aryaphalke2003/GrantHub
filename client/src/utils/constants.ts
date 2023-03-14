// head types for select
export const head_types = [
    {
        value: "equipment",
        label: "Equipment",
    },
    {
        value: "consumable",
        label: "Consumable",
    },
    {
        value: "contingency",
        label: "Contingency",
    },
    {
        value: "manpower",
        label: "Manpower",
    },
    {
        value: "overhead",
        label: "Overhead",
    },
    {
        value: "consultancy_amount",
        label: "Consultancy Amount",
    },
    {
        value: "others",
        label: "Others",
    },
    {
        value: "travel",
        label: "Travel",
    },
];

// regex for matching a floating point number
export const NUMBER_RE = /^[+\-]?(([0-9]+(\.[0-9]*)?)|([0-9]*\.[0-9]+))(e[0-9]+)?$/;

// User types for select
export const userType_options = [
    {
        value: "admin",
        label: "Admin",
    },
    {
        value: "faculty",
        label: "Faculty",
    },
];

export const dept_options = [
    {
        value: "cse",
        label: "CSE",
    },
    {
        value: "mnc",
        label: "MNC",
    },
    {
        value: "ece",
        label: "ECE",
    },
    {
        value: "mec",
        label: "MEC",
    },
    {
        value: "che",
        label: "CHE",
    },
    {
        value: "civ",
        label: "CIV",
    },
    {
        value: "null",
        label: "NA",
    },
];

// Project types for select
export const ProjectType = [
    {
        value: "sponsored project",
        label: "Sponsored Project",
    },
    {
        value: "consulting",
        label: "Consulting",
    },
];

// data grid style attributes
export const datagrid_style = {
    className: "bg-gray-50 shadow-md rounded-lg",
    getRowClassName: () => "border-b border-t bg-white hover:bg-gray-50",
    getCellClassName: () => "font-sans",
};

// data grid column header class name
export const headerClassName = "text-xs text-gray-700 uppercase font-medium";
