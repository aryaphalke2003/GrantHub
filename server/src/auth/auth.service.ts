import { Injectable } from "@nestjs/common";
import { OAuth2Client } from "google-auth-library";
import { DatabaseService } from "src/database/database.service";
import { JwtUtils } from "./jwt_utils";

@Injectable()
export class AuthService {
    private readonly client: OAuth2Client;

    constructor(private databaseService: DatabaseService) {
        this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    }

    private async validate_google_token(token: string) {
        const ticket = await this.client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { email } = ticket.getPayload();

        return this.databaseService.verify_email(email);
    }

    async sign_in_google(google_token: string) {
        const token_data = await this.validate_google_token(google_token);
        return {token: JwtUtils.generate_token(token_data), raw: token_data};
    }
}
