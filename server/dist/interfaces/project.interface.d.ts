export default interface Project {
    name: string;
    pi: string;
    type: string;
    from: string;
    to: string;
    org: string;
    split: {
        [key: string]: number;
    };
    remarks: string;
}
