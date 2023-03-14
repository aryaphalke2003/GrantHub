import { PushPin, PushPinOutlined } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import axios from "axios";
import { useCookies } from "react-cookie";

// Utility button that toggles a pin
export default function PinButton({
    pinned,
    endpoint,
    callback,
}: {
    pinned: boolean;
    endpoint: string;
    callback: () => void;
}) {
    const [cookies, _, __] = useCookies(["auth_jwt"]);

    return (
        <IconButton
            sx={{ color: pinned ? "error.light" : "primary.light" }}
            onClick={() =>
                axios
                    .post(endpoint, {}, { params: { auth: cookies.auth_jwt } })
                    .then(r => callback())
            }
        >
            {pinned && <PushPin />}
            {!pinned && <PushPinOutlined />}
        </IconButton>
    );
}
