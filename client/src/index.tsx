import { LocalizationProvider } from "@mui/lab";
import DateAdapter from "@mui/lab/AdapterMoment";
import { createTheme, StyledEngineProvider } from "@mui/material";
import { ThemeProvider } from "@mui/system";
import { render } from "react-dom";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import FormPage from "./components/FormPage";
import ProjectForm from "./components/ProjectForm";
import FellowsPage from "./FellowsPage";
import GrantsPage from "./GrantsPage";
import LoginPage from "./LoginPage";
import PendingExpensesPage from "./PendingExpensesPage";
import PendingProjectsPage from "./PendingProjectsPage";
import ProjectPage from "./ProjectPage";
import UsersPage from "./UsersPage";

// theme fonts
const theme = createTheme({
    typography: {
        fontFamily: [
            "ui-sans-serif",
            "system-ui",
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
            "Roboto",
            '"Helvetica Neue"',
            "Arial",
            '"Noto Sans"',
            "sans-serif",
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
            '"Noto Color Emoji"',
        ].join(","),
    },
});

function App() {
    // client side routing
    return (
        <Routes>
            <Route path="/">
                <Route index element={<Navigate to="login" />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="grants" element={<GrantsPage />} />
                <Route path="project" element={<ProjectPage />} />
                <Route path="fellows" element={<FellowsPage />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="pending">
                    <Route path="projects" element={<PendingProjectsPage />} />
                    <Route path="expenses" element={<PendingExpensesPage />} />
                </Route>
                <Route
                    path="new/project"
                    element={
                        <FormPage pageName="New Grant">
                            <ProjectForm />
                        </FormPage>
                    }
                />
                <Route path="*" element={<Navigate to="grants" />} />
            </Route>
        </Routes>
    );
}

render(
    <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={DateAdapter}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </LocalizationProvider>
        </ThemeProvider>
    </StyledEngineProvider>,
    document.getElementById("root")
);
