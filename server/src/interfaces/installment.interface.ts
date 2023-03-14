export default interface Installment {
    particulars: string;
    voucher: string;
    date: string;
    split: { [key: string]: number };
    remarks: string;
}
