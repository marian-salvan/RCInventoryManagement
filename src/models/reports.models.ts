import { Timestamp } from "firebase/firestore";
import { ProductModel } from "./products.models";

export interface ReportModel {
    name: string;
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
