import { Timestamp } from "firebase/firestore";
import { ReportModel } from "../models/reports.models";

export let defaultReportModel: ReportModel = {
    name: "",
    active: true,
    fromDate: Timestamp.fromDate(new Date()),
    toDate: null,
    inventory: [],
    packages: {
        quantity: 0,
        totalPackages: 0
    }
};