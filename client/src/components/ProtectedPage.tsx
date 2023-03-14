import { useCookies } from "react-cookie";
import { Navigate } from "react-router-dom";

// Navigate back to login page on some pages
export default function ProtectedPage() {
    const [cookies] = useCookies(["auth_jwt"]);

    return <>{!cookies.auth_jwt && <Navigate to="/login"/>}</>;
}
