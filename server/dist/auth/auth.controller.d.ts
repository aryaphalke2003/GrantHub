import { AuthService } from "./auth.service";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    googleAuth(google_token: string): Promise<{
        token: string;
        raw: import("../interfaces/authtoken.interface").default;
    }>;
}
