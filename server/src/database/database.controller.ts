import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Query,
    UploadedFile,
    UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtUtils } from "src/auth/jwt_utils";
import Account from "src/interfaces/account.interface";
import ExcelProjectParams from "src/interfaces/excel_project_params.interface";
import Expense from "src/interfaces/expense.interface";
import Fellow from "src/interfaces/fellow.interface";
import Installment from "src/interfaces/installment.interface";
import Project from "src/interfaces/project.interface";
import { DatabaseService } from "./database.service";

@Controller("api")
export class DatabaseController {
    constructor(private readonly databaseService: DatabaseService) {}

    // get all grants
    @Get("grants")
    async all_grants(@Query("auth") jwt: string) {
        const auth = JwtUtils.validate_auth_token(jwt);
        return this.databaseService.view_grants(auth);
    }

    // get details of grant with given ID
    @Get("grants/:id")
    async grant_details(@Query("auth") jwt: string, @Param("id") project_id: number) {
        const auth = JwtUtils.validate_auth_token(jwt);
        return this.databaseService.project_details(auth, project_id);
    }

    // get all fellows
    @Get("fellows")
    async all_fellows(@Query("auth") jwt: string) {
        const auth = JwtUtils.validate_auth_token(jwt);
        return this.databaseService.view_fellows(auth, null);
    }

    // get fellows for specific project
    @Get("fellows/:id")
    async project_fellows(@Query("auth") jwt: string, @Param("id") project_id: number) {
        const auth = JwtUtils.validate_auth_token(jwt);
        return this.databaseService.view_fellows(auth, project_id);
    }

    // get expenses of specific project
    @Get("expenses/:id")
    async project_expenses(@Query("auth") jwt: string, @Param("id") project_id: string) {
        const auth = JwtUtils.validate_auth_token(jwt);
        const ids = JSON.parse(project_id);
        return this.databaseService.view_grant_expenses(auth, ids);
    }

    // get budget of specific project
    @Get("budget/:id")
    async project_budget(@Query("auth") jwt: string, @Param("id") project_id: number) {
        const auth = JwtUtils.validate_auth_token(jwt);
        return this.databaseService.view_grant_budget(auth, project_id);
    }

    // get remaining budget of a specific project
    @Get("budget/remaining/:id")
    async project_remaining(
        @Query("auth") jwt: string,
        @Param("id") project_id: number,
        @Query("actual") actual: boolean,
        @Query("committed") committed: boolean
    ) {
        const auth = JwtUtils.validate_auth_token(jwt);
        return this.databaseService.view_grant_remaining(
            auth,
            project_id,
            actual,
            committed
        );
    }

    // get all accounts
    @Get("accounts")
    async all_accounts(@Query("auth") jwt: string) {
        const auth = JwtUtils.validate_auth_token(jwt);
        return this.databaseService.view_all_accounts(auth);
    }

    // get access information for specific project
    @Get("access/:id")
    async project_access(@Query("auth") jwt: string, @Param("id") project_id: number) {
        const auth = JwtUtils.validate_auth_token(jwt);
        return this.databaseService.view_grant_access(auth, project_id);
    }

    // get details for currently logged-in user
    @Get("user")
    async user_data(@Query("auth") jwt: string) {
        const auth = JwtUtils.validate_auth_token(jwt);
        return this.databaseService.user_details(auth);
    }

    // get all faculty
    @Get("faculty")
    async active_faculty(@Query("auth") jwt: string) {
        const auth = JwtUtils.validate_auth_token(jwt);
        return this.databaseService.view_active_faculty(auth);
    }

    // get sanctioned amounds for a specific project
    @Get("sanction/:id")
    async project_sanction(@Query("auth") jwt: string, @Param("id") project_id: number) {
        const auth = JwtUtils.validate_auth_token(jwt);
        return this.databaseService.get_project_sanction(auth, project_id);
    }

    // get pending projects
    @Get("pending/projects")
    async pending_projects(@Query("auth") jwt: string) {
        const auth = JwtUtils.validate_auth_token(jwt);
        return this.databaseService.view_pending_projects(auth);
    }

    // get pending expenses
    @Get("pending/expenses")
    async pending_expenses(@Query("auth") jwt: string) {
        const auth = JwtUtils.validate_auth_token(jwt);
        return this.databaseService.view_pending_expenses(auth);
    }

    // get notifications for current user
    @Get("notifs")
    async get_notifications(@Query("auth") jwt: string) {
        const auth = JwtUtils.validate_auth_token(jwt);
        return this.databaseService.get_notifications(auth);
    }

    // toggle pin on specific project for given user
    @Post("togglepin/:id")
    async toggle_pin(@Query("auth") jwt: string, @Param("id") project_id: number) {
        const auth = JwtUtils.validate_auth_token(jwt);
        return this.databaseService.pin_project(auth, project_id);
    }

    // add new account
    @Post("add/account")
    async add_account(@Query("auth") jwt: string, @Body("account") account: Account) {
        const auth = JwtUtils.validate_auth_token(jwt);
        return this.databaseService.add_account(auth, account);
    }

    // add new project
    @Post("add/project")
    async add_project(@Query("auth") jwt: string, @Body("project") project: Project) {
        const auth = JwtUtils.validate_auth_token(jwt);
        return this.databaseService.add_project(auth, project);
    }

    // add new project from excel sheet
    @Post("add/project/excel")
    @UseInterceptors(FileInterceptor("file"))
    async add_project_excel(
        @Query("auth") jwt: string,
        @Body() body: ExcelProjectParams,
        @UploadedFile() file: Express.Multer.File
    ) {
        const auth = JwtUtils.validate_auth_token(jwt);
        return this.databaseService.add_project_excel(auth, body, file);
    }

    // add new expense
    @Post("add/expense")
    async add_expense(@Query("auth") jwt: string, @Body("expense") expense: Expense) {
        const auth = JwtUtils.validate_auth_token(jwt);
        return this.databaseService.add_expense(auth, expense);
    }

    // grant specific faculty access to specific project
    @Post("add/access/:id")
    async add_access(
        @Query("auth") jwt: string,
        @Body("email") email: string,
        @Param("id") project_id: number
    ) {
        const auth = JwtUtils.validate_auth_token(jwt);
        return this.databaseService.add_access(auth, email, project_id);
    }

    // add new installment/receipt for specific project
    @Post("add/installment/:id")
    async add_installment(
        @Query("auth") jwt: string,
        @Param("id") project_id: number,
        @Body("installment") installment: Installment
    ) {
        const auth = JwtUtils.validate_auth_token(jwt);
        return this.databaseService.add_installment(auth, project_id, installment);
    }

    // add new fellow for specific project
    @Post("add/fellow/:id")
    async add_fellow(
        @Query("auth") jwt: string,
        @Param("id") project_id: number,
        @Body("fellow") fellow: Fellow
    ) {
        const auth = JwtUtils.validate_auth_token(jwt);
        return this.databaseService.add_fellow(auth, project_id, fellow);
    }

    // update details for specific expense
    @Post("update/expense")
    async alter_expense(
        @Query("auth") jwt: string,
        @Body("expense") expense: Expense,
        @Body("expense_id") expense_id: number
    ) {
        const auth = JwtUtils.validate_auth_token(jwt);
        return this.databaseService.alter_expense(auth, expense_id, expense);
    }

    // update budget details for specific project
    @Post("update/budget")
    async alter_installment(
        @Query("auth") jwt: string,
        @Body("expense_id") expense_id: number,
        @Body("split") split: { [key: string]: number }
    ) {
        const auth = JwtUtils.validate_auth_token(jwt);
        return this.databaseService.alter_installment(auth, expense_id, split);
    }

    // update sanctioned amounts for a project
    @Post("update/sanction/:id")
    async alter_sanction(
        @Query("auth") jwt: string,
        @Param("id") project_id: number,
        @Body("head") head: string,
        @Body("amount") amount: number
    ) {
        const auth = JwtUtils.validate_auth_token(jwt);
        return this.databaseService.alter_sanction(auth, project_id, head, amount);
    }

    // update project details
    @Post("update/project/:id")
    async alter_project(
        @Query("auth") jwt: string,
        @Body("project") project: Project,
        @Param("id") project_id: number
    ) {
        const auth = JwtUtils.validate_auth_token(jwt);
        return this.databaseService.alter_project(auth, project_id, project);
    }

    // update account details
    @Post("update/account")
    async alter_account(
        @Query("auth") jwt: string,
        @Body("account") account: Account,
        @Body("email") email: string
    ) {
        const auth = JwtUtils.validate_auth_token(jwt);
        return this.databaseService.alter_account(auth, email, account);
    }

    // update access details (role)
    @Post("update/access/:id")
    async alter_access(
        @Query("auth") jwt: string,
        @Body("email") email: string,
        @Body("role") role: string,
        @Param("id") project_id: number
    ) {
        const auth = JwtUtils.validate_auth_token(jwt);
        return this.databaseService.alter_access(auth, email, project_id, role);
    }

    // update fellow details
    @Post("update/fellow/:id")
    async alter_fellow(
        @Query("auth") jwt: string,
        @Body("fellow") fellow: Fellow,
        @Param("id") fellow_id: number
    ) {
        const auth = JwtUtils.validate_auth_token(jwt);
        return this.databaseService.alter_fellow(auth, fellow, fellow_id);
    }

    // update pending project status
    @Post("update/pending/project/:id")
    async alter_pending_project(
        @Query("auth") jwt: string,
        @Body("accepted") accepted: boolean,
        @Param("id") pending_id: number
    ) {
        const auth = JwtUtils.validate_auth_token(jwt);
        return this.databaseService.alter_pending_project(auth, pending_id, accepted);
    }

    // update pending expense status
    @Post("update/pending/expense/:id")
    async alter_pending_expense(
        @Query("auth") jwt: string,
        @Body("accepted") accepted: boolean,
        @Param("id") pending_id: number
    ) {
        const auth = JwtUtils.validate_auth_token(jwt);
        return this.databaseService.alter_pending_expense(auth, pending_id, accepted);
    }

    // delete specific grants
    @Delete("grants")
    async delete_grants(@Query("auth") jwt: string, @Body("ids") ids: number[]) {
        const auth = JwtUtils.validate_auth_token(jwt);
        return this.databaseService.delete_grants(auth, ids);
    }

    // delete specific expenses
    @Delete("expenses")
    async delete_expenses(@Query("auth") jwt: string, @Body("ids") ids: number[]) {
        const auth = JwtUtils.validate_auth_token(jwt);
        return this.databaseService.delete_expenses(auth, ids);
    }

    // remove access of specific faculty from a specific project
    @Delete("access/:id")
    async delete_access(
        @Query("auth") jwt: string,
        @Body("emails") emails: string[],
        @Param("id") project_id: number
    ) {
        const auth = JwtUtils.validate_auth_token(jwt);
        return this.databaseService.delete_access(auth, emails, project_id);
    }

    // delete specific users
    @Delete("users")
    async delete_users(@Query("auth") jwt: string, @Body("emails") emails: string[]) {
        const auth = JwtUtils.validate_auth_token(jwt);
        return this.databaseService.delete_users(auth, emails);
    }

    // delete specific fellows
    @Delete("fellows")
    async delete_fellows(
        @Query("auth") jwt: string,
        @Body("fellow_ids") fellow_ids: number[]
    ) {
        const auth = JwtUtils.validate_auth_token(jwt);
        return this.databaseService.delete_fellows(auth, fellow_ids);
    }
}
