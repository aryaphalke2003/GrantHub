import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { ReactNode } from "react";
import { Link } from "react-router-dom";

// Used in page container sidebar
export default function SidebarRedirectItem(props: {
    link: string;
    text: string;
    icon: ReactNode;
}) {
    return (
        <Link to={props.link} style={{ textDecoration: "none", color: "black" }}>
            <ListItemButton>
                <ListItemIcon>{props.icon}</ListItemIcon>
                <ListItemText primary={props.text} />
            </ListItemButton>
        </Link>
    );
}
