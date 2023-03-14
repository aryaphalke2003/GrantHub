import {
    AddBox,
    AddCard,
    ChevronLeft,
    FormatListBulleted,
    Logout,
    Menu,
    PendingActions,
    PeopleAlt,
    PeopleAltRounded
} from "@mui/icons-material";
import {
    AppBar,
    Divider,
    Drawer,
    IconButton,
    List,
    Toolbar,
    Typography
} from "@mui/material";
import { ReactNode, useCallback, useState } from "react";
import { useCookies } from "react-cookie";
import SidebarRedirectItem from "./SidebarRedirectItem";

// Container for all pages, adds sidebar and appbar
export default function PageContainer(props: {
    pageName: string;
    children: ReactNode;
    extras?: ReactNode;
}) {
    const { pageName, children, extras } = props;

    const [open, setOpen] = useState(false);
    const [cookies, __, removeCookie] = useCookies([
        "auth_jwt",
        "user_email",
        "user_type",
        "user_name",
    ]);

    // logout callback
    const logout = useCallback(() => {
        removeCookie("auth_jwt");
        removeCookie("user_email");
        removeCookie("user_type");
        removeCookie("user_name");
    }, [cookies]);

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                overflowY: "scroll",
            }}
        >
            <AppBar position="sticky">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        onClick={() => setOpen(true)}
                    >
                        <Menu />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {pageName}
                    </Typography>
                    <Typography variant="body1">{`${
                        cookies.user_type === "admin" ? "Admin" : "Faculty"
                    }: ${cookies.user_name} (${cookies.user_email})`}</Typography>
                    <IconButton size="large" color="inherit" onClick={logout}>
                        <Logout />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
                <div style={{ width: "250px" }}>
                    <Toolbar
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            px: [1],
                        }}
                    >
                        <IconButton onClick={() => setOpen(false)}>
                            <ChevronLeft />
                        </IconButton>
                    </Toolbar>
                    <Divider />
                    <List component="nav">
                        <SidebarRedirectItem
                            link="/grants"
                            text="All Grants"
                            icon={<FormatListBulleted />}
                        />
                        <SidebarRedirectItem
                            link="/fellows"
                            text="All Fellows"
                            icon={<PeopleAlt />}
                        />
                        {cookies.user_type === "admin" && (
                            <SidebarRedirectItem
                                link="/users"
                                text="Users"
                                icon={<PeopleAltRounded />}
                            />
                        )}
                        <Divider />
                        <SidebarRedirectItem
                            link="/new/project"
                            text="New Grant"
                            icon={<AddBox />}
                        />
                        <Divider />
                        <SidebarRedirectItem
                            link="/pending/projects"
                            text="Pending Projects"
                            icon={<PendingActions />}
                        />
                        <SidebarRedirectItem
                            link="/pending/expenses"
                            text="Pending Expenses"
                            icon={<AddCard />}
                        />
                        <Divider />
                        {extras}
                    </List>
                </div>
            </Drawer>
            <div
                style={{
                    flexGrow: 1,
                    width: "calc(100% - 20px)",
                    padding: "10px",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {children}
            </div>
        </div>
    );
}
