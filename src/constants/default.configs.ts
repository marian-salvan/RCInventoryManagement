import { Timestamp } from "firebase/firestore";
import { InventoryReport, PacakagesReport } from "../models/reports.models";

export let defaultInventoryReportModel: InventoryReport = {
    uid: "",
    name: "",
    active: true,
    fromDate: Timestamp.fromDate(new Date()),
    toDate: null,
    inventory: [],
};

export let defaulPackagesReportModel: PacakagesReport = {
    uid: "",
    name: "",
    active: true,
    fromDate: Timestamp.fromDate(new Date()),
    toDate: null,
    packages: {
        quantity: 0,
        totalPackages: 0
    }
}

