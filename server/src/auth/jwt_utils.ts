import { sign, verify } from "jsonwebtoken";
import AuthToken from "src/interfaces/authtoken.interface";

export class JwtUtils {
    static generate_token(data: any) {
        return sign(data, "qwertyuiopasdfghjklzxcvbnm");
    }

    static decode_token(token: string) {
        return verify(token, "qwertyuiopasdfghjklzxcvbnm");
    }

    static validate_auth_token(token: string): AuthToken {
        const data = JwtUtils.decode_token(token);
        if (
            typeof data !== "string" &&
            "email" in data &&
            "type" in data &&
            "name" in data
        )
            return { email: data.email, type: data.type, name: data.name };
        else return null;
    }
}
