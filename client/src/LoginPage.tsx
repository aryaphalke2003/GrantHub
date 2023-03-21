import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import axios from "axios";
import * as React from "react";
import { useCookies } from "react-cookie";
import GoogleLogin from "react-google-login";
import { useNavigate } from "react-router-dom";
import { gapi } from 'gapi-script'

const logo = require("./resources/iit.jpg");
const iitl = require("./resources/iitlogo.png");
const theme = createTheme();

export default function LoginPageTemp() {
    const [cookies, setCookie, removeCookies] = useCookies([
        "auth_jwt",
        "user_email",
        "user_type",
        "user_name",
    ]);
    const navigate = useNavigate();

    React.useEffect(() => {
        gapi.load("client:auth2", () => {
            gapi.auth2.init({ clientId: "796487248317-ne5g8qu5cf1t07a3lj4p5fd2qpg026c4.apps.googleusercontent.com" })
        }, [])
    })

    // login success callback
    const loginSuccess = async gdata => {
        //{gdata.tokenId}
        // console.log(gdata);

        // console.log(gdata);

        const jwt = await axios.get(`authorize/${gdata.tokenId}`);
        //   const jwt = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${gdata.tokenId}`);
        //  console.log(jwt);

        //   console.log(jwt.data);
        setCookie("auth_jwt", jwt.data.token);
        setCookie("user_email", jwt.data.raw.email);
        setCookie("user_type", jwt.data.raw.type);
        setCookie("user_name", jwt.data.raw.name);
        navigate("/grants");
    };

    // login failure callback
    const onFailure = gdata => {
        console.error(gdata);
    };

    return (
        <ThemeProvider theme={theme}>
            <Grid container component="main" sx={{ height: "100vh" }}>
                <CssBaseline />
                <Grid
                    spacing={{ xs: 2, md: 3 }}
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: `url(${logo})`,
                        backgroundRepeat: "no-repeat",
                        backgroundColor: t =>
                            t.palette.mode === "light"
                                ? t.palette.grey[50]
                                : t.palette.grey[900],
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                />

                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>

                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "75px" }}>
                        <img src={iitl} alt="iitl" style={{ maxWidth: "30%" }} />
                    </Box>
                    <Box
                        sx={{
                            my: 4,
                            mx: 4,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <Typography
                            component="h1"
                            variant="h4"
                            fontFamily={["Roboto", "sans-serif"].join(",")}
                            alignItems="center"
                            justifyContent="center"
                            sx={{
                                my: 6,
                                mx: 4,
                                display: "flex",
                                flexDirection: "column",
                                textAlign: "center",
                                color: "#13005A",
                                fontWeight: "bold"

                            }}
                        >
                            Research and Development Grants Management Portal
                        </Typography>
                        <CssBaseline />
                        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                            <LockOutlinedIcon />
                        </Avatar>

                        <Box
                            component="form"
                            noValidate
                            sx={{ mt: 1, alignItems: "center" }}
                        >
                            <GoogleLogin
                                clientId="796487248317-ne5g8qu5cf1t07a3lj4p5fd2qpg026c4.apps.googleusercontent.com"
                                buttonText="Sign in with Google"
                                onSuccess={loginSuccess}
                                onFailure={onFailure}
                                cookiePolicy={"single_host_origin"}
                            />
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}
