"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtUtils = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
class JwtUtils {
    static generate_token(data) {
        return (0, jsonwebtoken_1.sign)(data, "qwertyuiopasdfghjklzxcvbnm");
    }
    static decode_token(token) {
        return (0, jsonwebtoken_1.verify)(token, "qwertyuiopasdfghjklzxcvbnm");
    }
    static validate_auth_token(token) {
        const data = JwtUtils.decode_token(token);
        if (typeof data !== "string" &&
            "email" in data &&
            "type" in data &&
            "name" in data)
            return { email: data.email, type: data.type, name: data.name };
        else
            return null;
    }
}
exports.JwtUtils = JwtUtils;
//# sourceMappingURL=jwt_utils.js.map