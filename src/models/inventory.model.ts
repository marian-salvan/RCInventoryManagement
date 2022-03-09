import { ReportProductModel } from "./reports.models";

export interface InventoryModel {
    date: Date;
    records: ReportProductModel[]
}