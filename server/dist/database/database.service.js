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
exports.DatabaseService = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
const Excel = require("exceljs");
// const PGUSER=postgres;
// const PGPASSWORD=root;
// const PGDATABASE=grants;
// const PGPORT=5432;
let DatabaseService = class DatabaseService {
    constructor() {
        this.pool = new pg_1.Pool({
            host: process.env.PGHOST,
            user: process.env.PGUSER,
            password: process.env.PGPASSWORD,
            database: process.env.PGDATABASE,
            port: +process.env.PGPORT,
            ssl: true
            // host: '127.0.0.1',
            // user: 'postgres',
            // password: 'root',
            // database: 'grants',
            // port: 5432,
        });

    }
    async verify_email(email) {
        console.log("DATABASEJS")
        const result = await this.pool.query("SELECT * FROM account WHERE email = $1::text", [email]);
        if (result.rowCount == 0)
            return null;
        return {

            email: result.rows[0].email,
            type: result.rows[0].type,
            name: result.rows[0].name,
            // email: "2020csb1107@iitrpr.ac.in",
            // type: "faculty",
            // name: "Arya",
        };

    }
    async project_details(auth, project_id) {
        if (!auth)
            return null;
        const result = await this.pool.query("SELECT * FROM get_project_details($1::text, $2::int)", [auth.email, project_id]);
        if (result.rowCount === 0)
            return null;
        return result.rows[0];
    }
    async user_details(auth) {
        if (!auth)
            return null;
        const result = await this.pool.query("SELECT * FROM account WHERE email = $1::text", [auth.email]);
        if (result.rowCount == 0)
            return null;
        return result.rows[0];
    }
    async view_grants(auth) {
        if (!auth)
            return null;
        return (await this.pool.query("SELECT * FROM get_ui_projects_with_pins($1::text)", [
            auth.email,
        ])).rows;
    }
    async view_grant_access(auth, project_id) {
        if (!auth)
            return null;
        return (await this.pool.query("SELECT * FROM get_ui_access($1::text, $2::int)", [
            auth.email,
            project_id,
        ])).rows;
    }
    async view_grant_expenses(auth, project_id) {
        if (!auth)
            return null;
        return (await this.pool.query(`SELECT * FROM get_ui_expenses($1::text, $2::${typeof project_id === "number" ? "int" : "int[]"})`, [auth.email, project_id])).rows;
    }
    async view_fellows(auth, project_id) {
        if (!auth)
            return null;
        return (await this.pool.query("SELECT * FROM get_ui_fellows($1::text, $2)", [
            auth.email,
            project_id,
        ])).rows;
    }
    async pin_project(auth, project_id) {
        if (!auth)
            return null;
        this.pool.query("CALL toggle_pin($1::text, $2::int)", [auth.email, project_id]);
    }
    async view_grant_budget(auth, project_id) {
        if (!auth)
            return null;
        return (await this.pool.query("SELECT * FROM get_budget($1::text, $2::int)", [
            auth.email,
            project_id,
        ])).rows;
    }
    async view_grant_remaining(auth, project_id, actual, committed) {
        if (!auth)
            return null;
        return (await this.pool.query("SELECT * FROM get_remaining_budget($1::text, $2::int, $3::boolean, $4::boolean) as foo", [auth.email, project_id, actual, committed])).rows[0].foo;
    }
    async view_active_faculty(auth) {
        if (!auth)
            return null;
        return (await this.pool.query("SELECT * FROM get_active_faculty()")).rows;
    }
    async view_all_accounts(auth) {
        if (!auth)
            return null;
        return (await this.pool.query("SELECT * FROM get_accounts($1::text)", [auth.email])).rows;
    }
    async view_pending_projects(auth) {
        if (!auth)
            return null;
        return (await this.pool.query("SELECT * FROM get_pending_projects($1::text)", [
            auth.email,
        ])).rows;
    }
    async view_pending_expenses(auth) {
        if (!auth)
            return null;
        return (await this.pool.query("SELECT * FROM get_pending_expenses($1::text)", [
            auth.email,
        ])).rows;
    }
    async get_project_sanction(auth, project_id) {
        if (!auth)
            return null;
        return (await this.pool.query("SELECT * FROM get_project_sanction($1::text, $2::int) as foo", [auth.email, project_id])).rows[0].foo;
    }
    async get_notifications(auth) {
        if (!auth)
            return null;
        return (await this.pool.query("SELECT * FROM get_notifications($1::text)", [
            auth.email,
        ])).rows;
    }
    async add_account(auth, account) {
        if (!auth)
            return null;
        return this.pool.query("CALL add_account($1::text, $2::text, $3::text, $4::text, $5::text)", [auth.email, account.email, account.type, account.dept, account.name]);
    }
    async add_project(auth, project) {
        if (!auth)
            return null;
        return this.pool.query("CALL add_project($1::text, $2::text, $3::date, $4::text, $5::jsonb, $6::text, $7::project_type, $8::text)", [
            auth.email,
            project.name,
            project.from,
            project.org,
            project.split,
            project.remarks,
            project.type,
            project.pi,
        ]);
    }
    async add_expense(auth, expense) {
        if (!auth)
            return null;
        return this.pool.query("CALL add_expense($1::text, $2::int, $3::text, $4::date, $5::numeric, $6::head_type, $7::text, $8::text)", [
            auth.email,
            expense.project_id,
            expense.particulars,
            expense.date ? new Date(+expense.date) : null,
            expense.amount,
            expense.head,
            expense.voucher_no,
            expense.remarks,
        ]);
    }
    async add_access(auth, email, project_id) {
        if (!auth)
            return null;
        return this.pool.query("CALL give_account_access($1::text, $2::text, $3::int, 'Co-PI'::role_type)", [auth.email, email, project_id]);
    }
    async add_installment(auth, project_id, installment) {
        if (!auth)
            return null;
        return this.pool.query("CALL add_installment($1::text, $2::int, $3::text, $4::text, $5::date, $6::json, $7::text)", [
            auth.email,
            project_id,
            installment.particulars,
            installment.voucher,
            new Date(Date.parse(installment.date)),
            installment.split,
            installment.remarks,
        ]);
    }
    async add_fellow(auth, project_id, fellow) {
        if (!auth)
            return null;
        return this.pool.query("CALL add_fellow($1::text, $2::text, $3::int, $4::fellow_type, $5::numeric, $6::boolean, $7::numeric, $8::date, $9::date)", [
            auth.email,
            fellow.name,
            project_id,
            fellow.type,
            fellow.salary,
            fellow.hostel,
            fellow.hra,
            fellow.from_date,
            fellow.to_date,
        ]);
    }
    async add_project_excel(auth, params, file) {
        if (!auth || !file)
            return null;
        let project = {
            name: params.name,
            pi: params.faculty,
            type: params.projType,
            from: params.fromDate,
            to: null,
            org: params.org,
            split: {},
            remarks: "",
        };
        const client = await this.pool.connect();
        try {
            const wb = new Excel.Workbook();
            await wb.xlsx.load(file.buffer);
            const ws = wb.worksheets[0];
            const cellStringToRC = (cell) => {
                cell = cell.toLowerCase();
                let i = 0;
                let c = 0;
                for (; i < cell.length; i++) {
                    if (cell[i].match(/[a-z]/i)) {
                        c *= 26;
                        c += cell[i].charCodeAt(0) - "a".charCodeAt(0) + 1;
                        continue;
                    }
                    break;
                }
                let r = +cell.substring(i);
                return [r, c];
            };
            const stringToHead = (str) => {
                if (str.match(/grant/i))
                    return "grant";
                else if (str.match(/unforseen/i))
                    return "contingency";
                else if (str.match(/consumable/i))
                    return "consumable";
                else if (str.match(/overstr/i))
                    return "overhead";
                else if (str.match(/equipment/i))
                    return "equipment";
                else if (str.match(/contingency/i))
                    return "contingency";
                else if (str.match(/manpower/i))
                    return "manpower";
                else if (str.match(/consult/i))
                    return "consultancy_amount";
                else if (str.match(/travel/i))
                    return "travel";
                else
                    return "others";
            };
            const expStart = cellStringToRC(params.expensesStartCell);
            const expEnd = cellStringToRC(params.expensesEndCell);
            const budStart = cellStringToRC(params.budgetStartCell);
            const budEnd = cellStringToRC(params.budgetEndCell);
            const headHead = budStart[1] + 1;
            const sanctionHead = budStart[1] + 2;
            let budgetRow = budStart[0] + 1;
            for (; budgetRow < budEnd[0]; budgetRow += 1) {
                project.split[stringToHead(ws.getCell(budgetRow, headHead).value.toString())] = +ws.getCell(budgetRow, sanctionHead).value;
            }
            await client.query("CALL add_project($1::text, $2::text, $3::date, $4::text, $5::jsonb, $6::text, $7::project_type, $8::text)", [
                auth.email,
                project.name,
                new Date(Date.parse(project.from)),
                project.org,
                project.split,
                project.remarks,
                project.type,
                project.pi,
            ]);
            const proj_id = (await client.query("SELECT * FROM get_project_by_name($1::text, $2::text) AS foo", [auth.email, project.name])).rows[0].foo;
            let installmentHead = budStart[1] + 3;
            budgetRow = budStart[0] + 1;
            let expenseRow = expStart[0] + 1;
            for (; expenseRow < expEnd[0]; expenseRow++) {
                const head = stringToHead(ws
                    .getCell(expenseRow, expStart[1] + 7)
                    .value.toString()
                    .toLowerCase());
                let particulars_cell = ws.getCell(expenseRow, expStart[1] + 1);
                let expense = {
                    project_id: 0,
                    particulars: particulars_cell.type === Excel.ValueType.RichText
                        ? particulars_cell.value.richText
                            .map(x => x.text)
                            .join()
                        : particulars_cell.value,
                    date: ws.getCell(expenseRow, expStart[1] + 3).value,
                    amount: 0,
                    head,
                    voucher_no: null,
                    remarks: ws.getCell(expenseRow, expStart[1] + 2).value,
                };
                if (head !== "grant") {
                    expense.amount = +ws.getCell(expenseRow, expStart[1] + 5).value;
                    try {
                        await client.query("CALL add_expense($1::text, $2::int, $3::text, $4::date, $5::numeric, $6::head_type, $7::text, $8::text)", [
                            auth.email,
                            proj_id,
                            expense.particulars,
                            typeof expense.date === "string"
                                ? new Date(Date.parse(expense.date))
                                : expense.date,
                            expense.amount,
                            expense.head,
                            expense.voucher_no,
                            expense.remarks,
                        ]);
                    }
                    catch (e) {
                        console.error(e);
                    }
                }
                else {
                    let split = {};
                    for (; budgetRow < budEnd[0]; budgetRow++) {
                        split[stringToHead(ws.getCell(budgetRow, headHead).value.toString())] = +ws.getCell(budgetRow, installmentHead).value.toString();
                    }
                    budgetRow = budStart[0] + 1;
                    installmentHead += 1;
                    try {
                        await client.query("CALL add_installment($1::text, $2::int, $3::text, $4::text, $5::date, $6::json, $7::text)", [
                            auth.email,
                            proj_id,
                            expense.particulars,
                            expense.voucher_no,
                            typeof expense.date === "string"
                                ? new Date(Date.parse(expense.date))
                                : expense.date,
                            split,
                            expense.remarks,
                        ]);
                    }
                    catch (e) {
                        console.error(e);
                    }
                }
            }
        }
        catch (e) {
            console.error(e);
            const proj_id = (await client.query("SELECT * FROM get_project_by_name($1::text, $2::text) AS foo", [auth.email, project.name])).rows[0].foo;
            if (proj_id !== null)
                await client.query("CALL delete_projects($1::text, $2::int[])", [
                    auth.email,
                    [proj_id],
                ]);
        }
        finally {
            client.release();
        }
    }
    async alter_expense(auth, expense_id, expense) {
        if (!auth)
            return null;
        return await this.pool.query("CALL alter_expense($1::text, $2::int, $3::text, $4::text, $5::date, $6::numeric, $7::head_type, $8::text)", [
            auth.email,
            expense_id,
            expense.particulars,
            expense.voucher_no,
            expense.date !== null ? new Date(Date.parse(expense.date)) : null,
            expense.amount,
            expense.head,
            expense.remarks,
        ]);
    }
    async alter_installment(auth, expense_id, split) {
        if (!auth)
            return null;
        return await this.pool.query("CALL alter_installment($1::text, $2::int, $3::json)", [auth.email, expense_id, split]);
    }
    async alter_sanction(auth, project_id, head, amount) {
        if (!auth)
            return null;
        return await this.pool.query("CALL alter_project_sanction($1::text, $2::int, $3::head_type, $4::numeric)", [auth.email, project_id, head, amount]);
    }
    async alter_project(auth, project_id, project) {
        if (!auth)
            return null;
        return await this.pool.query("CALL alter_project($1::text, $2::int, $3::text, $4::project_type, $5::date, $6::date, $7::text, $8::text, $9::text)", [
            auth.email,
            project_id,
            project.name,
            project.type,
            new Date(Date.parse(project.from)),
            project.to ? new Date(Date.parse(project.to)) : null,
            project.org,
            project.remarks,
            project.pi,
        ]);
    }
    async alter_account(auth, email, account) {
        if (!auth)
            return null;
        return await this.pool.query("CALL alter_account($1::text, $2::text, $3::text, $4::text, $5::text, $6::text)", [auth.email, account.name, email, account.email, account.type, account.dept]);
    }
    async alter_access(auth, email, project_id, role) {
        if (!auth)
            return null;
        return await this.pool.query("CALL alter_access($1::text, $2::text, $3::int, $4::role_type)", [auth.email, email, project_id, role]);
    }
    async alter_fellow(auth, fellow, fellow_id) {
        if (!auth)
            return null;
        return await this.pool.query("CALL alter_fellow($1::text, $2::int, $3::fellow_type, $4::numeric, $5::boolean, $6::numeric, $7::text, $8::date, $9::date)", [
            auth.email,
            fellow_id,
            fellow.type,
            fellow.salary,
            fellow.hostel,
            fellow.hra,
            fellow.name,
            new Date(Date.parse(fellow.from_date)),
            fellow.to_date ? new Date(Date.parse(fellow.to_date)) : null,
        ]);
    }
    async alter_pending_project(auth, pending_id, accepted) {
        if (!auth)
            return null;
        return await this.pool.query("CALL resolve_pending_project($1::text, $2::int, $3::boolean)", [auth.email, pending_id, accepted]);
    }
    async alter_pending_expense(auth, pending_id, accepted) {
        if (!auth)
            return null;
        return await this.pool.query("CALL resolve_pending_expense($1::text, $2::int, $3::boolean)", [auth.email, pending_id, accepted]);
    }
    async delete_grants(auth, project_ids) {
        if (!auth)
            return null;
        return await this.pool.query("CALL delete_projects($1::text, $2::int[])", [
            auth.email,
            project_ids,
        ]);
    }
    async delete_expenses(auth, expense_ids) {
        if (!auth)
            return null;
        return await this.pool.query("CALL delete_expenses($1::text, $2::int[])", [
            auth.email,
            expense_ids,
        ]);
    }
    async delete_access(auth, emails, project_id) {
        if (!auth)
            return null;
        return await this.pool.query("CALL delete_access($1::text, $2::text[], $3::int)", [auth.email, emails, project_id]);
    }
    async delete_users(auth, emails) {
        if (!auth)
            return null;
        return await this.pool.query("CALL delete_users($1::text, $2::text[])", [
            auth.email,
            emails,
        ]);
    }
    async delete_fellows(auth, fellow_ids) {
        if (!auth)
            return null;
        return await this.pool.query("CALL delete_fellows($1::text, $2::int[])", [
            auth.email,
            fellow_ids,
        ]);
    }
};
DatabaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], DatabaseService);
exports.DatabaseService = DatabaseService;
//# sourceMappingURL=database.service.js.map
