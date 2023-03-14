export default interface Expense {
    project_id: number,
    particulars: string,
    date: string,
    amount: number,
    head: string,
    voucher_no: string | null,
    remarks: string | null,
}