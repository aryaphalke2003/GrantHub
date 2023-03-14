import { DatabaseService } from "src/database/database.service";
export declare class AuthService {
    private databaseService;
    private readonly client;
    constructor(databaseService: DatabaseService);
    private validate_google_token;
    sign_in_google(google_token: string): Promise<{
        token: string;
        raw: import("../interfaces/authtoken.interface").default;
    }>;
}
