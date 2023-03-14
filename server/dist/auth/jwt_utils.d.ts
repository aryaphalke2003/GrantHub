import AuthToken from "src/interfaces/authtoken.interface";
export declare class JwtUtils {
    static generate_token(data: any): string;
    static decode_token(token: string): string | import("jsonwebtoken").JwtPayload;
    static validate_auth_token(token: string): AuthToken;
}
