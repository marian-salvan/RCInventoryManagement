import { Timestamp } from "firebase/firestore";
import { ProductModel } from "./products.models";

export interface ReportModel {
    active: boolean;
    fromDate: Timestamp;
    toDate?: Timestamp | null;
    inventory: ReportProductModel[],
    packages: ReportCalculationModel
}

export interface ReportCalculationModel {
    quantity: number;
    totalPrice: number;
}

export interface ReportProductModel extends ReportCalculationModel, ProductModel {
}

export let defaultReportModel: ReportModel = {
    active: true,
    fromDate: Timestamp.fromDate(new Date()),
    toDate: null,
    inventory: [],
    packages: {
        quantity: 0,
        totalPrice: 0
    }
};