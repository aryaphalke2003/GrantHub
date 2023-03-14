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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const jwt_utils_1 = require("../auth/jwt_utils");
const database_service_1 = require("./database.service");
let DatabaseController = class DatabaseController {
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async all_grants(jwt) {
        const auth = jwt_utils_1.JwtUtils.validate_auth_token(jwt);
        return this.databaseService.view_grants(auth);
    }
    async grant_details(jwt, project_id) {
        const auth = jwt_utils_1.JwtUtils.validate_auth_token(jwt);
        return this.databaseService.project_details(auth, project_id);
    }
    async all_fellows(jwt) {
        const auth = jwt_utils_1.JwtUtils.validate_auth_token(jwt);
        return this.databaseService.view_fellows(auth, null);
    }
    async project_fellows(jwt, project_id) {
        const auth = jwt_utils_1.JwtUtils.validate_auth_token(jwt);
        return this.databaseService.view_fellows(auth, project_id);
    }
    async project_expenses(jwt, project_id) {
        const auth = jwt_utils_1.JwtUtils.validate_auth_token(jwt);
        const ids = JSON.parse(project_id);
        return this.databaseService.view_grant_expenses(auth, ids);
    }
    async project_budget(jwt, project_id) {
        const auth = jwt_utils_1.JwtUtils.validate_auth_token(jwt);
        return this.databaseService.view_grant_budget(auth, project_id);
    }
    async project_remaining(jwt, project_id, actual, committed) {
        const auth = jwt_utils_1.JwtUtils.validate_auth_token(jwt);
        return this.databaseService.view_grant_remaining(auth, project_id, actual, committed);
    }
    async all_accounts(jwt) {
        const auth = jwt_utils_1.JwtUtils.validate_auth_token(jwt);
        return this.databaseService.view_all_accounts(auth);
    }
    async project_access(jwt, project_id) {
        const auth = jwt_utils_1.JwtUtils.validate_auth_token(jwt);
        return this.databaseService.view_grant_access(auth, project_id);
    }
    async user_data(jwt) {
        const auth = jwt_utils_1.JwtUtils.validate_auth_token(jwt);
        return this.databaseService.user_details(auth);
    }
    async active_faculty(jwt) {
        const auth = jwt_utils_1.JwtUtils.validate_auth_token(jwt);
        return this.databaseService.view_active_faculty(auth);
    }
    async project_sanction(jwt, project_id) {
        const auth = jwt_utils_1.JwtUtils.validate_auth_token(jwt);
        return this.databaseService.get_project_sanction(auth, project_id);
    }
    async pending_projects(jwt) {
        const auth = jwt_utils_1.JwtUtils.validate_auth_token(jwt);
        return this.databaseService.view_pending_projects(auth);
    }
    async pending_expenses(jwt) {
        const auth = jwt_utils_1.JwtUtils.validate_auth_token(jwt);
        return this.databaseService.view_pending_expenses(auth);
    }
    async get_notifications(jwt) {
        const auth = jwt_utils_1.JwtUtils.validate_auth_token(jwt);
        return this.databaseService.get_notifications(auth);
    }
    async toggle_pin(jwt, project_id) {
        const auth = jwt_utils_1.JwtUtils.validate_auth_token(jwt);
        return this.databaseService.pin_project(auth, project_id);
    }
    async add_account(jwt, account) {
        const auth = jwt_utils_1.JwtUtils.validate_auth_token(jwt);
        return this.databaseService.add_account(auth, account);
    }
    async add_project(jwt, project) {
        const auth = jwt_utils_1.JwtUtils.validate_auth_token(jwt);
        return this.databaseService.add_project(auth, project);
    }
    async add_project_excel(jwt, body, file) {
        const auth = jwt_utils_1.JwtUtils.validate_auth_token(jwt);
        return this.databaseService.add_project_excel(auth, body, file);
    }
    async add_expense(jwt, expense) {
        const auth = jwt_utils_1.JwtUtils.validate_auth_token(jwt);
        return this.databaseService.add_expense(auth, expense);
    }
    async add_access(jwt, email, project_id) {
        const auth = jwt_utils_1.JwtUtils.validate_auth_token(jwt);
        return this.databaseService.add_access(auth, email, project_id);
    }
    async add_installment(jwt, project_id, installment) {
        const auth = jwt_utils_1.JwtUtils.validate_auth_token(jwt);
        return this.databaseService.add_installment(auth, project_id, installment);
    }
    async add_fellow(jwt, project_id, fellow) {
        const auth = jwt_utils_1.JwtUtils.validate_auth_token(jwt);
        return this.databaseService.add_fellow(auth, project_id, fellow);
    }
    async alter_expense(jwt, expense, expense_id) {
        const auth = jwt_utils_1.JwtUtils.validate_auth_token(jwt);
        return this.databaseService.alter_expense(auth, expense_id, expense);
    }
    async alter_installment(jwt, expense_id, split) {
        const auth = jwt_utils_1.JwtUtils.validate_auth_token(jwt);
        return this.databaseService.alter_installment(auth, expense_id, split);
    }
    async alter_sanction(jwt, project_id, head, amount) {
        const auth = jwt_utils_1.JwtUtils.validate_auth_token(jwt);
        return this.databaseService.alter_sanction(auth, project_id, head, amount);
    }
    async alter_project(jwt, project, project_id) {
        const auth = jwt_utils_1.JwtUtils.validate_auth_token(jwt);
        return this.databaseService.alter_project(auth, project_id, project);
    }
    async alter_account(jwt, account, email) {
        const auth = jwt_utils_1.JwtUtils.validate_auth_token(jwt);
        return this.databaseService.alter_account(auth, email, account);
    }
    async alter_access(jwt, email, role, project_id) {
        const auth = jwt_utils_1.JwtUtils.validate_auth_token(jwt);
        return this.databaseService.alter_access(auth, email, project_id, role);
    }
    async alter_fellow(jwt, fellow, fellow_id) {
        const auth = jwt_utils_1.JwtUtils.validate_auth_token(jwt);
        return this.databaseService.alter_fellow(auth, fellow, fellow_id);
    }
    async alter_pending_project(jwt, accepted, pending_id) {
        const auth = jwt_utils_1.JwtUtils.validate_auth_token(jwt);
        return this.databaseService.alter_pending_project(auth, pending_id, accepted);
    }
    async alter_pending_expense(jwt, accepted, pending_id) {
        const auth = jwt_utils_1.JwtUtils.validate_auth_token(jwt);
        return this.databaseService.alter_pending_expense(auth, pending_id, accepted);
    }
    async delete_grants(jwt, ids) {
        const auth = jwt_utils_1.JwtUtils.validate_auth_token(jwt);
        return this.databaseService.delete_grants(auth, ids);
    }
    async delete_expenses(jwt, ids) {
        const auth = jwt_utils_1.JwtUtils.validate_auth_token(jwt);
        return this.databaseService.delete_expenses(auth, ids);
    }
    async delete_access(jwt, emails, project_id) {
        const auth = jwt_utils_1.JwtUtils.validate_auth_token(jwt);
        return this.databaseService.delete_access(auth, emails, project_id);
    }
    async delete_users(jwt, emails) {
        const auth = jwt_utils_1.JwtUtils.validate_auth_token(jwt);
        return this.databaseService.delete_users(auth, emails);
    }
    async delete_fellows(jwt, fellow_ids) {
        const auth = jwt_utils_1.JwtUtils.validate_auth_token(jwt);
        return this.databaseService.delete_fellows(auth, fellow_ids);
    }
};
__decorate([
    (0, common_1.Get)("grants"),
    __param(0, (0, common_1.Query)("auth")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DatabaseController.prototype, "all_grants", null);
__decorate([
    (0, common_1.Get)("grants/:id"),
    __param(0, (0, common_1.Query)("auth")),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], DatabaseController.prototype, "grant_details", null);
__decorate([
    (0, common_1.Get)("fellows"),
    __param(0, (0, common_1.Query)("auth")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DatabaseController.prototype, "all_fellows", null);
__decorate([
    (0, common_1.Get)("fellows/:id"),
    __param(0, (0, common_1.Query)("auth")),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], DatabaseController.prototype, "project_fellows", null);
__decorate([
    (0, common_1.Get)("expenses/:id"),
    __param(0, (0, common_1.Query)("auth")),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], DatabaseController.prototype, "project_expenses", null);
__decorate([
    (0, common_1.Get)("budget/:id"),
    __param(0, (0, common_1.Query)("auth")),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], DatabaseController.prototype, "project_budget", null);
__decorate([
    (0, common_1.Get)("budget/remaining/:id"),
    __param(0, (0, common_1.Query)("auth")),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Query)("actual")),
    __param(3, (0, common_1.Query)("committed")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Boolean, Boolean]),
    __metadata("design:returntype", Promise)
], DatabaseController.prototype, "project_remaining", null);
__decorate([
    (0, common_1.Get)("accounts"),
    __param(0, (0, common_1.Query)("auth")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DatabaseController.prototype, "all_accounts", null);
__decorate([
    (0, common_1.Get)("access/:id"),
    __param(0, (0, common_1.Query)("auth")),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], DatabaseController.prototype, "project_access", null);
__decorate([
    (0, common_1.Get)("user"),
    __param(0, (0, common_1.Query)("auth")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DatabaseController.prototype, "user_data", null);
__decorate([
    (0, common_1.Get)("faculty"),
    __param(0, (0, common_1.Query)("auth")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DatabaseController.prototype, "active_faculty", null);
__decorate([
    (0, common_1.Get)("sanction/:id"),
    __param(0, (0, common_1.Query)("auth")),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], DatabaseController.prototype, "project_sanction", null);
__decorate([
    (0, common_1.Get)("pending/projects"),
    __param(0, (0, common_1.Query)("auth")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DatabaseController.prototype, "pending_projects", null);
__decorate([
    (0, common_1.Get)("pending/expenses"),
    __param(0, (0, common_1.Query)("auth")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DatabaseController.prototype, "pending_expenses", null);
__decorate([
    (0, common_1.Get)("notifs"),
    __param(0, (0, common_1.Query)("auth")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DatabaseController.prototype, "get_notifications", null);
__decorate([
    (0, common_1.Post)("togglepin/:id"),
    __param(0, (0, common_1.Query)("auth")),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], DatabaseController.prototype, "toggle_pin", null);
__decorate([
    (0, common_1.Post)("add/account"),
    __param(0, (0, common_1.Query)("auth")),
    __param(1, (0, common_1.Body)("account")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DatabaseController.prototype, "add_account", null);
__decorate([
    (0, common_1.Post)("add/project"),
    __param(0, (0, common_1.Query)("auth")),
    __param(1, (0, common_1.Body)("project")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DatabaseController.prototype, "add_project", null);
__decorate([
    (0, common_1.Post)("add/project/excel"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file")),
    __param(0, (0, common_1.Query)("auth")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], DatabaseController.prototype, "add_project_excel", null);
__decorate([
    (0, common_1.Post)("add/expense"),
    __param(0, (0, common_1.Query)("auth")),
    __param(1, (0, common_1.Body)("expense")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], DatabaseController.prototype, "add_expense", null);
__decorate([
    (0, common_1.Post)("add/access/:id"),
    __param(0, (0, common_1.Query)("auth")),
    __param(1, (0, common_1.Body)("email")),
    __param(2, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], DatabaseController.prototype, "add_access", null);
__decorate([
    (0, common_1.Post)("add/installment/:id"),
    __param(0, (0, common_1.Query)("auth")),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)("installment")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object]),
    __metadata("design:returntype", Promise)
], DatabaseController.prototype, "add_installment", null);
__decorate([
    (0, common_1.Post)("add/fellow/:id"),
    __param(0, (0, common_1.Query)("auth")),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)("fellow")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object]),
    __metadata("design:returntype", Promise)
], DatabaseController.prototype, "add_fellow", null);
__decorate([
    (0, common_1.Post)("update/expense"),
    __param(0, (0, common_1.Query)("auth")),
    __param(1, (0, common_1.Body)("expense")),
    __param(2, (0, common_1.Body)("expense_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Number]),
    __metadata("design:returntype", Promise)
], DatabaseController.prototype, "alter_expense", null);
__decorate([
    (0, common_1.Post)("update/budget"),
    __param(0, (0, common_1.Query)("auth")),
    __param(1, (0, common_1.Body)("expense_id")),
    __param(2, (0, common_1.Body)("split")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object]),
    __metadata("design:returntype", Promise)
], DatabaseController.prototype, "alter_installment", null);
__decorate([
    (0, common_1.Post)("update/sanction/:id"),
    __param(0, (0, common_1.Query)("auth")),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)("head")),
    __param(3, (0, common_1.Body)("amount")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String, Number]),
    __metadata("design:returntype", Promise)
], DatabaseController.prototype, "alter_sanction", null);
__decorate([
    (0, common_1.Post)("update/project/:id"),
    __param(0, (0, common_1.Query)("auth")),
    __param(1, (0, common_1.Body)("project")),
    __param(2, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Number]),
    __metadata("design:returntype", Promise)
], DatabaseController.prototype, "alter_project", null);
__decorate([
    (0, common_1.Post)("update/account"),
    __param(0, (0, common_1.Query)("auth")),
    __param(1, (0, common_1.Body)("account")),
    __param(2, (0, common_1.Body)("email")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], DatabaseController.prototype, "alter_account", null);
__decorate([
    (0, common_1.Post)("update/access/:id"),
    __param(0, (0, common_1.Query)("auth")),
    __param(1, (0, common_1.Body)("email")),
    __param(2, (0, common_1.Body)("role")),
    __param(3, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Number]),
    __metadata("design:returntype", Promise)
], DatabaseController.prototype, "alter_access", null);
__decorate([
    (0, common_1.Post)("update/fellow/:id"),
    __param(0, (0, common_1.Query)("auth")),
    __param(1, (0, common_1.Body)("fellow")),
    __param(2, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Number]),
    __metadata("design:returntype", Promise)
], DatabaseController.prototype, "alter_fellow", null);
__decorate([
    (0, common_1.Post)("update/pending/project/:id"),
    __param(0, (0, common_1.Query)("auth")),
    __param(1, (0, common_1.Body)("accepted")),
    __param(2, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean, Number]),
    __metadata("design:returntype", Promise)
], DatabaseController.prototype, "alter_pending_project", null);
__decorate([
    (0, common_1.Post)("update/pending/expense/:id"),
    __param(0, (0, common_1.Query)("auth")),
    __param(1, (0, common_1.Body)("accepted")),
    __param(2, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean, Number]),
    __metadata("design:returntype", Promise)
], DatabaseController.prototype, "alter_pending_expense", null);
__decorate([
    (0, common_1.Delete)("grants"),
    __param(0, (0, common_1.Query)("auth")),
    __param(1, (0, common_1.Body)("ids")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], DatabaseController.prototype, "delete_grants", null);
__decorate([
    (0, common_1.Delete)("expenses"),
    __param(0, (0, common_1.Query)("auth")),
    __param(1, (0, common_1.Body)("ids")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], DatabaseController.prototype, "delete_expenses", null);
__decorate([
    (0, common_1.Delete)("access/:id"),
    __param(0, (0, common_1.Query)("auth")),
    __param(1, (0, common_1.Body)("emails")),
    __param(2, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, Number]),
    __metadata("design:returntype", Promise)
], DatabaseController.prototype, "delete_access", null);
__decorate([
    (0, common_1.Delete)("users"),
    __param(0, (0, common_1.Query)("auth")),
    __param(1, (0, common_1.Body)("emails")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], DatabaseController.prototype, "delete_users", null);
__decorate([
    (0, common_1.Delete)("fellows"),
    __param(0, (0, common_1.Query)("auth")),
    __param(1, (0, common_1.Body)("fellow_ids")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], DatabaseController.prototype, "delete_fellows", null);
DatabaseController = __decorate([
    (0, common_1.Controller)("api"),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], DatabaseController);
exports.DatabaseController = DatabaseController;
//# sourceMappingURL=database.controller.js.map