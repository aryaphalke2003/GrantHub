import { Grid } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import MyCard from "./MyCard";
import { MyH5, MyP } from "./MyTypography";

const DescPaper = ({ header, children }) => (
    <MyCard>
        <MyH5>{header}</MyH5>
        <MyP>{children}</MyP>
    </MyCard>
);

// Project description at the top of every project page
export default function ProjectDescription({
    project_id,
    typeCallback,
}: {
    project_id: number;
    typeCallback?: (type: string) => void;
}) {
    const [cookies] = useCookies(["auth_jwt"]);
    const [name, setName] = useState<string>("");
    const [org, setOrg] = useState<string>("");
    const [total, setTotal] = useState<number>(0);
    
    const [type, setType] = useState<string>("");
    const [pi, setPi] = useState<string>("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    // fetch dats
    useEffect(() => {
        axios
            .get(`/api/grants/${project_id}`, {
                params: { auth: cookies.auth_jwt },
            })
            .then(({ data }) => {
                if (data === null) return;
                setName(data.name);
                setOrg(data.organization);
                setTotal(data.total_cost);
                setType(data.type);
                setPi(`${data.pi_name} (${data.pi_email})`);
                typeCallback(data.type);
                let d = new Date(Date.parse(data.from_date));
                setFromDate(`${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`);
                if (data.to_date === null) setToDate("-");
                else {
                    d = new Date(Date.parse(data.to_date));
                    setToDate(`${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`);
                }
            });
    }, [project_id]);

    return (
        <>
            <Grid container spacing={4}>
                <Grid item xs={2}>
                    <DescPaper header="Project No.:">{project_id}</DescPaper>
                </Grid>
                <Grid item xs={2}>
                    <DescPaper header="Sanction No.:">{project_id}</DescPaper>
                </Grid>
                <Grid item xs={2}>
                    <DescPaper header="PI:">{pi}</DescPaper>
                </Grid>
                <Grid item xs={2}>
                    <DescPaper header="Co PI:">{pi}</DescPaper>
                </Grid>
                <Grid item xs={2}>
                    <DescPaper header="Funding Agency:">{org}</DescPaper>
                </Grid>
                <Grid item xs={2}>
                    <DescPaper header="Title:">{name}</DescPaper>
                </Grid>
                <Grid item xs={2}>
                    <DescPaper header="Total Cost:">₹{total}</DescPaper>
                </Grid>
               
                <Grid item xs={2}>
                    <DescPaper header="Type:">{type}</DescPaper>
                </Grid>
                
                <Grid item xs={2}>
                    <DescPaper header="DOJ:">{fromDate}</DescPaper>
                </Grid>
                <Grid item xs={2}>
                    <DescPaper header="DOE:">{toDate}</DescPaper>
                </Grid>
            </Grid>
        </>
    );
}

             
