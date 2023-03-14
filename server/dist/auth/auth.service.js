"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const google_auth_library_1 = require("google-auth-library");
const database_service_1 = require("../database/database.service");
const jwt_utils_1 = require("./jwt_utils");
let AuthService = class AuthService {
    constructor(databaseService) {
        this.databaseService = databaseService;
        this.client = new google_auth_library_1.OAuth2Client("796487248317-ne5g8qu5cf1t07a3lj4p5fd2qpg026c4.apps.googleusercontent.com");
    }
    async validate_google_token(token) {
        const ticket = await this.client.verifyIdToken({
            idToken: token,
            audience: "796487248317-ne5g8qu5cf1t07a3lj4p5fd2qpg026c4.apps.googleusercontent.com",
        });
        const { email } = ticket.getPayload();
        return this.databaseService.verify_email(email);
    }
    async sign_in_google(google_token) {
        const token_data = await this.validate_google_token(google_token);
        return { token: jwt_utils_1.JwtUtils.generate_token(token_data), raw: token_data };
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map