import { Timestamp } from "firebase/firestore";
import { ProductModel } from "./products.models";

export interface ReportModel {
    active: boolean;
    fromDate: Timestamp;
    toDate?: Timestamp;
    inventory: ReportProductModel[],
    packages: ReportCalculationModel
}

export interface ReportCalculationModel {
    quantity: number;
    totalPrice: number;
}

export interface ReportProductModel extends ReportCalculationModel, ProductModel {
}