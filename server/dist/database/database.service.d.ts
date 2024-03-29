/// <reference types="multer" />
import Account from "src/interfaces/account.interface";
import AuthToken from "src/interfaces/authtoken.interface";
import ExcelProjectParams from "src/interfaces/excel_project_params.interface";
import Expense from "src/interfaces/expense.interface";
import Fellow from "src/interfaces/fellow.interface";
import Installment from "src/interfaces/installment.interface";
import Project from "src/interfaces/project.interface";
export declare class DatabaseService {
    private readonly pool;
    constructor();
    verify_email(email: string): Promise<AuthToken>;
    project_details(auth: AuthToken, project_id: number): Promise<any>;
    co_project_details(auth: AuthToken, project_id: number): Promise<any>;
    user_details(auth: AuthToken): Promise<Account>;
    view_grants(auth: AuthToken): Promise<any[]>;
    view_grant_access(auth: AuthToken, project_id: number): Promise<any[]>;
    view_grant_expenses(auth: AuthToken, project_id: number | number[]): Promise<any[]>;
    view_fellows(auth: AuthToken, project_id: number | null): Promise<any[]>;
    pin_project(auth: AuthToken, project_id: number): Promise<any>;
    view_grant_budget(auth: AuthToken, project_id: number): Promise<any[]>;
    view_grant_remaining(auth: AuthToken, project_id: number, actual: boolean, committed: boolean): Promise<any>;
    view_active_faculty(auth: AuthToken): Promise<any[]>;
    view_all_accounts(auth: AuthToken): Promise<any[]>;
    view_pending_projects(auth: AuthToken): Promise<any[]>;
    view_pending_expenses(auth: AuthToken): Promise<any[]>;
    get_project_sanction(auth: AuthToken, project_id: number): Promise<any>;
    get_notifications(auth: AuthToken): Promise<any[]>;
    add_account(auth: AuthToken, account: Account): Promise<import("pg").QueryResult<any>>;
    add_project(auth: AuthToken, project: Project): Promise<import("pg").QueryResult<any>>;
    add_expense(auth: AuthToken, expense: Expense): Promise<import("pg").QueryResult<any>>;
    add_access(auth: AuthToken, email: string, project_id: number): Promise<import("pg").QueryResult<any>>;
    add_installment(auth: AuthToken, project_id: number, installment: Installment): Promise<import("pg").QueryResult<any>>;
    add_fellow(auth: AuthToken, project_id: number, fellow: Fellow): Promise<import("pg").QueryResult<any>>;
    add_excel_project(auth: AuthToken, params: ExcelProjectParams, file: Express.Multer.File): Promise<any>;
    alter_expense(auth: AuthToken, expense_id: number, expense: Expense): Promise<import("pg").QueryResult<any>>;
    alter_installment(auth: AuthToken, expense_id: number, split: {
        [key: string]: number;
    }): Promise<import("pg").QueryResult<any>>;
    alter_sanction(auth: AuthToken, project_id: number, head: string, amount: number): Promise<import("pg").QueryResult<any>>;
    alter_project(auth: AuthToken, project_id: number, project: Project): Promise<import("pg").QueryResult<any>>;
    alter_account(auth: AuthToken, email: string, account: Account): Promise<import("pg").QueryResult<any>>;
    alter_access(auth: AuthToken, email: string, project_id: number, role: string): Promise<import("pg").QueryResult<any>>;
    alter_fellow(auth: AuthToken, fellow: Fellow, fellow_id: number): Promise<import("pg").QueryResult<any>>;
    alter_pending_project(auth: AuthToken, pending_id: number, accepted: boolean): Promise<import("pg").QueryResult<any>>;
    alter_pending_expense(auth: AuthToken, pending_id: number, accepted: boolean): Promise<import("pg").QueryResult<any>>;
    delete_grants(auth: AuthToken, project_ids: number[]): Promise<import("pg").QueryResult<any>>;
    delete_expenses(auth: AuthToken, expense_ids: number[]): Promise<import("pg").QueryResult<any>>;
    delete_access(auth: AuthToken, emails: string[], project_id: number): Promise<import("pg").QueryResult<any>>;
    delete_users(auth: AuthToken, emails: string[]): Promise<import("pg").QueryResult<any>>;
    delete_fellows(auth: AuthToken, fellow_ids: number[]): Promise<import("pg").QueryResult<any>>;
}
