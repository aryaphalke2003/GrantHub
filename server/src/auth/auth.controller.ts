import { Controller, Get, Param } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get("authorize/:google_token")
    async googleAuth(@Param('google_token') google_token: string) {
        console.log("GAUTH");
        return this.authService.sign_in_google(google_token);
    }
}
